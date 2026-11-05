import { get, ref, runTransaction, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export async function setExerciseQueued(user, exercise, queued) {
  const base = `users/${user.username}`;
  const changes = {};
  if (!user.workoutListInitialized) {
    const snapshot = await get(ref(db, 'exercises'));
    for (const [category, exercises] of Object.entries(snapshot.val() || {})) {
      for (const [id, item] of Object.entries(exercises)) {
        if (item.createdBy === user.username && item.inProgress)
          changes[`${base}/workoutList/${id}`] = category;
      }
    }
    changes[`${base}/workoutListInitialized`] = true;
  }
  changes[`${base}/workoutList/${exercise.id}`] = queued
    ? exercise.categoryName
    : null;
  await update(ref(db), changes);
}

export async function beginExercise(username, exercise) {
  const duration =
    Number(exercise.duration?.hours || 0) * 3600 +
    Number(exercise.duration?.minutes || 0) * 60 +
    Number(exercise.duration?.seconds || 0);
  if (!Number.isFinite(duration) || duration <= 0)
    throw new Error(
      'This exercise needs a valid duration before it can start.'
    );
  const result = await runTransaction(
    ref(db, `users/${username}/endCurrentExercise`),
    (current) => {
      if (current) return;
      return {
        timeLeft: Date.now() + duration * 1000,
        exerciseId: exercise.id,
        title: exercise.title,
        calories: Number(exercise.calories) || 0,
        countOnComplete: true,
      };
    }
  );
  if (!result.committed)
    throw new Error(
      'Finish or stop your current exercise before starting another.'
    );
}

export async function finishExercise(username, exerciseId) {
  const now = Date.now();
  await runTransaction(ref(db, `users/${username}`), (user) => {
    const current = user?.endCurrentExercise;
    if (!current || current.exerciseId !== exerciseId || current.timeLeft > now)
      return;
    const calories = Number(current.calories) || 0;
    const scores = current.countOnComplete
      ? {
          doneExercises: (Number(user.updatedScores?.doneExercises) || 0) + 1,
          updatedCalories:
            (Number(user.updatedScores?.updatedCalories) || 0) + calories,
        }
      : {
          doneExercises: Number(user.previousScores?.doneExercises) || 0,
          updatedCalories: Number(user.previousScores?.previousCalories) || 0,
        };
    user.updatedScores = scores;
    user.previousScores = {
      doneExercises: scores.doneExercises,
      previousCalories: scores.updatedCalories,
    };
    for (const goal of Object.values(user.myGoals || {})) {
      if (
        goal.timePeriod?.from > current.timeLeft ||
        goal.timePeriod?.to < current.timeLeft
      )
        continue;
      goal.exercisesDone = (Number(goal.exercisesDone) || 0) + 1;
      goal.caloriesBurned = (Number(goal.caloriesBurned) || 0) + calories;
      if (goal.type === 'exercises' && Number(goal.exercises) > 0)
        goal.progress = Math.min(
          100,
          Math.round((goal.exercisesDone / goal.exercises) * 100)
        );
      if (goal.type === 'calories' && Number(goal.calories) > 0)
        goal.progress = Math.min(
          100,
          Math.round((goal.caloriesBurned / goal.calories) * 100)
        );
    }
    const day = new Date(current.timeLeft).toLocaleDateString('en-CA');
    user.activityHistory ||= {};
    user.activityHistory[day] = (Number(user.activityHistory[day]) || 0) + 1;
    user.endCurrentExercise = null;
    return user;
  });
}

export async function cancelExercise(username) {
  await runTransaction(ref(db, `users/${username}`), (user) => {
    if (!user?.endCurrentExercise) return;
    if (!user.endCurrentExercise.countOnComplete && user.previousScores) {
      user.previousScores.doneExercises = Math.max(
        0,
        (Number(user.previousScores.doneExercises) || 0) - 1
      );
      user.previousScores.previousCalories = Math.max(
        0,
        (Number(user.previousScores.previousCalories) || 0) -
          Number(user.endCurrentExercise.calories || 0)
      );
    }
    user.endCurrentExercise = null;
    return user;
  });
}
