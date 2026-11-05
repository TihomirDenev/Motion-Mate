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

export const HomeAuthenticated = () => {
  usePageTitle('Motion Mate | Your overview');
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
  const greeting =
    today.getHours() < 12
      ? 'Good morning'
      : today.getHours() < 18
        ? 'Good afternoon'
        : 'Good evening';
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
        eyebrow={today.toLocaleDateString('en-GB', {
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
        description='A fresh chance to feel a little stronger. Let’s make it count.'
        actions={
          <Link
            className='date-badge'
            to='/goals'
          >
            <Icon
              name='calendar'
              size={17}
            />
            Your next chapter
          </Link>
        }
      />
      <section className='dashboard-hero'>
        <img
          src='/images/runner.jpg'
          alt='Outdoor runner ready for her next session'
          fetchPriority='high'
        />
        <div className='dashboard-hero-shade' />
        <div className='dashboard-hero-copy'>
          <span className='hero-pill'>
            <span className='status-dot' /> YOUR ONLY COMPETITION IS YOU
          </span>
          <h2>
            Small steps.
            <br />
            Stronger you.
          </h2>
          <p>Show up. Move a little. Feel the difference.</p>
          <StartWorkoutButton />
        </div>
        <span className='hero-side-note'>
          FIND YOUR
          <br />
          <strong>MOMENTUM ↗</strong>
        </span>
      </section>
      <div className='dashboard-stats'>
        {[
          {
            icon: 'dumbbell',
            value: userData.updatedScores?.doneExercises || 0,
            label: 'Exercises completed',
            detail: 'Every rep counts',
            tone: 'mint',
          },
          {
            icon: 'flame',
            value: userData.updatedScores?.updatedCalories || 0,
            unit: 'kcal',
            label: 'Calories burned',
            detail: 'Energy well spent',
            tone: 'peach',
          },
          {
            icon: 'trophy',
            value: completed,
            unit: `/ ${goals.length}`,
            label: 'Goals achieved',
            detail: 'Progress, not perfection',
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
              {Number(stat.value).toLocaleString()}{' '}
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
                  Your next moves{' '}
                  <span className='count-badge'>{queue.length}</span>
                </h2>
                <p>A little structure. A lot of possibility.</p>
              </div>
              <Link to='/exercises'>
                Explore library{' '}
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
                        <h3>{exercise.title}</h3>
                        <div>
                          <span>
                            <Icon
                              name='clock'
                              size={12}
                            />
                            {Number(exercise.duration?.hours || 0) * 60 +
                              Number(exercise.duration?.minutes || 0)}
                            m {Number(exercise.duration?.seconds || 0)}s
                          </span>
                          <span>
                            <Icon
                              name='flame'
                              size={12}
                            />
                            {exercise.calories} kcal
                          </span>
                          <span className='workout-level'>
                            {exercise.level}
                          </span>
                        </div>
                      </div>
                      <button
                        className='icon-button workout-play'
                        aria-label={`Start ${exercise.title}`}
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
                        aria-label={`Remove ${exercise.title} from workout`}
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
                      ? 'Show less'
                      : `View all ${queue.length} exercises`}
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
                  title='Your next move starts here'
                  description='Choose exercises from your library to build a workout that feels like you.'
                >
                  <Link
                    className='btn btn-primary'
                    to='/exercises'
                  >
                    Build your workout{' '}
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
              <h2>A little closer, every day</h2>
              <Link to='/goals'>
                All goals{' '}
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
                          ? 'You made it. Take a moment to celebrate.'
                          : `${Math.round(goal.progress || 0)}% of the way there`}
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
                  title='Give your progress a purpose'
                  description='One goal is all it takes to get started.'
                >
                  <Link
                    to='/goals'
                    className='text-button'
                  >
                    Set your first goal{' '}
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
              <h2>Your rhythm</h2>
              <Icon
                name='calendar'
                size={17}
              />
            </div>
            <p className='muted'>A good week starts with showing up.</p>
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
                      {date
                        .toLocaleDateString('en-US', { weekday: 'short' })
                        .slice(0, 1)}
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
              <span>Completed exercises build your rhythm.</span>
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
              <span className='pill'>A MOMENT FOR YOU</span>
            </div>
            <h2>
              Feel good.
              <br />
              From the inside out.
            </h2>
            <p>Hydration, energy, balance. Get to know what your body needs.</p>
            <div className='wellness-mini-stats'>
              <div>
                <span>Body mass index</span>
                <strong>{bmi || '—'}</strong>
              </div>
              <div>
                <span>Your weight</span>
                <strong>
                  {userData.weight || '—'} <small>kg</small>
                </strong>
              </div>
            </div>
            <Link
              to='/wellness-health-tools'
              className='text-button'
            >
              Explore your wellness{' '}
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
              <h3>Find your people</h3>
              <p>Everything’s better with a mate.</p>
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
