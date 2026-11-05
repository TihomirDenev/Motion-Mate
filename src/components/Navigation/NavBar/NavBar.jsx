import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { AppContext } from '../../../context/AppContext';
import { logoutUser } from '../../../services/auth.service';
import Brand from '../../UI/Brand';
import Icon from '../../UI/Icon';
import Avatar from '../../UI/Avatar';
import Modal from '../../UI/Modal';
import Notifications from '../Notifications/Notifications';

const navigation = [
  { to: '/', label: 'Overview', mobile: 'Today', icon: 'home', end: true },
  {
    to: '/exercises',
    label: 'Exercise library',
    mobile: 'Train',
    icon: 'dumbbell',
  },
  { to: '/goals', label: 'My goals', mobile: 'Goals', icon: 'target' },
  {
    to: '/wellness-health-tools',
    label: 'Wellness tools',
    mobile: 'Wellness',
    icon: 'heart',
  },
  { to: '/all-users', label: 'Community', mobile: 'Mates', icon: 'users' },
];

export const NavBar = () => {
  const { userData, setAppState } = useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === 'sunset' ? 'sunset' : 'fantasy'
  );
  const navigate = useNavigate();
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
          <p className='sidebar-label'>YOUR DAILY MOMENTUM</p>
          <nav
            className='side-navigation'
            aria-label='Main navigation'
          >
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
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
              A little better.
              <br />
              Every single day.
            </h3>
            <p>Your next chapter starts with one small move.</p>
            <Link to='/goals'>
              Make it happen{' '}
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
            aria-label='Account navigation'
          >
            <NavLink to='/my-profile'>
              <Icon name='user' />
              <span>My profile</span>
            </NavLink>
            <NavLink to='/my-friends'>
              <Icon name='users' />
              <span>My friends</span>
            </NavLink>
            {userData.userRole === 'admin' && (
              <NavLink to='/admin-panel'>
                <Icon name='shield' />
                <span>Administration</span>
              </NavLink>
            )}
            <NavLink to='/contact-us'>
              <Icon name='info' />
              <span>Help & support</span>
            </NavLink>
          </nav>
          <div className='sidebar-account'>
            <Link to='/my-profile'>
              <Avatar user={userData} />
              <span>
                <strong>{userData.firstName || userData.username}</strong>
                <small>Keep moving forward</small>
              </span>
            </Link>
            <button
              className='icon-button'
              onClick={logout}
              aria-label='Log out'
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
              <span className='status-dot' /> YOUR SPACE TO MOVE
            </div>
          )}
          {!signedIn && (
            <nav
              className='public-navigation'
              aria-label='Main navigation'
            >
              <NavLink to='/about'>Our story</NavLink>
              <NavLink to='/contact-us'>Get in touch</NavLink>
            </nav>
          )}
          <div className='topbar-actions'>
            <button
              className='icon-button theme-button'
              aria-label={`Switch to ${theme === 'sunset' ? 'light' : 'dark'} theme`}
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
                  aria-label='My profile'
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
                  Log in{' '}
                  <Icon
                    name='arrow'
                    size={16}
                  />
                </Link>
                <button
                  className='icon-button mobile-menu-button'
                  aria-label='Open menu'
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
          aria-label='Mobile navigation'
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
              <small>{item.mobile}</small>
            </NavLink>
          ))}
        </nav>
      )}
      <Modal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title='Let’s move.'
      >
        <nav
          className='mobile-menu-links'
          aria-label='More navigation'
        >
          {[
            { to: '/', label: 'Home' },
            { to: '/about', label: 'Our story' },
            { to: '/contact-us', label: 'Get in touch' },
            { to: '/register', label: 'Create an account' },
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
