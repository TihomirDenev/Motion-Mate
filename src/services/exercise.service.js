import { get, push, ref, remove, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createExercises = async (
  categoryName,
  title,
  content,
  hours,
  minutes,
  seconds,
  calories,
  level,
  createdBy
) => {
  const exercise = {
    categoryName,
    title,
    content,
    duration: {
      hours,
      minutes,
      seconds,
    },
    calories,
    level,
    createdBy,
    inProgress: false,
  };

  try {
    const result = await push(ref(db, `exercises/${categoryName}`), exercise);
    return result.key;
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const getExercises = async () => {
  try {
    const snapshot = await get(ref(db, `exercises`));
    return Object.values(snapshot.val() || {});
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const deleteExercise = async (categoryName, exerciseId) => {
  try {
    const postRef = ref(db, `exercises/${categoryName}/${exerciseId}`);
    await remove(postRef);
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const addExerciseInProgress = async (categoryName, exerciseId) => {
  try {
    return await update(ref(db, `exercises/${categoryName}/${exerciseId}`), {
      inProgress: true,
    });
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const removeExerciseInProgress = async (categoryName, exerciseId) => {
  try {
    return await update(ref(db, `exercises/${categoryName}/${exerciseId}`), {
      inProgress: false,
    });
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const editExercise = async (categoryName, exerciseId, data) => {
  try {
    return await update(
      ref(db, `exercises/${categoryName}/${exerciseId}`),
      data
    );
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};
