import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { createGoal } from '../../services/goal.service';
import { validateGoalForm } from '../../common/goal.validations';
import { localDateValue } from '../../helper/goal-status';
import Modal from '../UI/Modal';
import Icon from '../UI/Icon';
import FormField from '../UI/FormField';
import InlineMessage from '../UI/InlineMessage';

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
        throw new Error('Aim for at least one exercise.');
      if (form.type === 'calories' && Number(form.calories) < 1)
        throw new Error('Set a calorie target greater than zero.');
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
        Create a goal
      </button>
      <Modal
        open={open}
        onClose={() => !busy && setOpen(false)}
        title='Give your progress a purpose'
        description='One intention. A few small steps. Something worth showing up for.'
      >
        <form
          onSubmit={submit}
          className='form-stack'
        >
          <FormField
            label='Name your goal'
            required
            minLength={3}
            maxLength={30}
            placeholder='e.g. A stronger kind of week'
            value={form.name}
            onChange={change('name')}
          />
          <fieldset>
            <legend className='field-legend'>
              How would you like to track it?
            </legend>
            <div className='goal-type-options'>
              {[
                { value: 'exercises', icon: 'dumbbell', label: 'Exercises' },
                { value: 'calories', icon: 'flame', label: 'Calories' },
                { value: 'manual', icon: 'target', label: 'My progress' },
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
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <div className='form-grid'>
            <FormField
              label='Start date'
              type='date'
              required
              value={form.from}
              onChange={change('from')}
            />
            <FormField
              label='Finish date'
              type='date'
              required
              min={form.from}
              value={form.to}
              onChange={change('to')}
            />
          </div>
          {form.type === 'exercises' ? (
            <FormField
              label='Exercise target'
              type='number'
              required
              min={1}
              max={100}
              value={form.exercises}
              onChange={change('exercises')}
              hint='Completed exercise timers automatically count towards this goal.'
            />
          ) : form.type === 'calories' ? (
            <FormField
              label='Calories to burn (kcal)'
              type='number'
              required
              min={1}
              max={10000}
              value={form.calories}
              onChange={change('calories')}
              hint='Calories from completed exercises will move you towards your target.'
            />
          ) : (
            <FormField
              label={`Starting progress · ${form.progress}%`}
              type='range'
              min={0}
              max={100}
              value={form.progress}
              onChange={change('progress')}
              hint='You’re in charge. Update your progress whenever you reach a milestone.'
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
              Cancel
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={busy}
            >
              {busy ? 'Creating…' : 'Make it happen'}
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
