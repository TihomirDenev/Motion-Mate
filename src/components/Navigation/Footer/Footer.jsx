import { Link } from 'react-router';

export const Footer = () => (
  <footer className='app-footer'>
    <p>
      © {new Date().getFullYear()} Motion Mate <span>·</span> Made for your
      momentum.
    </p>
    <nav aria-label='Footer navigation'>
      <Link to='/about'>Our story</Link>
      <Link to='/contact-us'>Contact</Link>
      <a
        href='https://github.com/TihomirDenev/Motion-Mate'
        target='_blank'
        rel='noreferrer'
      >
        GitHub ↗
      </a>
    </nav>
  </footer>
);
