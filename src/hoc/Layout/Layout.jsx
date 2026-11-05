import { useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { Footer } from '../../components/Navigation/Footer/Footer';
import { NavBar } from '../../components/Navigation/NavBar/NavBar';
import WorkoutSession from '../../components/HomeAuth/WorkoutSession';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import InlineMessage from '../../components/UI/InlineMessage';
import { useTranslation } from '../../i18n/useTranslation';

export const Layout = ({ children }) => {
  const { userData } = useContext(AppContext);
  const online = useOnlineStatus();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  const mainRef = useRef(null);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    mainRef.current?.focus({ preventScroll: true });
    previousPath.current = pathname;
  }, [pathname]);
  return (
    <div
      className={`app-shell ${userData ? 'authenticated-shell' : 'public-shell'}`}
    >
      <a
        className='skip-link'
        href='#main-content'
      >
        {t('layout.skipToContent')}
      </a>
      <NavBar />
      <div className='app-body'>
        <main
          ref={mainRef}
          id='main-content'
          className='page-content'
          tabIndex={-1}
        >
          {!online && (
            <InlineMessage type='info'>{t('layout.offline')}</InlineMessage>
          )}
          {userData && <WorkoutSession />}
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
