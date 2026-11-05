import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AppContext } from '../../context/AppContext.js';
import EmptyState from '../../components/UI/EmptyState';
import { Link } from 'react-router';

/**
 *
 * @param {{children: any }} props
 * @returns
 */
export default function Authenticated({ children }) {
  const { user, userData } = useContext(AppContext);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        replace
        to='/login'
        state={{ from: location }}
      />
    );
  }

  if (!userData)
    return (
      <EmptyState
        icon='user'
        title='Your profile needs a moment'
        description='We could not load your profile. Please sign in again or contact the team.'
      >
        <Link
          className='btn btn-primary'
          to='/contact-us'
        >
          Get help
        </Link>
      </EmptyState>
    );
  if (location.pathname === '/admin-panel' && userData.userRole !== 'admin')
    return (
      <Navigate
        to='/'
        replace
      />
    );
  if (
    userData.isBlocked &&
    !['/my-profile', '/register-additional-info'].includes(location.pathname)
  )
    return (
      <EmptyState
        icon='shield'
        title='Your account is paused'
        description='Contact the Motion Mate team to get back on track.'
      >
        <Link
          className='btn btn-primary'
          to='/contact-us'
        >
          Contact support
        </Link>
      </EmptyState>
    );
  return children;
}
