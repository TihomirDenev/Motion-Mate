import {
  GOAL_MIN_CALORIES,
  GOAL_MIN_EXERCISES,
  GOAL_MIN_PROGRESS,
} from '../common/constants';
import { goalCreateValidation } from '../common/goal.validations';
import { db } from '../config/firebase-config';
import { get, push, ref, remove, set, update } from 'firebase/database';

export const createGoal = async (
  name,
  owner,
  timePeriodStart,
  timePeriodEnd,
  type,
  exercises = GOAL_MIN_EXERCISES,
  progress = GOAL_MIN_PROGRESS,
  calories = GOAL_MIN_CALORIES
) => {
  try {
    const snapshot = await get(ref(db, `users/${owner}/myGoals/`));
    snapshot.forEach((child) => {
      if (child.val().name === name) {
        throw new Error('Goal with this name already exists');
      }
    });
    goalCreateValidation(
      name,
      owner,
      timePeriodStart,
      timePeriodEnd,
      exercises,
      progress,
      calories
    );
    const goal = {
      name,
      owner,
      timePeriod: {
        from: timePeriodStart,
        to: timePeriodEnd,
      },
      sharedWith: null,
      type,
      exercises,
      progress,
      calories,
      exercisesDone: 0,
      caloriesBurned: 0,
    };

    const goalId = await push(ref(db, `users/${owner}/myGoals/`), goal);

    return goalId;
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const getGoals = async (username) => {
  try {
    const result = [];
    const snapshot = await get(ref(db, `users/${username}/myGoals/`));
    snapshot.forEach((child) => {
      result.push({
        id: child.key,
        ...child.val(),
      });
    });

    return result;
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const getGoalById = async (username, goalId) => {
  try {
    const goal = await get(ref(db, `users/${username}/myGoals/${goalId}`));
    return await goal.val();
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const updateGoal = async (username, goalId, updates) => {
  try {
    const goal = await getGoalById(username, goalId);
    return await set(ref(db, `users/${username}/myGoals/${goalId}`), {
      ...goal,
      ...updates,
    });
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const deleteGoal = async (username, goalId) => {
  try {
    await remove(ref(db, `users/${username}/myGoals/${goalId}`));
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const getGoalProgress = async (username, goalId) => {
  try {
    const progress = await get(
      ref(db, `users/${username}/myGoals/${goalId}/progress`)
    );
    return progress.val();
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const updateGoalProgress = async (username, goalId, progress) => {
  if (!Number.isFinite(progress) || progress < 0 || progress > 100)
    throw new Error('Progress must be between 0 and 100.');
  try {
    return await set(
      ref(db, `users/${username}/myGoals/${goalId}/progress`),
      progress
    );
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const markAsDone = async (username, goalId) => {
  try {
    await update(ref(db, `users/${username}/myGoals/${goalId}`), {
      isDone: true,
    });
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const updateGoalCalories = async (username, goal, goalId, calories) => {
  try {
    const base = `users/${username}/myGoals/${goalId}`;

    const caloriesGoal = goal?.calories;
    const exercisesDone = goal?.exercisesDone + 1;
    const currentCalories = goal?.caloriesBurned;
    const totalCalories = Number(currentCalories) + Number(calories);

    const newCalorieProgress = (totalCalories / caloriesGoal) * 100 || 0;
    const newExercisesProgress = (exercisesDone / goal?.exercises) * 100 || 0;

    const updatedGoal = {};
    updatedGoal[`${base}/exercisesDone/`] = exercisesDone;
    updatedGoal[`${base}/caloriesBurned/`] = totalCalories;

    goal?.type === 'calories' &&
      (updatedGoal[`${base}/progress/`] = Number(
        newCalorieProgress.toFixed(2)
      ));

    goal?.type === 'exercises' &&
      (updatedGoal[`${base}/progress/`] = Number(
        newExercisesProgress.toFixed(2)
      ));

    await update(ref(db), updatedGoal);
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const getGoalsByProgress = async (username) => {
  try {
    const result = [];
    const snapshot = await get(ref(db, `users/${username}/myGoals/`));
    snapshot.forEach((child) => {
      result.push({
        id: child.key,
        ...child.val(),
      });
    });

    const filtered = result.filter((goal) => goal?.progress >= 100);
    return filtered;
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};
