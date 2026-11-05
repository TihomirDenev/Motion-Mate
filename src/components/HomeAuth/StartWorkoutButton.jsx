import { useContext, useState } from 'react';
import {
  StartTimerWorkout,
  stopTimerWorkout,
} from '../../services/users.service';
import { AppContext } from '../../context/AppContext';
import Modal from '../UI/Modal';
import Icon from '../UI/Icon';
import FormField from '../UI/FormField';
import InlineMessage from '../UI/InlineMessage';

export const StartWorkoutButton = () => {
  const { userData } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState(30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const running = Boolean(userData?.workoutTimer?.timer);
  const submit = async (event) => {
    event.preventDefault();
    if (!Number.isFinite(Number(minutes)) || minutes < 1 || minutes > 180) {
      setError('Choose a workout between 1 and 180 minutes.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await StartTimerWorkout(
        userData.username,
        Date.now() + Number(minutes) * 60000
      );
      setOpen(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  };
  const stop = async () => {
    setBusy(true);
    try {
      await stopTimerWorkout(userData.username);
    } catch (error) {
      setError(error.message);
      setOpen(true);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <button
        className='btn btn-lime'
        disabled={busy}
        onClick={() => (running ? stop() : setOpen(true))}
      >
        <Icon
          name={running ? 'stop' : 'play'}
          size={16}
        />
        {running ? 'End workout' : 'Start a workout'}
        <Icon
          name='arrow'
          size={16}
        />
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title='Make time for you'
        description='Set a session timer, then start individual exercises from your workout list.'
      >
        <form
          onSubmit={submit}
          className='form-stack'
        >
          <div className='workout-presets'>
            {[15, 30, 45, 60].map((value) => (
              <button
                key={value}
                type='button'
                aria-pressed={Number(minutes) === value}
                onClick={() => setMinutes(value)}
              >
                <strong>{value}</strong>
                <span>min</span>
              </button>
            ))}
          </div>
          <FormField
            label='Or choose your duration (minutes)'
            type='number'
            min='1'
            max='180'
            required
            value={minutes}
            onChange={(event) => setMinutes(event.target.value)}
          />
          <InlineMessage>{error}</InlineMessage>
          <button
            className='btn btn-primary btn-full'
            disabled={busy}
            type='submit'
          >
            <Icon
              name='play'
              size={16}
            />
            {busy ? 'Getting ready…' : 'Let’s do this'}
          </button>
        </form>
      </Modal>
    </>
  );
};
