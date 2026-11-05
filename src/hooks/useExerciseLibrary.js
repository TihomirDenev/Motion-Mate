import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useDatabaseValue } from './useDatabaseValue';

export function useExerciseLibrary() {
  const { userData } = useContext(AppContext);
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
      queued: userData?.workoutListInitialized
        ? Boolean(userData.workoutList?.[exercise.id])
        : exercise.createdBy === userData?.username &&
          exercise.inProgress === true,
    })),
    loading,
    error,
  };
}
