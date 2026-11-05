import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { createGoal } from '../../services/goal.service';
import { validateGoalForm } from '../../common/goal.validations';
import { localDateValue } from '../../helper/goal-status';
import Modal from '../UI/Modal';
import Icon from '../UI/Icon';
import FormField from '../UI/FormField';
import InlineMessage from '../UI/InlineMessage';
import { useTranslation } from '../../i18n/useTranslation';

const initialForm = () => {
  const end = new Date();
  end.setDate(end.getDate() + 7);
  return {
    name: '',
    from: localDateValue(),
    to: localDateValue(end),
    type: 'exercises',
    exercises: 5,
    calories: 500,
    progress: 0,
  };
};

export default function CreateGoal() {
  const { userData } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation();
  const change = (key) => (event) =>
    setForm((value) => ({ ...value, [key]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const from = new Date(`${form.from}T00:00:00`).getTime(),
        to = new Date(`${form.to}T23:59:59`).getTime();
      validateGoalForm(form.name.trim(), userData.username, from, to);
      if (form.type === 'exercises' && Number(form.exercises) < 1)
        throw new Error(t('errors.goalExercises'));
      if (form.type === 'calories' && Number(form.calories) < 1)
        throw new Error(t('errors.goalCalories'));
      await createGoal(
        form.name.trim(),
        userData.username,
        from,
        to,
        form.type,
        form.type === 'exercises' ? Number(form.exercises) : 0,
        form.type === 'manual' ? Number(form.progress) : 0,
        form.type === 'calories' ? Number(form.calories) : 0
      );
      setForm(initialForm());
      setOpen(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <button
        className='btn btn-primary'
        onClick={() => {
          setError('');
          setOpen(true);
        }}
      >
        <Icon
          name='plus'
          size={17}
        />
        {t('goals.create')}
      </button>
      <Modal
        open={open}
        onClose={() => !busy && setOpen(false)}
        title={t('goals.createTitle')}
        description={t('goals.createDescription')}
      >
        <form
          onSubmit={submit}
          className='form-stack'
        >
          <FormField
            label={t('goals.name')}
            required
            minLength={3}
            maxLength={30}
            placeholder={t('goals.namePlaceholder')}
            value={form.name}
            onChange={change('name')}
          />
          <fieldset>
            <legend className='field-legend'>{t('goals.trackQuestion')}</legend>
            <div className='goal-type-options'>
              {[
                { value: 'exercises', icon: 'dumbbell' },
                { value: 'calories', icon: 'flame' },
                { value: 'manual', icon: 'target' },
              ].map((item) => (
                <button
                  type='button'
                  key={item.value}
                  aria-pressed={form.type === item.value}
                  onClick={() =>
                    setForm((value) => ({ ...value, type: item.value }))
                  }
                >
                  <Icon
                    name={item.icon}
                    size={22}
                  />
                  <span>{t(`goals.trackOptions.${item.value}`)}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <div className='form-grid'>
            <FormField
              label={t('goals.startDate')}
              type='date'
              required
              value={form.from}
              onChange={change('from')}
            />
            <FormField
              label={t('goals.finishDate')}
              type='date'
              required
              min={form.from}
              value={form.to}
              onChange={change('to')}
            />
          </div>
          {form.type === 'exercises' ? (
            <FormField
              label={t('goals.exerciseTarget')}
              type='number'
              required
              min={1}
              max={100}
              value={form.exercises}
              onChange={change('exercises')}
              hint={t('goals.exerciseHint')}
            />
          ) : form.type === 'calories' ? (
            <FormField
              label={t('goals.calorieTarget')}
              type='number'
              required
              min={1}
              max={10000}
              value={form.calories}
              onChange={change('calories')}
              hint={t('goals.calorieHint')}
            />
          ) : (
            <FormField
              label={t('goals.startingProgress', { progress: form.progress })}
              type='range'
              min={0}
              max={100}
              value={form.progress}
              onChange={change('progress')}
              hint={t('goals.manualHint')}
            />
          )}
          <InlineMessage>{error}</InlineMessage>
          <div className='dialog-actions'>
            <button
              type='button'
              className='btn btn-ghost'
              disabled={busy}
              onClick={() => setOpen(false)}
            >
              {t('common.cancel')}
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={busy}
            >
              {t(busy ? 'common.creating' : 'goals.submit')}
              <Icon
                name='arrow'
                size={16}
              />
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
