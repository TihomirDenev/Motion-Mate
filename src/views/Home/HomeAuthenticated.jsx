import { useContext, useState } from 'react';
import { Link } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { useExerciseLibrary } from '../../hooks/useExerciseLibrary';
import { usePageTitle } from '../../hooks/usePageTitle';
import {
  beginExercise,
  setExerciseQueued,
} from '../../services/workout.service';
import { getCategoryVisual } from '../../helper/category-visuals';
import { StartWorkoutButton } from '../../components/HomeAuth/StartWorkoutButton';
import PageHeader from '../../components/UI/PageHeader';
import Icon from '../../components/UI/Icon';
import EmptyState from '../../components/UI/EmptyState';
import InlineMessage from '../../components/UI/InlineMessage';
import Progress from '../../components/Goals/Progress';
import { useTranslation } from '../../i18n/useTranslation';

export const HomeAuthenticated = () => {
  const { t, te, formatDate, formatNumber } = useTranslation();
  usePageTitle(`Motion Mate | ${t('titles.overview')}`);
  const { userData } = useContext(AppContext);
  const { exercises, loading, error: loadError } = useExerciseLibrary();
  const [today] = useState(() => new Date());
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const [showAll, setShowAll] = useState(false);
  const queue = exercises.filter((exercise) => exercise.queued);
  const goals = Object.entries(userData.myGoals || {}).map(([id, goal]) => ({
    id,
    ...goal,
  }));
  const completed = goals.filter((goal) => Number(goal.progress) >= 100).length;
  const focusGoals = [...goals]
    .sort((a, b) => Number(a.progress >= 100) - Number(b.progress >= 100))
    .slice(0, 3);
  const greeting = t(
    today.getHours() < 12
      ? 'overview.morning'
      : today.getHours() < 18
        ? 'overview.afternoon'
        : 'overview.evening'
  );
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - ((today.getDay() + 6) % 7) + index);
    return date;
  });
  const bmi =
    userData.weight > 0 && userData.height > 0
      ? (userData.weight / (userData.height / 100) ** 2).toFixed(1)
      : null;

  const act = async (exercise, action) => {
    setBusy(exercise.id);
    setError('');
    try {
      await (action === 'start'
        ? beginExercise(userData.username, exercise)
        : setExerciseQueued(userData, exercise, false));
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy('');
    }
  };

  return (
    <div className='dashboard page-enter'>
      <PageHeader
        eyebrow={formatDate(today, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
        title={
          <>
            {greeting}, {userData.firstName || userData.username}
            <span className='greeting-dot'>.</span>
          </>
        }
        description={t('overview.description')}
        actions={
          <Link
            className='date-badge'
            to='/goals'
          >
            <Icon
              name='calendar'
              size={17}
            />
            {t('overview.nextChapter')}
          </Link>
        }
      />
      <section className='dashboard-hero'>
        <img
          src='/images/training.jpg'
          alt={t('overview.heroAlt')}
          fetchPriority='high'
        />
        <div className='dashboard-hero-shade' />
        <div className='dashboard-hero-copy'>
          <span className='hero-pill'>
            <span className='status-dot' /> {t('overview.heroPill')}
          </span>
          <h2>
            {t('overview.heroTitleLine1')}
            <br />
            {t('overview.heroTitleLine2')}
          </h2>
          <p>{t('overview.heroText')}</p>
          <StartWorkoutButton />
        </div>
        <span className='hero-side-note'>
          {t('overview.sideNoteLine1')}
          <br />
          <strong>{t('overview.sideNoteLine2')} ↗</strong>
        </span>
      </section>
      <div className='dashboard-stats'>
        {[
          {
            icon: 'dumbbell',
            value: userData.updatedScores?.doneExercises || 0,
            label: t('overview.statExercises'),
            detail: t('overview.statExercisesDetail'),
            tone: 'mint',
          },
          {
            icon: 'flame',
            value: userData.updatedScores?.updatedCalories || 0,
            unit: t('common.kcal'),
            label: t('overview.statCalories'),
            detail: t('overview.statCaloriesDetail'),
            tone: 'peach',
          },
          {
            icon: 'trophy',
            value: completed,
            unit: `/ ${goals.length}`,
            label: t('overview.statGoals'),
            detail: t('overview.statGoalsDetail'),
            tone: 'lavender',
          },
        ].map((stat) => (
          <div
            className='stat-card surface'
            key={stat.label}
          >
            <div className='stat-card-top'>
              <span className={`icon-tile tone-${stat.tone}`}>
                <Icon
                  name={stat.icon}
                  size={19}
                />
              </span>
              <Icon
                name='arrowUp'
                size={14}
              />
            </div>
            <div className='stat-number'>
              {formatNumber(stat.value)}{' '}
              {stat.unit && <small>{stat.unit}</small>}
            </div>
            <p>{stat.label}</p>
            <small className='stat-detail'>{stat.detail}</small>
          </div>
        ))}
      </div>
      <div className='dashboard-columns'>
        <div>
          <section className='section-space'>
            <div className='section-heading'>
              <div>
                <h2>
                  {t('overview.queueTitle')}{' '}
                  <span className='count-badge'>{queue.length}</span>
                </h2>
                <p>{t('overview.queueDescription')}</p>
              </div>
              <Link to='/exercises'>
                {t('overview.exploreLibrary')}{' '}
                <Icon
                  name='arrow'
                  size={14}
                />
              </Link>
            </div>
            <InlineMessage>{error || loadError}</InlineMessage>
            {loading ? (
              <div className='skeleton skeleton-card' />
            ) : queue.length ? (
              <div className='workout-list'>
                {(showAll ? queue : queue.slice(0, 3)).map(
                  (exercise, index) => (
                    <article
                      className='workout-row surface'
                      key={exercise.id}
                    >
                      <div
                        className={`workout-number tone-${getCategoryVisual(exercise.categoryName).tone}`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className='workout-row-copy'>
                        <h3>{exercise.display.title}</h3>
                        <div>
                          <span>
                            <Icon
                              name='clock'
                              size={12}
                            />
                            {t('common.duration', {
                              minutes:
                                Number(exercise.duration?.hours || 0) * 60 +
                                Number(exercise.duration?.minutes || 0),
                              seconds: Number(exercise.duration?.seconds || 0),
                            })}
                          </span>
                          <span>
                            <Icon
                              name='flame'
                              size={12}
                            />
                            {formatNumber(exercise.calories)} {t('common.kcal')}
                          </span>
                          <span className='workout-level'>
                            {te('levels', exercise.level)}
                          </span>
                        </div>
                      </div>
                      <button
                        className='icon-button workout-play'
                        aria-label={t('overview.startExercise', {
                          title: exercise.display.title,
                        })}
                        disabled={
                          Boolean(userData.endCurrentExercise) ||
                          busy === exercise.id
                        }
                        onClick={() => act(exercise, 'start')}
                      >
                        <Icon
                          name='play'
                          size={16}
                        />
                      </button>
                      <button
                        className='workout-remove'
                        aria-label={t('overview.removeExercise', {
                          title: exercise.display.title,
                        })}
                        disabled={busy === exercise.id}
                        onClick={() => act(exercise, 'remove')}
                      >
                        <Icon
                          name='close'
                          size={14}
                        />
                      </button>
                    </article>
                  )
                )}
                {queue.length > 3 && (
                  <button
                    className='text-button btn-full'
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll
                      ? t('overview.showLess')
                      : t('overview.viewAll', { count: queue.length })}
                    <Icon
                      name={showAll ? 'down' : 'arrow'}
                      size={14}
                    />
                  </button>
                )}
              </div>
            ) : (
              <div className='surface'>
                <EmptyState
                  icon='dumbbell'
                  title={t('overview.queueEmptyTitle')}
                  description={t('overview.queueEmptyDescription')}
                >
                  <Link
                    className='btn btn-primary'
                    to='/exercises'
                  >
                    {t('overview.buildWorkout')}{' '}
                    <Icon
                      name='plus'
                      size={16}
                    />
                  </Link>
                </EmptyState>
              </div>
            )}
          </section>
          <section className='section-space'>
            <div className='section-heading'>
              <h2>{t('overview.goalsTitle')}</h2>
              <Link to='/goals'>
                {t('overview.allGoals')}{' '}
                <Icon
                  name='arrow'
                  size={14}
                />
              </Link>
            </div>
            {focusGoals.length ? (
              <div className='goal-preview-list surface'>
                {focusGoals.map((goal) => (
                  <Link
                    className='goal-preview'
                    to={`/goals/${goal.id}`}
                    key={goal.id}
                  >
                    <span className='icon-tile tone-lavender'>
                      <Icon
                        name={goal.progress >= 100 ? 'trophy' : 'target'}
                        size={19}
                      />
                    </span>
                    <div>
                      <h3>{goal.name}</h3>
                      <p>
                        {goal.progress >= 100
                          ? t('overview.goalCelebrate')
                          : t('overview.goalProgress', {
                              progress: Math.round(goal.progress || 0),
                            })}
                      </p>
                    </div>
                    <Progress progress={goal.progress} />
                    <Icon
                      name='chevron'
                      size={16}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className='surface'>
                <EmptyState
                  icon='target'
                  title={t('overview.goalsEmptyTitle')}
                  description={t('overview.goalsEmptyDescription')}
                >
                  <Link
                    to='/goals'
                    className='text-button'
                  >
                    {t('overview.firstGoal')}{' '}
                    <Icon
                      name='arrow'
                      size={16}
                    />
                  </Link>
                </EmptyState>
              </div>
            )}
          </section>
        </div>
        <aside className='dashboard-aside'>
          <section className='surface week-card'>
            <div className='section-heading'>
              <h2>{t('overview.rhythmTitle')}</h2>
              <Icon
                name='calendar'
                size={17}
              />
            </div>
            <p className='muted'>{t('overview.rhythmDescription')}</p>
            <div className='week-strip'>
              {week.map((date) => {
                const active = Boolean(
                  userData.activityHistory?.[date.toLocaleDateString('en-CA')]
                );
                const isToday = date.toDateString() === today.toDateString();
                return (
                  <div
                    key={date.toISOString()}
                    className={isToday ? 'is-today' : ''}
                    aria-current={isToday ? 'date' : undefined}
                  >
                    <small>
                      {formatDate(date, { weekday: 'short' })
                        .slice(0, 1)
                        .toUpperCase()}
                    </small>
                    <strong>{date.getDate()}</strong>
                    <span className={active ? 'day-done' : 'day-dot'}>
                      {active ? (
                        <Icon
                          name='check'
                          size={11}
                        />
                      ) : null}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className='week-note'>
              <span className='status-dot' />
              <span>{t('overview.rhythmNote')}</span>
            </div>
          </section>
          <section className='wellness-teaser'>
            <div className='section-heading'>
              <span className='icon-tile'>
                <Icon
                  name='heart'
                  size={22}
                />
              </span>
              <span className='pill'>{t('overview.wellnessPill')}</span>
            </div>
            <h2>
              {t('overview.wellnessTitleLine1')}
              <br />
              {t('overview.wellnessTitleLine2')}
            </h2>
            <p>{t('overview.wellnessText')}</p>
            <div className='wellness-mini-stats'>
              <div>
                <span>{t('overview.bmi')}</span>
                <strong>
                  {bmi ? formatNumber(bmi, { maximumFractionDigits: 1 }) : '—'}
                </strong>
              </div>
              <div>
                <span>{t('overview.weight')}</span>
                <strong>
                  {userData.weight ? formatNumber(userData.weight) : '—'}{' '}
                  <small>{t('common.kg')}</small>
                </strong>
              </div>
            </div>
            <Link
              to='/wellness-health-tools'
              className='text-button'
            >
              {t('overview.exploreWellness')}{' '}
              <Icon
                name='arrow'
                size={16}
              />
            </Link>
          </section>
          <Link
            to='/all-users'
            className='community-teaser surface'
          >
            <span className='icon-tile tone-lavender'>
              <Icon name='users' />
            </span>
            <div>
              <h3>{t('overview.communityTitle')}</h3>
              <p>{t('overview.communityText')}</p>
            </div>
            <Icon
              name='arrowUp'
              size={17}
            />
          </Link>
        </aside>
      </div>
    </div>
  );
};
