import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useDatabaseValue } from './useDatabaseValue';
import { useTranslation } from '../i18n/useTranslation';
import { exerciseText } from '../helper/exercise-text';

export function useExerciseLibrary() {
  const { userData } = useContext(AppContext);
  const { language } = useTranslation();
  const { data, loading, error } = useDatabaseValue(
    userData ? 'exercises' : null
  );
  const friends = userData?.friends || {};
  const exercises = Object.entries(data || {}).flatMap(
    ([categoryName, category]) =>
      Object.entries(category || {}).map(([id, exercise]) => ({
        ...exercise,
        id,
        categoryName,
      }))
  );
  const visible = exercises.filter(
    (exercise) =>
      exercise.createdBy === userData?.username || friends[exercise.createdBy]
  );
  return {
    exercises: visible.map((exercise) => ({
      ...exercise,
      display: exerciseText(exercise, language),
      queued: userData?.workoutListInitialized
        ? Boolean(userData.workoutList?.[exercise.id])
        : exercise.createdBy === userData?.username &&
          exercise.inProgress === true,
    })),
    loading,
    error,
  };
}
