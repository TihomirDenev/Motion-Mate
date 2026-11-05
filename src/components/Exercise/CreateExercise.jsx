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
import { useTranslation } from '../../i18n/useTranslation';
import { exerciseText } from '../../helper/exercise-text';

export const CreateExercise = ({ defaultCategory = '', exercise }) => {
  const { userData } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const { t, te, language } = useTranslation();
  const translated = Boolean(exercise?.translations?.[language]);
  const { data, error: loadError } = useDatabaseValue(
    open ? 'categories' : null
  );
  const initial = () => ({
    title: exerciseText(exercise, language).title,
    content: exerciseText(exercise, language).content,
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
          ...(translated
            ? {
                [`translations/${language}/title`]: form.title.trim(),
                [`translations/${language}/content`]: form.content.trim(),
              }
            : { title: form.title.trim(), content: form.content.trim() }),
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
        aria-label={
          exercise
            ? t('exercise.edit', {
                title: exerciseText(exercise, language).title,
              })
            : undefined
        }
        onClick={show}
      >
        <Icon
          name={exercise ? 'edit' : 'plus'}
          size={17}
        />
        {!exercise && t('exercise.create')}
      </button>
      <Modal
        open={open}
        onClose={() => !busy && setOpen(false)}
        title={t(exercise ? 'exercise.editTitle' : 'exercise.createTitle')}
        description={t(
          exercise ? 'exercise.editDescription' : 'exercise.createDescription'
        )}
      >
        <form
          className='form-stack'
          onSubmit={submit}
        >
          <FormField
            label={t('exercise.name')}
            placeholder={t('exercise.namePlaceholder')}
            required
            minLength={4}
            maxLength={30}
            value={form.title}
            onChange={change('title')}
          />
          <FormField
            label={t('exercise.instructions')}
            type='textarea'
            placeholder={t('exercise.instructionsPlaceholder')}
            required
            minLength={4}
            maxLength={100}
            value={form.content}
            onChange={change('content')}
          />
          <div className='form-grid'>
            <FormField
              label={t('exercise.category')}
              required
              disabled={Boolean(exercise)}
              value={form.category}
              onChange={change('category')}
            >
              <option value=''>{t('exercise.chooseCategory')}</option>
              {Object.keys(data || {}).map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {te('categoryNames', category)}
                </option>
              ))}
            </FormField>
            <FormField
              label={t('exercise.intensity')}
              value={form.level}
              onChange={change('level')}
            >
              {['Easy', 'Medium', 'Hard'].map((level) => (
                <option
                  key={level}
                  value={level}
                >
                  {t(`exercise.levelOption.${level}`)}
                </option>
              ))}
            </FormField>
          </div>
          <fieldset>
            <legend className='field-legend'>{t('exercise.duration')}</legend>
            <div className='form-grid form-grid-three'>
              {['hours', 'minutes', 'seconds'].map((unit) => (
                <FormField
                  key={unit}
                  label={t(`exercise.${unit}`)}
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
            label={t('exercise.calories')}
            type='number'
            required
            min={1}
            max={10000}
            placeholder={t('common.example', { value: 80 })}
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
              {t('common.cancel')}
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={busy}
            >
              {t(
                busy
                  ? 'common.saving'
                  : exercise
                    ? 'common.saveChanges'
                    : 'exercise.create'
              )}
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
