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

export const Exercises = () => {
  const { category } = useParams();
  usePageTitle(`Motion Mate | ${category}`);
  const { userData } = useContext(AppContext);
  const { exercises, loading, error: loadError } = useExerciseLibrary();
  const [level, setLevel] = useState('All levels');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const categoryExercises = exercises.filter(
    (exercise) => exercise.categoryName === category
  );
  const filtered = categoryExercises.filter(
    (exercise) =>
      (level === 'All levels' || exercise.level === level) &&
      `${exercise.title} ${exercise.content}`
        .toLowerCase()
        .includes(search.toLowerCase())
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
        back={{ to: '/exercises', label: 'Exercise library' }}
        eyebrow={visual.label}
        title={category}
        description='Your exercises and a little inspiration from your Motion Mates.'
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
            aria-label='Search exercises'
            placeholder='Find an exercise…'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <div
          className='filter-chips'
          role='group'
          aria-label='Exercise intensity'
        >
          {['All levels', 'Easy', 'Medium', 'Hard'].map((value) => (
            <button
              key={value}
              className='filter-chip'
              aria-pressed={level === value}
              onClick={() => setLevel(value)}
            >
              {value}
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
                    {exercise.level}
                  </span>
                </div>
                <h2>{exercise.title}</h2>
                <p className='exercise-description'>{exercise.content}</p>
                <div className='exercise-metrics'>
                  <span>
                    <Icon
                      name='clock'
                      size={16}
                    />
                    <strong>
                      {Number(exercise.duration?.hours || 0) * 60 +
                        Number(exercise.duration?.minutes || 0)}
                      <small>m</small> {Number(exercise.duration?.seconds || 0)}
                      <small>s</small>
                    </strong>
                  </span>
                  <span>
                    <Icon
                      name='flame'
                      size={16}
                    />
                    <strong>
                      {exercise.calories}
                      <small> kcal</small>
                    </strong>
                  </span>
                </div>
                <div className='exercise-author'>
                  <span className='author-dot' />
                  {own ? 'Created by you' : `Shared by ${exercise.createdBy}`}
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
                    {running
                      ? 'In progress'
                      : exercise.queued
                        ? 'In your workout'
                        : 'Add to workout'}
                  </button>
                  {own && (
                    <>
                      <CreateExercise exercise={exercise} />
                      <button
                        className='icon-button danger-button'
                        disabled={busy === exercise.id || running}
                        aria-label={`Delete ${exercise.title}`}
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
            icon={search || level !== 'All levels' ? 'search' : visual.icon}
            title={
              search || level !== 'All levels'
                ? 'No matching moves just yet'
                : 'Make the first move'
            }
            description={
              search || level !== 'All levels'
                ? 'Try another search or intensity level.'
                : 'Create your first exercise in this category, or connect with mates to discover theirs.'
            }
          >
            {(search || level !== 'All levels') && (
              <button
                className='btn btn-ghost'
                onClick={() => {
                  setSearch('');
                  setLevel('All levels');
                }}
              >
                Reset filters
              </button>
            )}
          </EmptyState>
        </div>
      )}
    </div>
  );
};
