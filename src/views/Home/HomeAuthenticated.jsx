import { useContext, useEffect, useState } from 'react';
import { APP_NAME } from '../../common/constants';
import { AppContext } from '../../context/AppContext';
import { onValue, ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { AccountStats } from '../../components/HomeAuth/AccountStats';
import { Divider } from '../../components/HomeAuth/Divider';
import { usePageTitle } from '../../hooks/usePageTitle';

export const HomeAuthenticated = () => {
  usePageTitle(`${APP_NAME} | Home`);

  const [timer, setTimer] = useState(null);
  const { userData } = useContext(AppContext);
  const [stopButton, setStopButton] = useState('');
  const [workoutTimer, setWorkoutTimer] = useState(null);
  const [startWorkout, setStartWorkout] = useState(null);
  const [calories, setCalories] = useState();

  useEffect(() => {
    return onValue(
      ref(db, `users/${userData?.username}/endCurrentExercise`),
      (snapshot) => {
        if (snapshot?.val()) {
          setTimer(snapshot.val().timeLeft);
          setStopButton(snapshot.val().exerciseId);
          setCalories(snapshot.val().calories);
        } else {
          setTimer(null);
          setStopButton('');
        }
      }
    );
  }, [userData?.username]);

  useEffect(() => {
    return onValue(
      ref(db, `users/${userData?.username}/workoutTimer/timer`),
      (snapshot) => {
        if (snapshot?.val()) {
          setWorkoutTimer(snapshot.val());
          setStartWorkout(true);
        } else {
          setWorkoutTimer(null);
          setStartWorkout(false);
        }
      }
    );
  }, [userData?.username]);

  return (
    <>
      <AccountStats
        timer={timer}
        setStopButton={setStopButton}
        workoutTimer={workoutTimer}
        startWorkout={startWorkout}
        setStartWorkout={setStartWorkout}
        calories={calories}
      />
      <Divider stopButton={stopButton} />
    </>
  );
};
