import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { calculateTimeLeft } from '../../helper/format-date';
import { endExercise, whenTimerEnds } from '../../services/users.service';
import { onValue, ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { Timer } from './Timer';
import { StartWorkoutButton } from './StartWorkoutButton';
import { getGoals, updateGoalCalories } from '../../services/goal.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDumbbell,
  faHeartPulse,
  faPersonRunning,
  faStopwatch20,
} from '@fortawesome/free-solid-svg-icons';
import { ResetScoresButton } from './ResetScoresButton';

export const AccountStats = ({
  timer,
  setStopButton,
  workoutTimer,
  startWorkout,
  setStartWorkout,
  calories,
}) => {
  const { userData } = useContext(AppContext);
  const [currentCalories, setCurrentCalories] = useState(0);
  const [doneExercises, setDoneExercises] = useState(0);
  const [timerState, setTimerState] = useState(null);
  const [workoutTimerState, setWorkoutTimerState] = useState(null);
  const username = userData?.username;

  const timeLeft = timer && timerState?.timer === timer ? timerState : null;
  const workoutTimeLeft =
    workoutTimer && workoutTimerState?.timer === workoutTimer
      ? workoutTimerState
      : null;

  useEffect(() => {
    return onValue(ref(db, `users/${username}/updatedScores`), (snapshot) => {
      setCurrentCalories(snapshot?.val()?.updatedCalories);
      setDoneExercises(snapshot?.val()?.doneExercises);
    });
  }, [username]);

  useEffect(() => {
    if (!timer) return;

    const updateCalories = async () => {
      const allGoals = await getGoals(username);
      await whenTimerEnds(username);
      await endExercise(username);
      const today = new Date().getTime();
      await Promise.all(
        allGoals
          .filter(
            (goal) =>
              goal?.timePeriod?.from <= today && goal?.timePeriod?.to >= today
          )
          .map((goal) => updateGoalCalories(username, goal, goal?.id, calories))
      );
    };

    const intervalId = setInterval(() => {
      setTimerState({ timer, ...calculateTimeLeft(new Date(timer)) });

      if (new Date(timer).getTime() <= Date.now()) {
        clearInterval(intervalId);
        updateCalories();
        setStopButton('');
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer, username, calories, setStopButton]);

  useEffect(() => {
    if (!workoutTimer) return;

    const intervalId = setInterval(() => {
      setWorkoutTimerState({
        timer: workoutTimer,
        ...calculateTimeLeft(new Date(workoutTimer)),
      });

      if (new Date(workoutTimer).getTime() <= Date.now()) {
        clearInterval(intervalId);
        setStartWorkout(false);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [workoutTimer, setStartWorkout]);

  return (
    <div className='flex flex-col items-center w-full mb-5'>
      <div className='stats stats-vertical md:stats-horizontal bg-base-100 shadow-sm w-full max-w-4xl'>
        <div className='stat gap-2'>
          <div className='stat-figure text-secondary mb-6'>
            <FontAwesomeIcon
              icon={faDumbbell}
              size='2x'
            />
          </div>
          <div className='stat-title'>Exercises done </div>
          <div className='stat-value text-secondary'>{doneExercises || 0}</div>
          <ResetScoresButton />
        </div>
        <div className='stat gap-2'>
          <div className='stat-figure text-secondary'>
            <FontAwesomeIcon
              icon={faStopwatch20}
              size='2x'
            />
          </div>
          <div className='stat-title'>Exercises in progress</div>
          <Timer timeLeft={timeLeft} />
          <div className='stat-desc text-secondary'>
            Track the exercise duration
          </div>
        </div>
        <div className='stat gap-2'>
          <div className='stat-figure text-secondary'>
            <FontAwesomeIcon
              icon={faHeartPulse}
              size='2x'
            />
          </div>
          <div className='stat-title'>Calories burned</div>
          <div className='stat-value text-secondary'>
            {currentCalories || 0}
          </div>
          <div className='stat-desc text-secondary'>Challenge yourself</div>
        </div>
        <div className='stat gap-2'>
          <div className='stat-figure text-secondary mb-6'>
            <FontAwesomeIcon
              icon={faPersonRunning}
              size='2x'
            />
          </div>
          <div className='stat-title'>Start your workout</div>
          <Timer timeLeft={workoutTimeLeft} />
          <StartWorkoutButton startWorkout={startWorkout} />
        </div>
      </div>
    </div>
  );
};
