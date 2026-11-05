import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { createExercises, editExercise } from '../../services/exercise.service';
import { addUserExercise } from '../../services/users.service';
import { useDatabaseValue } from '../../hooks/useDatabaseValue';
import { validateExerciseForm } from '../../common/exercise.validations';
import Icon from '../UI/Icon';
import Modal from '../UI/Modal';
import FormField from '../UI/FormField';
import InlineMessage from '../UI/InlineMessage';

export const CreateExercise = ({ defaultCategory = '', exercise }) => {
  const { userData } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const { data, error: loadError } = useDatabaseValue(
    open ? 'categories' : null
  );
  const initial = () => ({
    title: exercise?.title || '',
    content: exercise?.content || '',
    hours: exercise?.duration?.hours || 0,
    minutes: exercise?.duration?.minutes || 0,
    seconds: exercise?.duration?.seconds || 0,
    calories: exercise?.calories || '',
    level: exercise?.level || 'Easy',
    category: exercise?.categoryName || defaultCategory,
  });
  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const change = (key) => (event) =>
    setForm((value) => ({ ...value, [key]: event.target.value }));
  const show = () => {
    setForm(initial());
    setError('');
    setOpen(true);
  };
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const hours = Number(form.hours),
        minutes = Number(form.minutes),
        seconds = Number(form.seconds),
        calories = Number(form.calories);
      validateExerciseForm(
        form.title.trim(),
        form.content.trim(),
        hours,
        minutes,
        seconds,
        calories,
        form.level,
        form.category
      );
      if (exercise)
        await editExercise(exercise.categoryName, exercise.id, {
          title: form.title.trim(),
          content: form.content.trim(),
          duration: { hours, minutes, seconds },
          calories,
          level: form.level,
        });
      else {
        const id = await createExercises(
          form.category,
          form.title.trim(),
          form.content.trim(),
          hours,
          minutes,
          seconds,
          calories,
          form.level,
          userData.username
        );
        await addUserExercise(userData.username, id);
      }
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
        type='button'
        className={exercise ? 'icon-button' : 'btn btn-primary'}
        aria-label={exercise ? `Edit ${exercise.title}` : undefined}
        onClick={show}
      >
        <Icon
          name={exercise ? 'edit' : 'plus'}
          size={17}
        />
        {!exercise && 'Create exercise'}
      </button>
      <Modal
        open={open}
        onClose={() => !busy && setOpen(false)}
        title={exercise ? 'Fine-tune your exercise' : 'Make it your own'}
        description={
          exercise
            ? 'A few small adjustments can make all the difference.'
            : 'Add an exercise to your library. Your Motion Mates can discover it too.'
        }
      >
        <form
          className='form-stack'
          onSubmit={submit}
        >
          <FormField
            label='Exercise name'
            placeholder='e.g. Morning flow'
            required
            minLength={4}
            maxLength={30}
            value={form.title}
            onChange={change('title')}
          />
          <FormField
            label='How to do it'
            type='textarea'
            placeholder='A few simple instructions…'
            required
            minLength={4}
            maxLength={100}
            value={form.content}
            onChange={change('content')}
          />
          <div className='form-grid'>
            <FormField
              label='Category'
              required
              disabled={Boolean(exercise)}
              value={form.category}
              onChange={change('category')}
            >
              <option value=''>Choose a category</option>
              {Object.keys(data || {}).map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </FormField>
            <FormField
              label='Intensity'
              value={form.level}
              onChange={change('level')}
            >
              <option value='Easy'>Easy · Find your flow</option>
              <option value='Medium'>Medium · Feel the effort</option>
              <option value='Hard'>Hard · Push your pace</option>
            </FormField>
          </div>
          <fieldset>
            <legend className='field-legend'>Duration</legend>
            <div className='form-grid form-grid-three'>
              {['hours', 'minutes', 'seconds'].map((unit) => (
                <FormField
                  key={unit}
                  label={unit[0].toUpperCase() + unit.slice(1)}
                  type='number'
                  required
                  min={0}
                  max={unit === 'hours' ? 23 : 59}
                  value={form[unit]}
                  onChange={change(unit)}
                />
              ))}
            </div>
          </fieldset>
          <FormField
            label='Estimated calories (kcal)'
            type='number'
            required
            min={1}
            max={10000}
            placeholder='e.g. 80'
            value={form.calories}
            onChange={change('calories')}
          />
          <InlineMessage>{error || loadError}</InlineMessage>
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
              {busy ? 'Saving…' : exercise ? 'Save changes' : 'Create exercise'}
              <Icon
                name='check'
                size={16}
              />
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};
