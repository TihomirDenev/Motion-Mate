import { NavLink } from 'react-router';
import { AppContext } from '../../../context/AppContext.js';
import { useContext, useEffect, useState } from 'react';
import { logoutUser } from '../../../services/auth.service.js';
import { useNavigate } from 'react-router';
import ThemeChangeIcons from '../ThemeChangeIcons.jsx';
import {
  AvatarWithName,
  AvatarWithNameAndDropDownMenu,
} from '../AvatarWithName.jsx';
import { DARK_THEME, LIGHT_THEME } from '../../../common/constants.js';

export const NavBar = () => {
  const { setAppState, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const [theme, setTheme] = useState(
    !localStorage.getItem('theme') ? LIGHT_THEME : localStorage.getItem('theme')
  );

  const handleToggle = (e) => {
    setTheme(e.target.checked ? DARK_THEME : LIGHT_THEME);
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

  const logout = async (e) => {
    e.preventDefault();
    await logoutUser();
    setAppState({ user: null, userData: null });
    navigate('/');
  };

  return (
    <div className='drawer bg-base-300'>
      <input
        id='my-drawer-3'
        type='checkbox'
        className='drawer-toggle'
      />
      <div className='drawer-content max-w-7xl place-self-center justify-between'>
        {/* Navbar */}
        <div className='grow w-full navbar flex justify-between px-3'>
          <div className='flex items-center'>
            <ThemeChangeIcons
              toggleTheme={handleToggle}
              currentTheme={theme}
            />
            <div className='flex-none lg:hidden'>
              <label
                htmlFor='my-drawer-3'
                aria-label='open sidebar'
                className='btn btn-square btn-ghost'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  className='inline-block w-6 h-6 stroke-current'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M4 6h16M4 12h16M4 18h16'
                  ></path>
                </svg>
              </label>
            </div>
            <div className='flex-none hidden lg:block'>
              <ul className='menu menu-horizontal items-center '>
                {/* Navbar menu content here */}
                {userData?.userRole === 'admin' && (
                  <li>
                    <NavLink
                      to='/admin-panel'
                      className={'font-bold'}
                    >
                      Admin Panel
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink to='/'>Home</NavLink>
                </li>
                {userData && !userData?.isBlocked && (
                  <>
                    <li>
                      <NavLink to='/wellness-health-tools'>
                        Wellness & Health Tools
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to='/goals'>Goals</NavLink>
                    </li>
                    <li>
                      <NavLink to='/exercises'>Exercises</NavLink>
                    </li>
                  </>
                )}
                <li>
                  <NavLink to='/about'>About</NavLink>
                </li>
                {!userData && (
                  <>
                    <li>
                      <NavLink to='/login'>Login</NavLink>
                    </li>

                    <li>
                      <NavLink to='/register'>Register</NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
          {userData?.isBlocked && (
            <div>
              <p className='text-red-500 font-bold text-lg'>
                Your account is temporarily blocked !!!
              </p>
            </div>
          )}
          <div className='flex justify-end'>
            <AvatarWithNameAndDropDownMenu />
          </div>
        </div>
        {/* Page content here */}
      </div>
      <div className='drawer-side z-50'>
        <label
          htmlFor='my-drawer-3'
          aria-label='close sidebar'
          className='drawer-overlay'
        ></label>
        <ul className='menu p-4  min-h-full bg-base-200 gap-2 '>
          {/* Sidebar content here */}

          {userData && <AvatarWithName className />}
          {userData?.userRole === 'admin' && (
            <li>
              <NavLink
                to='/admin-panel'
                className={'font-bold'}
              >
                Admin Panel
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to='/'>Home</NavLink>
          </li>
          {userData && (
            <li>
              <NavLink to='/my-profile'>My Profile</NavLink>
            </li>
          )}
          {userData && !userData?.isBlocked && (
            <>
              <li>
                <NavLink to='/my-friends'>My Friends</NavLink>
              </li>
              <li>
                <NavLink to='/all-users'>All Users</NavLink>
              </li>
              <li>
                <NavLink to='/wellness-health-tools'>
                  Wellness & Health Tools
                </NavLink>
              </li>
              <li>
                <NavLink to='/goals'>Goals</NavLink>
              </li>
              <li>
                <NavLink to='/exercises'>Exercises</NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink to='/about'>About</NavLink>
          </li>
          {!userData ? (
            <>
              <li>
                <NavLink to='/login'>Login</NavLink>
              </li>

              <li>
                <NavLink to='/register'>Register</NavLink>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={(e) => logout(e)}
                className={
                  'btn-ghost hover:text-red-700 hover:font-bold text-red-500'
                }
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
