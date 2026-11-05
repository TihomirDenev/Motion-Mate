import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AppContext } from '../../context/AppContext.js';
import EmptyState from '../../components/UI/EmptyState';
import { Link } from 'react-router';
import { useTranslation } from '../../i18n/useTranslation';

/**
 *
 * @param {{children: any }} props
 * @returns
 */
export default function Authenticated({ children }) {
  const { user, userData } = useContext(AppContext);
  const location = useLocation();
  const { t } = useTranslation();

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
        title={t('auth.profileMissingTitle')}
        description={t('auth.profileMissingDescription')}
      >
        <Link
          className='btn btn-primary'
          to='/contact-us'
        >
          {t('auth.getHelp')}
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
        title={t('auth.pausedTitle')}
        description={t('auth.pausedDescription')}
      >
        <Link
          className='btn btn-primary'
          to='/contact-us'
        >
          {t('auth.contactSupport')}
        </Link>
      </EmptyState>
    );
  return children;
}
