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
import { useTranslation } from '../../i18n/useTranslation';

export const StartWorkoutButton = () => {
  const { userData } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState(30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const running = Boolean(userData?.workoutTimer?.timer);
  const submit = async (event) => {
    event.preventDefault();
    if (!Number.isFinite(Number(minutes)) || minutes < 1 || minutes > 180) {
      setError(t('workout.durationError'));
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
        {t(running ? 'workout.end' : 'workout.start')}
        <Icon
          name='arrow'
          size={16}
        />
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t('workout.modalTitle')}
        description={t('workout.modalDescription')}
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
                <span>{t('common.min')}</span>
              </button>
            ))}
          </div>
          <FormField
            label={t('workout.customDuration')}
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
            {t(busy ? 'workout.preparing' : 'workout.go')}
          </button>
        </form>
      </Modal>
    </>
  );
};
