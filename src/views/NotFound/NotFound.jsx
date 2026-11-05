import { Link } from 'react-router';
import { usePageTitle } from '../../hooks/usePageTitle';
import Icon from '../../components/UI/Icon';

export default function NotFound() {
  usePageTitle('Motion Mate | A little off track');
  return (
    <section className='not-found page-enter'>
      <span
        className='not-found-art'
        aria-hidden='true'
      >
        <Icon
          name='activity'
          size={65}
        />
      </span>
      <p className='eyebrow'>404 · A LITTLE OFF TRACK</p>
      <h1>
        Let’s find your
        <br />
        way back.
      </h1>
      <p>
        This path doesn’t lead anywhere just yet.
        <br />
        Your next good move is waiting back home.
      </p>
      <Link
        className='btn btn-primary'
        to='/'
      >
        Back to my momentum{' '}
        <Icon
          name='arrow'
          size={17}
        />
      </Link>
    </section>
  );
}
