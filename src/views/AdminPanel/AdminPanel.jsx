import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  blockUserAsync,
  deleteUserAsync,
  getAllUsers,
  promoteToAdminAsync,
} from '../../services/users.service';
import AlertSuccess from '../../components/Alerts/AlertSuccess/AlertSuccess';
import { alertHelper } from '../../helper/alert-helper';
import { APP_NAME } from '../../common/constants';
import { usePageTitle } from '../../hooks/usePageTitle';
import { handleAvatarError } from '../../helper/avatar-fallback';

export default function AdminPanel() {
  usePageTitle(`${APP_NAME} | 👨🏼‍✈️👮🏼‍♂️👨🏼‍✈️`);

  const { userData } = useContext(AppContext);

  const [allUsers, setAllUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getAllUsers();
      const users = Object.values(snapshot.val());
      const filteredData = users.filter(
        (user) => user.username !== userData?.username
      );
      setAllUsers(filteredData);
    };

    fetchUsers();
  }, [refresh, userData?.username]);

  const promoteToAdmin = async (user, role) => {
    await promoteToAdminAsync(user.username, role);
    setRefresh((prev) => !prev);
  };

  const toggleUserBlock = async (user) => {
    await blockUserAsync(user.username, !user.isBlocked);
    setRefresh((prev) => !prev);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUserAsync(userToDelete.username);
      alertHelper(setMessage, setSuccess, 'User delete successfully!');
      setRefresh((prev) => !prev);
    }
  };

  const cancelDelete = () => {
    setUserToDelete(null);
  };

  return (
    <div>
      <div className='flex justify-center my-2'>
        <h1 className='font-bold text-2xl mb-3'>Administrator Control Panel</h1>
      </div>
      <div>
        {allUsers.length !== 0 ? (
          allUsers.map((user) => (
            <div key={user.username}>
              <hr className='w-full border-t-2 border-gray-300' />
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className='avatar'>
                    <div className='avatar w-16 rounded-full border-black mr-2 my-3'>
                      {user?.avatar && (
                        <img
                          src={user?.avatar}
                          onError={handleAvatarError}
                          title='Account'
                          alt='Account'
                        />
                      )}
                    </div>
                  </div>

                  {user?.firstName && user?.lastName ? (
                    <h2 className='text-md font-bold mx-2'>
                      {`${user?.firstName} ${user?.lastName}`}
                    </h2>
                  ) : (
                    <h2 className='text-md font-bold mx-2'>{user?.username}</h2>
                  )}
                </div>
                <div>
                  {user?.userRole === 'user' ? (
                    <button
                      className='btn btn-success mx-2'
                      onClick={() => promoteToAdmin(user, 'admin')}
                    >
                      Make Admin
                    </button>
                  ) : (
                    <button
                      className='btn btn-error mx-2'
                      onClick={() => promoteToAdmin(user, 'user')}
                    >
                      Remove Admin
                    </button>
                  )}
                  {user?.isBlocked === false ? (
                    <button
                      className='btn btn-warning mx-2'
                      onClick={() => toggleUserBlock(user)}
                    >
                      Block User
                    </button>
                  ) : (
                    <button
                      className='btn btn-warning mx-2'
                      onClick={() => toggleUserBlock(user)}
                    >
                      Unblock User
                    </button>
                  )}
                  <button
                    className='btn btn-error mx-2'
                    onClick={() => setUserToDelete(user)}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
              {userToDelete?.username === user.username && (
                <div
                  role='alert'
                  className='alert mb-3'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    className='stroke-info shrink-0 w-6 h-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    ></path>
                  </svg>
                  <span>
                    Are you sure you want to delete the account of{' '}
                    {userToDelete?.username}?
                  </span>
                  <div>
                    <button
                      className='btn btn-sm btn-primary mx-2 '
                      onClick={confirmDelete}
                    >
                      Confirm
                    </button>
                    <button
                      className='btn btn-sm btn-error'
                      onClick={cancelDelete}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <h1 className='text-center'>No users found!</h1>
        )}
      </div>
      {success && <AlertSuccess message={message} />}
    </div>
  );
}
