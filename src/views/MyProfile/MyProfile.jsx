import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { fullFormatDate } from '../../helper/format-date';
import { getUserByUsername } from '../../services/users.service';
import EditProfileInfo from '../../components/EditProfileInfo/EditProfilePhoto/EditProfileInfo';
import ChangeProfilePhoto from '../../components/EditProfileInfo/ChangeProfilePhoto/ChangeProfilePhoto';
import UserInfo from '../../components/UserInfo/UserInfo';
import { FriendAvatar } from '../../components/Exercise/FriendAvatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCameraRetro,
  faPen,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import { APP_NAME } from '../../common/constants';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function MyProfile() {
  usePageTitle(`${APP_NAME} | My Profile`);

  const { userData, setAppState } = useContext(AppContext);
  const [editProfile, setEditProfile] = useState(false);
  const [changeProfilePhoto, setChangeProfilePhoto] = useState(false);

  const generateFriendTooltips = () => {
    const friendNames = Object.keys(userData.friends).join(', ');
    return friendNames;
  };

  useEffect(() => {
    getUserByUsername(userData?.username).then((res) => {
      setAppState((prev) => {
        return { ...prev, userData: res.val() };
      });
    });
  }, [userData?.username, editProfile, changeProfilePhoto, setAppState]);

  return (
    <div className='flex flex-col'>
      {userData && editProfile === false && changeProfilePhoto === false ? (
        <div className='flex flex-col'>
          <h1 className='my-5 text-4xl font-bold text-center'>My Profile</h1>

          <div className='flex items-center justify-between'>
            <div className='avatar flex items-center'>
              <div className='w-36 mr-6 rounded-full border-2 border-primary'>
                <FriendAvatar username={userData?.username} />
              </div>

              <div>
                <small>Username:</small>
                <h1 className='text-4xl font-bold'>{userData?.username}</h1>
              </div>
            </div>

            <div className='flex flex-col place-items-end  gap-2'>
              <div className='flex place-content-end items-center'>
                <label className='flex items-center select-none justify-between px-1 py-2 gap-1'>Friends</label>
                {userData?.friends ? (
                  <div
                    title={`You have ${Object.keys(userData?.friends).length} ${
                      Object.keys(userData.friends).length > 1
                        ? `friends: ${generateFriendTooltips()}`
                        : `friend: ${generateFriendTooltips()}`
                    }`}
                    className='flex items-center text-xs text-primary border border-primary rounded-lg p-2'
                  >
                    <strong className='mr-1'>
                      {Object.keys(userData.friends).length}
                    </strong>
                    <FontAwesomeIcon icon={faUserGroup} />
                  </div>
                ) : (
                  <div className='flex items-center text-xs text-primary  border border-primary rounded-lg p-2'>
                    <strong className='mr-1'>0</strong>
                    <FontAwesomeIcon icon={faUserGroup} />
                  </div>
                )}
              </div>

              <div className='flex  place-content-end items-center '>
                <label className='flex items-center select-none justify-between px-1 py-2 gap-1'>Edit profile</label>
                <button
                  onClick={() => setEditProfile(!editProfile)}
                  className='btn btn-primary btn-sm rounded-md'
                  title='Edit Profile'
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
              </div>
              <div className='flex  place-content-end items-center'>
                <label className='flex items-center select-none justify-between px-1 py-2 gap-1'>Change profile picture</label>
                <button
                  onClick={() => setChangeProfilePhoto(!changeProfilePhoto)}
                  className='btn btn-primary btn-sm rounded-md'
                  title='Change Profile Picture'
                >
                  <FontAwesomeIcon icon={faCameraRetro} />
                </button>
              </div>
            </div>
          </div>

          <div className='info border-t border-t-gray-500 mt-4 pt-4'>
            <UserInfo userData={userData} />
          </div>
        </div>
      ) : editProfile === true ? (
        <EditProfileInfo setEditProfile={setEditProfile} />
      ) : (
        <ChangeProfilePhoto setChangeProfilePhoto={setChangeProfilePhoto} />
      )}
      <p className='mt-4'>
        Account created on: {fullFormatDate(userData?.createdOn)}
      </p>
    </div>
  );
}
