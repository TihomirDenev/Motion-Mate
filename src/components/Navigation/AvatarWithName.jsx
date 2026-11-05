import { NavLink, useNavigate } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { logoutUser } from '../../services/auth.service';
import userPhoto from '../../assets/userPhoto.png';
import Notifications from './Notifications/Notifications';
import { onValue, ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { handleAvatarError } from '../../helper/avatar-fallback';

export function AvatarWithNameAndDropDownMenu() {
  const { user, userData, setAppState } = useContext(AppContext);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const logout = async (e) => {
    e.preventDefault();
    await logoutUser();
    setAppState({ user: null, userData: null });
    navigate('/');
  };

  useEffect(() => {
    return onValue(ref(db, `users/${userData?.username}`), (snapshot) => {
      const data = snapshot?.val();
      const dataRequests = data?.requests || [];
      setRequests(Object.keys(dataRequests));
    });
  }, [userData?.username]);

  return (
    <div className='flex justify-end'>
      {user && (
        <div className='flex items-center'>
          <Notifications requests={requests} />
          <div>
            {userData?.firstName ? (
              <div className='flex flex-col'>
                <h2 className='text-xl font-bold mx-2'>
                  {`${userData?.firstName} ${userData?.lastName}`}
                </h2>
              </div>
            ) : (
              <h2 className='text-xl font-bold mx-2'>{userData?.username}</h2>
            )}
          </div>

          <div className='dropdown dropdown-hover flex items-center'>
            <div>
              <div className='avatar'>
                <div className='avatar w-16 rounded-full border-black'>
                  {userData?.avatar ? (
                    <img
                      src={userData?.avatar}
                      onError={handleAvatarError}
                      title='Account'
                      alt='Account'
                    />
                  ) : (
                    <img
                      src={userPhoto}
                      alt='userPhoto'
                      className='fill-current'
                      title='User Photo'
                    />
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className='dropdown-content z-[1] menu p-2 shadow-sm bg-base-100 rounded-box w-52 border border-gray-400 absolute right-0'
              >
                <li>
                  <NavLink to='/my-profile'>My Profile</NavLink>
                </li>
                {userData && !userData?.isBlocked && (
                  <>
                    <li>
                      <NavLink to='/my-friends'>My Friends</NavLink>
                    </li>
                    <li>
                      <NavLink to='/all-users'>All Users</NavLink>
                    </li>
                  </>
                )}
                <li>
                  <button
                    className='hover:text-red-700 hover:font-bold text-red-500'
                    onClick={(e) => logout(e)}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AvatarWithName() {
  const { userData, user } = useContext(AppContext);
  return (
    user && (
      <div className='flex items-center justify-left'>
        <div className='avatar'>
          <div className='avatar w-16 rounded-full border-black mr-2 mb-2'>
            {userData?.avatar ? (
              <img
                src={userData?.avatar}
                onError={handleAvatarError}
                title='Account'
                alt='Account'
              />
            ) : (
              <img
                src={userPhoto}
                alt='userPhoto'
                className='fill-current'
                title='User Photo'
              />
            )}
          </div>
        </div>

        {userData?.firstName ? (
          <h2 className='text-4xl font-bold mx-2'>
            {`${userData?.firstName} ${userData?.lastName}`}
          </h2>
        ) : (
          <h2 className='text-4xl font-bold mx-2'>{userData?.username}</h2>
        )}
      </div>
    )
  );
}
