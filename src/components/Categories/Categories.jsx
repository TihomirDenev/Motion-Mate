import { useContext, useState } from 'react';
import { Link } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { useDatabaseValue } from '../../hooks/useDatabaseValue';
import { useExerciseLibrary } from '../../hooks/useExerciseLibrary';
import { usePageTitle } from '../../hooks/usePageTitle';
import { deleteCategory } from '../../services/category.service';
import { getCategoryVisual } from '../../helper/category-visuals';
import { CreateExercise } from '../Exercise/CreateExercise';
import CreateCategory from './CreateCategory';
import PageHeader from '../UI/PageHeader';
import Icon from '../UI/Icon';
import EmptyState from '../UI/EmptyState';
import InlineMessage from '../UI/InlineMessage';
import LoadingState from '../UI/LoadingState';

export default function Categories() {
  usePageTitle('Motion Mate | Exercise library');
  const { userData } = useContext(AppContext);
  const { data, loading, error: loadError } = useDatabaseValue('categories');
  const { exercises } = useExerciseLibrary();
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const categories = Object.entries(data || {}).flatMap(([category, entries]) =>
    Object.entries(entries).map(([id, value]) => ({ ...value, id, category }))
  );
  const filtered = categories.filter((category) =>
    `${category.category} ${category.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  const curated = [
    'Ab workout',
    'Jog',
    'Legs Workout',
    'Muscle Gain',
    'Weight loss exercises',
    'Yoga',
  ];
  const remove = async (category) => {
    setBusy(category.id);
    setError('');
    try {
      await deleteCategory(category.category, category.id);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy('');
    }
  };

  return (
    <div className='page-enter'>
      <PageHeader
        eyebrow='THE EXERCISE LIBRARY'
        title='Find your next move.'
        description='A little strength. A little balance. A whole lot of possibility.'
        actions={
          <>
            {userData.userRole === 'admin' && <CreateCategory />}
            <CreateExercise />
          </>
        }
      />
      <section className='library-banner'>
        <div>
          <span className='pill'>MOVE YOUR WAY</span>
          <h2>
            There’s a rhythm
            <br />
            with your name on it.
          </h2>
          <p>Explore your exercises and the ones your mates share.</p>
        </div>
        <img
          src='/images/yoga.jpg'
          alt='Outdoor group yoga session'
        />
        <span
          className='library-banner-icon'
          aria-hidden='true'
        >
          <Icon
            name='sparkles'
            size={32}
          />
        </span>
      </section>
      <div className='toolbar section-space'>
        <label className='search-field'>
          <Icon
            name='search'
            size={19}
          />
          <input
            type='search'
            aria-label='Search categories'
            placeholder='Find your kind of movement…'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <Link
          className='text-button'
          to='/'
        >
          <Icon
            name='dumbbell'
            size={16}
          />
          My workout{' '}
          <span className='count-badge'>
            {exercises.filter((exercise) => exercise.queued).length}
          </span>
        </Link>
      </div>
      <div className='section-heading'>
        <h2>Explore categories</h2>
        <span className='result-count'>{filtered.length} ways to move</span>
      </div>
      <InlineMessage>{error || loadError}</InlineMessage>
      {loading ? (
        <LoadingState cards={6} />
      ) : filtered.length ? (
        <div className='category-grid'>
          {filtered.map((category, index) => {
            const visual = getCategoryVisual(category.category);
            const count = exercises.filter(
              (exercise) => exercise.categoryName === category.category
            ).length;
            return (
              <article
                className='category-card'
                key={category.id}
              >
                <Link
                  to={`/exercises/${encodeURIComponent(category.category)}`}
                >
                  <img
                    src={
                      curated.includes(category.category)
                        ? visual.image
                        : category.imageUrl || visual.image
                    }
                    alt=''
                    loading='lazy'
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = visual.image;
                    }}
                  />
                  <div className='category-shade' />
                  <span className='category-number'>
                    0{index + 1} /{' '}
                    <Icon
                      name={visual.icon}
                      size={16}
                    />
                  </span>
                  <div className='category-copy'>
                    <span>{visual.label}</span>
                    <h3>{category.category}</h3>
                    <div>
                      <small>
                        {count} {count === 1 ? 'exercise' : 'exercises'} in your
                        circle
                      </small>
                      <span className='category-arrow'>
                        <Icon
                          name='arrowUp'
                          size={18}
                        />
                      </span>
                    </div>
                  </div>
                </Link>
                {userData.userRole === 'admin' && (
                  <button
                    className='category-delete'
                    aria-label={`Delete category ${category.category}`}
                    disabled={busy === category.id}
                    onClick={() => remove(category)}
                  >
                    <Icon
                      name='trash'
                      size={15}
                    />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className='surface'>
          <EmptyState
            icon='search'
            title={
              search
                ? 'A different kind of move?'
                : 'A fresh space for movement'
            }
            description={
              search
                ? 'Try another search to find your category.'
                : 'Categories will appear here as your community grows.'
            }
          >
            {search && (
              <button
                className='btn btn-ghost'
                onClick={() => setSearch('')}
              >
                Clear search
              </button>
            )}
          </EmptyState>
        </div>
      )}
      <div className='library-note'>
        <Icon
          name='users'
          size={18}
        />
        <p>
          Your library grows with your circle.{' '}
          <Link to='/all-users'>
            Find more Motion Mates{' '}
            <Icon
              name='arrow'
              size={13}
            />
          </Link>
        </p>
      </div>
    </div>
  );
}
