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
import { useTranslation } from '../../i18n/useTranslation';
import { optimizedImage } from '../../helper/category-visuals';

export default function Categories() {
  const { t, te, formatNumber } = useTranslation();
  usePageTitle(`Motion Mate | ${t('nav.exercises')}`);
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
    `${category.category} ${te('categoryNames', category.category)} ${category.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
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
        eyebrow={t('library.eyebrow')}
        title={t('library.title')}
        description={t('library.description')}
        actions={
          <>
            {userData.userRole === 'admin' && <CreateCategory />}
            <CreateExercise />
          </>
        }
      />
      <section className='library-banner'>
        <div>
          <span className='pill'>{t('library.bannerPill')}</span>
          <h2>
            {t('library.bannerTitleLine1')}
            <br />
            {t('library.bannerTitleLine2')}
          </h2>
          <p>{t('library.bannerText')}</p>
        </div>
        <img
          src='/images/barbell.jpg'
          alt={t('library.bannerAlt')}
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
            aria-label={t('library.searchLabel')}
            placeholder={t('library.searchPlaceholder')}
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
          {t('library.myWorkout')}{' '}
          <span className='count-badge'>
            {exercises.filter((exercise) => exercise.queued).length}
          </span>
        </Link>
      </div>
      <div className='section-heading'>
        <h2>{t('library.categoriesTitle')}</h2>
        <span className='result-count'>
          {t('library.waysToMove', { count: filtered.length })}
        </span>
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
                    src={optimizedImage(category.imageUrl) || visual.image}
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
                    <span>{t(`categoryTaglines.${visual.tagline}`)}</span>
                    <h3>{te('categoryNames', category.category)}</h3>
                    <div>
                      <small>
                        {t('library.inCircle', {
                          count,
                          formatted: formatNumber(count),
                        })}
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
                    aria-label={t('library.deleteCategory', {
                      name: te('categoryNames', category.category),
                    })}
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
            title={t(search ? 'library.noResultsTitle' : 'library.emptyTitle')}
            description={t(
              search
                ? 'library.noResultsDescription'
                : 'library.emptyDescription'
            )}
          >
            {search && (
              <button
                className='btn btn-ghost'
                onClick={() => setSearch('')}
              >
                {t('common.clearSearch')}
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
          {t('library.note')}{' '}
          <Link to='/all-users'>
            {t('library.findMates')}{' '}
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
