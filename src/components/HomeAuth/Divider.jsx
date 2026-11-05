import { useContext, useEffect, useState } from 'react';
import AlertError from '../Alerts/AlertError/AlertError';
import AlertSuccess from '../Alerts/AlertSuccess/AlertSuccess';
import { onValue, ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { AppContext } from '../../context/AppContext';
import {
  endExercise,
  startExercise,
  stopTimerRemoveCalories,
} from '../../services/users.service';
import { ExerciseCard } from '../Exercise/ExerciseCard';
import { RemoveFromListButton } from '../Exercise/RemoveFromListButton';
import { handleOnStart } from '../../helper/exercise-timer';
import { FinishedGoal } from './FinishedGoal';
import { NoActivityCard } from './NoActivityCard';
import { useNavigate } from 'react-router';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export const Divider = ({ stopButton }) => {
  const { userData } = useContext(AppContext);
  const [inProgress, setInProgress] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const friendsRef = ref(db, `users/${userData?.username}/friends`);
    const unsubscribe = onValue(friendsRef, (snapshot) => {
      const friendsList = snapshot?.val() ? Object.keys(snapshot.val()) : [];
      setFriends(friendsList);
    });

    return () => unsubscribe();
  }, [userData?.username]);

  useEffect(() => {
    const exercisesRef = ref(db, 'exercises');
    const unsubscribe = onValue(exercisesRef, (snapshot) => {
      try {
        const exercises = snapshot.val();
        const allExercises = [];

        Object.values(exercises ?? {}).forEach((exercise) => {
          Object.entries(exercise).forEach(([exerciseId, exerciseData]) => {
            allExercises.push({ id: exerciseId, ...exerciseData });
          });
        });

        const userExercises = allExercises.filter(
          (exercise) =>
            exercise.inProgress === true &&
            exercise.createdBy === userData.username
        );

        const friendExercises = friends
          .map((friend) =>
            allExercises.filter(
              (exercise) =>
                exercise.createdBy === friend && exercise.inProgress === true
            )
          )
          .flat();

        setInProgress([...userExercises, ...friendExercises]);
      } catch (error) {
        setShowError(true);
        setAlertMessage(error.message);
      }
    });

    return () => unsubscribe();
  }, [friends, userData?.username]);

  const stopTimer = async (exercise) => {
    await endExercise(userData?.username);
    await stopTimerRemoveCalories(userData?.username, exercise.calories);
  };

  return (
    <div>
      {inProgress.length > 0 ? (
        <div className='flex flex-col lg:flex-row'>
          <div className='flex-1'>
            {inProgress.map((exercise) => (
              <div
                key={exercise.id}
                className='flex flex-col items-center'
              >
                <div className='card w-96 bg-base-300 m-2'>
                  <div className='card-body p-4'>
                    <ExerciseCard
                      exercise={exercise}
                      userData={userData}
                    />
                    <div className='card-actions mt-2 justify-end'>
                      <RemoveFromListButton
                        exercise={exercise}
                        category={exercise.categoryName}
                        setAlertMessage={setAlertMessage}
                        setShowSuccess={setShowSuccess}
                        setShowError={setShowError}
                      />

                      {stopButton === exercise.id ? (
                        <button
                          className='btn btn-primary'
                          onClick={() => stopTimer(exercise)}
                        >
                          Stop
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleOnStart(exercise, startExercise, userData);
                          }}
                          className='btn btn-secondary'
                        >
                          Start
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='divider lg:divider-horizontal my-auto'>OR</div>
          <div className='flex-1 flex flex-col items-center'>
            <FinishedGoal />
          </div>
        </div>
      ) : (
        <div className='flex flex-col place-content-center lg:flex-row'>
          <div className='flex flex-col items-center'>
            <NoActivityCard
              onClick={() => navigate('/exercises')}
              icon={faHeart}
              title={'No exercises in progress!'}
              content={
                'Create and add your exercises here so you can keep track of duration and burned calories!'
              }
            />
          </div>
          <div className='divider lg:divider-horizontal my-auto'>OR</div>
          <div className='flex flex-col items-center'>
            <FinishedGoal />
          </div>
        </div>
      )}
      {showError && <AlertError message={alertMessage} />}
      {showSuccess && <AlertSuccess message={alertMessage} />}
    </div>
  );
};
