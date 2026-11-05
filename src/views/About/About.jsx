import { useContext } from 'react';
import { Link } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import Icon from '../../components/UI/Icon';

export default function About() {
  usePageTitle('Motion Mate | Our story');
  const { userData } = useContext(AppContext);
  return (
    <div className='about-page page-enter'>
      <section className='about-intro'>
        <div>
          <p className='eyebrow'>A LITTLE ABOUT US</p>
          <h1>
            Life feels better
            <br />
            in <span>motion.</span>
          </h1>
          <p>
            We believe a healthier life isn’t built in one big leap. It’s built
            in the small things — a morning stretch, one more rep, a friend who
            says, “You’ve got this.”
          </p>
          <p>
            Motion Mate is a space for those small things. Your goals, your
            workouts, your kind of progress. All moving with you.
          </p>
          <Link
            className='btn btn-primary'
            to={userData ? '/exercises' : '/register'}
          >
            Find your momentum{' '}
            <Icon
              name='arrow'
              size={17}
            />
          </Link>
        </div>
        <div className='about-photo'>
          <img
            src='/images/yoga.jpg'
            alt='Friends finding balance in an outdoor yoga session'
          />
          <span>YOUR PACE. YOUR PEOPLE. YOUR POTENTIAL.</span>
        </div>
      </section>
      <section className='about-values'>
        <div className='landing-section-heading'>
          <p className='eyebrow'>WHAT WE’RE HERE FOR</p>
          <h2>
            A stronger you.
            <br />A healthier everyday.
          </h2>
        </div>
        <div className='card-grid'>
          {[
            {
              icon: 'dumbbell',
              title: 'Movement, made yours',
              copy: 'Build a personal exercise library and turn “I should” into “I did.” Start a timer, find your rhythm, and show up for you.',
              tone: 'mint',
            },
            {
              icon: 'target',
              title: 'Progress over perfection',
              copy: 'Set goals that mean something to you. Track exercises, calories, or your own milestones, and celebrate every small win.',
              tone: 'lavender',
            },
            {
              icon: 'users',
              title: 'Good company matters',
              copy: 'Find people who bring out your best. Share your exercises and goals with a circle that keeps you moving forward.',
              tone: 'peach',
            },
          ].map((item) => (
            <article
              className={`feature-card tone-${item.tone}`}
              key={item.title}
            >
              <span className='icon-tile'>
                <Icon
                  name={item.icon}
                  size={24}
                />
              </span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className='about-manifesto'>
        <Icon
          name='activity'
          size={36}
        />
        <h2>
          You don’t need to be
          <br />a different person to begin.
          <br />
          <span>You just need to begin.</span>
        </h2>
        <p>
          Made with care by Tihomir Denev, Radoslav Marinov, and Tanya Zhecheva.
        </p>
        <Link
          className='text-button'
          to='/contact-us'
        >
          Meet the people behind the movement{' '}
          <Icon
            name='arrow'
            size={16}
          />
        </Link>
      </section>
    </div>
  );
}
