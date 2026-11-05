import { useContext, useState } from 'react';
import { useParams } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { useExerciseLibrary } from '../../hooks/useExerciseLibrary';
import { usePageTitle } from '../../hooks/usePageTitle';
import { deleteExercise } from '../../services/exercise.service';
import { setExerciseQueued } from '../../services/workout.service';
import { CreateExercise } from '../../components/Exercise/CreateExercise';
import { getCategoryVisual } from '../../helper/category-visuals';
import PageHeader from '../../components/UI/PageHeader';
import Icon from '../../components/UI/Icon';
import LoadingState from '../../components/UI/LoadingState';
import EmptyState from '../../components/UI/EmptyState';
import InlineMessage from '../../components/UI/InlineMessage';
import { useTranslation } from '../../i18n/useTranslation';
import { exerciseSearchText } from '../../helper/exercise-text';

export const Exercises = () => {
  const { category } = useParams();
  const { t, te, formatNumber } = useTranslation();
  usePageTitle(`Motion Mate | ${te('categoryNames', category)}`);
  const { userData } = useContext(AppContext);
  const { exercises, loading, error: loadError } = useExerciseLibrary();
  const [level, setLevel] = useState('All');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const categoryExercises = exercises.filter(
    (exercise) => exercise.categoryName === category
  );
  const filtered = categoryExercises.filter(
    (exercise) =>
      (level === 'All' || exercise.level === level) &&
      exerciseSearchText(exercise).includes(search.trim().toLowerCase())
  );
  const visual = getCategoryVisual(category);
  const act = async (exercise, action) => {
    setBusy(exercise.id);
    setError('');
    try {
      if (action === 'delete') {
        await deleteExercise(category, exercise.id);
        if (exercise.queued) await setExerciseQueued(userData, exercise, false);
      } else await setExerciseQueued(userData, exercise, !exercise.queued);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy('');
    }
  };

  return (
    <div className='page-enter'>
      <PageHeader
        back={{ to: '/exercises', label: t('nav.exercises') }}
        eyebrow={t(`categoryTaglines.${visual.tagline}`)}
        title={te('categoryNames', category)}
        description={t('exercises.description')}
        actions={<CreateExercise defaultCategory={category} />}
      />
      <div className='toolbar'>
        <label className='search-field'>
          <Icon
            name='search'
            size={18}
          />
          <input
            type='search'
            aria-label={t('exercises.searchLabel')}
            placeholder={t('exercises.searchPlaceholder')}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <div
          className='filter-chips'
          role='group'
          aria-label={t('exercise.intensity')}
        >
          {['All', 'Easy', 'Medium', 'Hard'].map((value) => (
            <button
              key={value}
              className='filter-chip'
              aria-pressed={level === value}
              onClick={() => setLevel(value)}
            >
              {value === 'All' ? t('exercises.allLevels') : te('levels', value)}
            </button>
          ))}
        </div>
      </div>
      <InlineMessage>{error || loadError}</InlineMessage>
      {loading ? (
        <LoadingState />
      ) : filtered.length ? (
        <div className='exercise-grid'>
          {filtered.map((exercise) => {
            const own = exercise.createdBy === userData.username;
            const running =
              userData.endCurrentExercise?.exerciseId === exercise.id;
            return (
              <article
                className='exercise-card surface'
                key={exercise.id}
              >
                <div className='exercise-card-header'>
                  <span className={`icon-tile tone-${visual.tone}`}>
                    <Icon
                      name={visual.icon}
                      size={23}
                    />
                  </span>
                  <span
                    className={`pill ${exercise.level === 'Hard' ? 'pill-peach' : exercise.level === 'Medium' ? 'pill-lavender' : ''}`}
                  >
                    {te('levels', exercise.level)}
                  </span>
                </div>
                <h2>{exercise.display.title}</h2>
                <p className='exercise-description'>
                  {exercise.display.content}
                </p>
                <div className='exercise-metrics'>
                  <span>
                    <Icon
                      name='clock'
                      size={16}
                    />
                    <strong>
                      {Number(exercise.duration?.hours || 0) * 60 +
                        Number(exercise.duration?.minutes || 0)}
                      <small>{t('common.minutesShort')}</small>{' '}
                      {Number(exercise.duration?.seconds || 0)}
                      <small>{t('common.secondsShort')}</small>
                    </strong>
                  </span>
                  <span>
                    <Icon
                      name='flame'
                      size={16}
                    />
                    <strong>
                      {formatNumber(exercise.calories)}
                      <small> {t('common.kcal')}</small>
                    </strong>
                  </span>
                </div>
                <div className='exercise-author'>
                  <span className='author-dot' />
                  {own
                    ? t('exercises.createdByYou')
                    : t('exercises.sharedBy', { name: exercise.createdBy })}
                </div>
                <div className='exercise-card-actions'>
                  <button
                    className={`btn ${exercise.queued ? 'btn-ghost' : 'btn-primary'}`}
                    disabled={busy === exercise.id || running}
                    onClick={() => act(exercise, 'queue')}
                  >
                    <Icon
                      name={exercise.queued ? 'check' : 'plus'}
                      size={16}
                    />
                    {t(
                      running
                        ? 'exercises.inProgress'
                        : exercise.queued
                          ? 'exercises.inWorkout'
                          : 'exercises.addToWorkout'
                    )}
                  </button>
                  {own && (
                    <>
                      <CreateExercise exercise={exercise} />
                      <button
                        className='icon-button danger-button'
                        disabled={busy === exercise.id || running}
                        aria-label={t('exercises.delete', {
                          title: exercise.display.title,
                        })}
                        onClick={() => act(exercise, 'delete')}
                      >
                        <Icon
                          name='trash'
                          size={16}
                        />
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className='surface'>
          <EmptyState
            icon={search || level !== 'All' ? 'search' : visual.icon}
            title={t(
              search || level !== 'All'
                ? 'exercises.noResultsTitle'
                : 'exercises.emptyTitle'
            )}
            description={t(
              search || level !== 'All'
                ? 'exercises.noResultsDescription'
                : 'exercises.emptyDescription'
            )}
          >
            {(search || level !== 'All') && (
              <button
                className='btn btn-ghost'
                onClick={() => {
                  setSearch('');
                  setLevel('All');
                }}
              >
                {t('common.resetFilters')}
              </button>
            )}
          </EmptyState>
        </div>
      )}
    </div>
  );
};
