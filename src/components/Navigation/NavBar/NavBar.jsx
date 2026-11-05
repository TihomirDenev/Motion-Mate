import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { AppContext } from '../../../context/AppContext';
import { logoutUser } from '../../../services/auth.service';
import Brand from '../../UI/Brand';
import Icon from '../../UI/Icon';
import Avatar from '../../UI/Avatar';
import Modal from '../../UI/Modal';
import Notifications from '../Notifications/Notifications';
import LanguageSwitcher from '../../UI/LanguageSwitcher';
import { useTranslation } from '../../../i18n/useTranslation';

const navigation = [
  { to: '/', key: 'overview', icon: 'home', end: true },
  { to: '/exercises', key: 'exercises', icon: 'dumbbell' },
  { to: '/goals', key: 'goals', icon: 'target' },
  { to: '/wellness-health-tools', key: 'wellness', icon: 'heart' },
  { to: '/all-users', key: 'community', icon: 'users' },
];

export const NavBar = () => {
  const { userData, setAppState } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'sunset' ? 'sunset' : 'fantasy'
  );
  const navigate = useNavigate();
  const { t } = useTranslation();
  const signedIn = Boolean(userData);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'sunset' ? '#141b18' : '#f5f7f4');
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* Theme still works when storage is unavailable. */
    }
  }, [theme]);

  const logout = async () => {
    await logoutUser();
    setAppState({ user: null, userData: null });
    setMenuOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <>
      {signedIn && (
        <aside className='sidebar'>
          <Brand />
          <p className='sidebar-label'>{t('nav.sidebarLabel')}</p>
          <nav
            className='side-navigation'
            aria-label={t('nav.main')}
          >
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
              >
                <Icon name={item.icon} />
                <span>{t(`nav.${item.key}`)}</span>
                <Icon
                  name='chevron'
                  size={14}
                  className='nav-chevron'
                />
              </NavLink>
            ))}
          </nav>
          <div className='sidebar-motivation'>
            <span className='icon-tile'>
              <Icon name='sparkles' />
            </span>
            <h3>
              {t('nav.motivationLine1')}
              <br />
              {t('nav.motivationLine2')}
            </h3>
            <p>{t('nav.motivationText')}</p>
            <Link to='/goals'>
              {t('nav.motivationLink')}{' '}
              <Icon
                name='arrow'
                size={16}
              />
            </Link>
            <span
              className='motivation-orbit'
              aria-hidden='true'
            />
          </div>
          <nav
            className='side-navigation secondary-navigation'
            aria-label={t('nav.account')}
          >
            <NavLink to='/my-profile'>
              <Icon name='user' />
              <span>{t('nav.profile')}</span>
            </NavLink>
            <NavLink to='/my-friends'>
              <Icon name='users' />
              <span>{t('nav.friends')}</span>
            </NavLink>
            {userData.userRole === 'admin' && (
              <NavLink to='/admin-panel'>
                <Icon name='shield' />
                <span>{t('nav.admin')}</span>
              </NavLink>
            )}
            <NavLink to='/contact-us'>
              <Icon name='info' />
              <span>{t('nav.help')}</span>
            </NavLink>
          </nav>
          <div className='sidebar-account'>
            <Link to='/my-profile'>
              <Avatar user={userData} />
              <span>
                <strong>{userData.firstName || userData.username}</strong>
                <small>{t('nav.keepMoving')}</small>
              </span>
            </Link>
            <button
              className='icon-button'
              onClick={logout}
              aria-label={t('nav.logout')}
            >
              <Icon
                name='logout'
                size={18}
              />
            </button>
          </div>
        </aside>
      )}
      <header
        className={`topbar ${signedIn ? 'topbar-auth' : 'topbar-public'}`}
      >
        <div className='topbar-inner'>
          <div className='topbar-brand'>
            <Brand />
          </div>
          {signedIn && (
            <div className='desktop-greeting'>
              <span className='status-dot' /> {t('nav.greeting')}
            </div>
          )}
          {!signedIn && (
            <nav
              className='public-navigation'
              aria-label={t('nav.main')}
            >
              <NavLink to='/about'>{t('nav.story')}</NavLink>
              <NavLink to='/contact-us'>{t('nav.contact')}</NavLink>
            </nav>
          )}
          <div className='topbar-actions'>
            <LanguageSwitcher />
            <button
              className='icon-button theme-button'
              aria-label={t(
                theme === 'sunset' ? 'nav.lightTheme' : 'nav.darkTheme'
              )}
              onClick={() =>
                setTheme(theme === 'sunset' ? 'fantasy' : 'sunset')
              }
            >
              <Icon
                name={theme === 'sunset' ? 'sun' : 'moon'}
                size={19}
              />
            </button>
            {signedIn ? (
              <>
                <Notifications />
                <Link
                  className='profile-link'
                  to='/my-profile'
                  aria-label={t('nav.profile')}
                >
                  <Avatar
                    user={userData}
                    size='sm'
                  />
                </Link>
              </>
            ) : (
              <>
                <Link
                  className='btn btn-primary public-login'
                  to='/login'
                >
                  {t('nav.login')}{' '}
                  <Icon
                    name='arrow'
                    size={16}
                  />
                </Link>
                <button
                  className='icon-button mobile-menu-button'
                  aria-label={t('nav.openMenu')}
                  onClick={() => setMenuOpen(true)}
                >
                  <Icon name='menu' />
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      {signedIn && (
        <nav
          className='bottom-navigation'
          aria-label={t('nav.mobile')}
        >
          {navigation.map((item) => (
            <NavLink
              to={item.to}
              end={item.end}
              key={item.to}
            >
              <span>
                <Icon
                  name={item.icon}
                  size={21}
                />
              </span>
              <small>{t(`nav.mobileLabels.${item.key}`)}</small>
            </NavLink>
          ))}
        </nav>
      )}
      <Modal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title={t('nav.menuTitle')}
      >
        <nav
          className='mobile-menu-links'
          aria-label={t('nav.more')}
        >
          {[
            { to: '/', label: t('nav.home') },
            { to: '/about', label: t('nav.story') },
            { to: '/contact-us', label: t('nav.contact') },
            { to: '/register', label: t('nav.register') },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <Icon name='arrow' />
            </Link>
          ))}
        </nav>
      </Modal>
    </>
  );
};
