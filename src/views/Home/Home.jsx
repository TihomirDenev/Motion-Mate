import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { HomeAuthenticated } from './HomeAuthenticated';
import { getAllUsers } from '../../services/users.service';
import { getExercises } from '../../services/exercise.service';
import { getAllCategories } from '../../services/category.service';
import { usePageTitle } from '../../hooks/usePageTitle';
import Icon from '../../components/UI/Icon';
import Authenticated from '../../hoc/Authenticated/Authenticated';

export default function Home() {
  const { userData } = useContext(AppContext);
  usePageTitle(
    userData
      ? 'Motion Mate | Your overview'
      : 'Motion Mate | Your daily momentum'
  );
  const [counts, setCounts] = useState(null);
  useEffect(() => {
    if (userData) return;
    let ignore = false;
    Promise.all([getAllUsers(), getExercises(), getAllCategories()])
      .then(([users, exercises, categories]) => {
        if (!ignore)
          setCounts({
            users: Object.keys(users.val() || {}).length,
            exercises: exercises.reduce(
              (sum, group) => sum + Object.keys(group).length,
              0
            ),
            categories: categories.length,
          });
      })
      .catch(() => {
        /* The introduction stays available if community totals cannot load. */
      });
    return () => {
      ignore = true;
    };
  }, [userData]);

  if (userData) return <Authenticated><HomeAuthenticated /></Authenticated>;
  return (
    <div className='landing page-enter'>
      <section className='landing-hero'>
        <div className='landing-copy'>
          <span className='landing-badge'>
            <span className='status-dot' /> A LITTLE MOVEMENT. A LOT OF
            POSSIBILITY.
          </span>
          <h1>
            Find your pace.
            <br />
            Feel your <span>potential.</span>
          </h1>
          <p>
            A stronger body. A clearer mind. A little more you. Build a routine
            you love, track your progress, and move forward together.
          </p>
          <div className='landing-actions'>
            <Link
              className='btn btn-primary'
              to='/register'
            >
              Find your momentum{' '}
              <Icon
                name='arrow'
                size={18}
              />
            </Link>
            <Link
              className='text-button'
              to='/about'
            >
              Meet Motion Mate{' '}
              <Icon
                name='arrowUp'
                size={16}
              />
            </Link>
          </div>
          <div className='landing-community'>
            <div
              className='initials-stack'
              aria-hidden='true'
            >
              <span>TD</span>
              <span>TJ</span>
              <span>RM</span>
            </div>
            <div>
              <strong>Better, together.</strong>
              <small>
                {counts
                  ? `${counts.users} people finding their rhythm`
                  : 'Find your people. Find your rhythm.'}
              </small>
            </div>
          </div>
        </div>
        <div className='landing-visual'>
          <img
            src='/images/runner.jpg'
            alt='Runner taking a moment outdoors before her next workout'
            fetchPriority='high'
          />
          <div className='landing-image-shade' />
          <span className='image-kicker'>YOUR JOURNEY. YOUR PACE.</span>
          <div className='image-caption'>
            Every move
            <br />
            is a fresh start<span>.</span>
          </div>
          <div className='floating-note'>
            <span className='icon-tile'>
              <Icon
                name='activity'
                size={23}
              />
            </span>
            <div>
              <strong>Small steps. Real change.</strong>
              <small>Show up for yourself today.</small>
            </div>
            <Icon
              name='arrowUp'
              size={18}
            />
          </div>
          <div
            className='visual-orbit'
            aria-hidden='true'
          />
        </div>
      </section>
      <div className='landing-stats'>
        <div>
          <strong>{counts?.categories ?? '—'}</strong>
          <span>ways to move</span>
        </div>
        <div>
          <strong>{counts?.exercises ?? '—'}</strong>
          <span>exercises to make your own</span>
        </div>
        <div>
          <strong>{counts?.users ?? '—'}</strong>
          <span>Motion Mates & counting</span>
        </div>
      </div>
      <section className='landing-features'>
        <div className='landing-section-heading'>
          <p className='eyebrow'>MORE THAN A WORKOUT APP</p>
          <h2>
            Everything you need.
            <br />
            All moving with you.
          </h2>
          <p>
            Less overthinking. More doing. Make space for a healthier everyday.
          </p>
        </div>
        <div className='card-grid'>
          {[
            {
              icon: 'dumbbell',
              title: 'Move your way',
              text: 'Build your exercise library, set your timer, and find a routine that feels like you.',
              tone: 'mint',
              number: '01',
            },
            {
              icon: 'target',
              title: 'Make progress personal',
              text: 'Turn “one day” into day one. Set meaningful goals and celebrate every step forward.',
              tone: 'lavender',
              number: '02',
            },
            {
              icon: 'heart',
              title: 'Look after the whole you',
              text: 'Get to know your body with simple tools for hydration, daily calories, and BMI.',
              tone: 'peach',
              number: '03',
            },
          ].map((feature) => (
            <article
              className={`feature-card tone-${feature.tone}`}
              key={feature.title}
            >
              <div>
                <span className='icon-tile'>
                  <Icon
                    name={feature.icon}
                    size={24}
                  />
                </span>
                <small>{feature.number}</small>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <Link
                to='/register'
                aria-label={`Get started: ${feature.title}`}
              >
                <Icon name='arrowUp' />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className='landing-cta'>
        <div>
          <p className='eyebrow'>YOUR NEXT CHAPTER</p>
          <h2>
            Good things start
            <br />
            with a little motion.
          </h2>
        </div>
        <Link
          className='btn btn-lime'
          to='/register'
        >
          Let’s get moving <Icon name='arrow' />
        </Link>
        <div
          className='cta-rings'
          aria-hidden='true'
        />
      </section>
    </div>
  );
}
