import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { finishExercise, cancelExercise } from '../../services/workout.service';
import { stopTimerWorkout } from '../../services/users.service';
import Icon from '../UI/Icon';
import InlineMessage from '../UI/InlineMessage';

export default function WorkoutSession() {
  const { userData } = useContext(AppContext);
  const [now, setNow] = useState(() => Date.now());
  const [error, setError] = useState('');
  const finishing = useRef(false);
  const session = userData?.endCurrentExercise;
  const workoutEnd = userData?.workoutTimer?.timer;
  const remaining = Math.max(
    0,
    Math.ceil(((session?.timeLeft || workoutEnd || 0) - now) / 1000)
  );

  useEffect(() => {
    if (!session && !workoutEnd) return;
    const tick = async () => {
      const time = Date.now();
      setNow(time);
      if (finishing.current) return;
      if (session?.timeLeft <= time || workoutEnd <= time) {
        finishing.current = true;
        try {
          if (session?.timeLeft <= time)
            await finishExercise(userData.username, session.exerciseId);
          if (workoutEnd && workoutEnd <= time)
            await stopTimerWorkout(userData.username);
        } catch (error) {
          setError(error.message);
        } finally {
          finishing.current = false;
        }
      }
    };
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [session, workoutEnd, userData?.username]);

  const stop = async () => {
    try {
      await (session
        ? cancelExercise(userData.username)
        : stopTimerWorkout(userData.username));
    } catch (error) {
      setError(error.message);
    }
  };

  if (!session && !workoutEnd) return null;
  return (
    <div
      className='session-banner'
      role='region'
      aria-label='Active workout'
    >
      <div className='session-status'>
        <span className='status-dot' />
        <Link to='/'>
          <strong>
            {session?.title ||
              (session ? 'Exercise in progress' : 'Workout in progress')}
          </strong>
          <small>Stay with it. You’ve got this.</small>
        </Link>
      </div>
      <span
        className='session-time'
        role='timer'
        aria-label={`${remaining} seconds remaining`}
      >
        {String(Math.floor(remaining / 60)).padStart(2, '0')}:
        {String(remaining % 60).padStart(2, '0')}
      </span>
      <button
        className='icon-button'
        aria-label={session ? 'Stop exercise' : 'End workout'}
        onClick={stop}
      >
        <Icon
          name='stop'
          size={16}
        />
      </button>
      <InlineMessage>{error}</InlineMessage>
    </div>
  );
}
