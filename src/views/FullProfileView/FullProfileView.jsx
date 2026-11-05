import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { fullFormatDate } from '../../helper/format-date';
import { getUserByUsername } from '../../services/users.service';
import { useEffect, useState } from 'react';
import UserInfo from '../../components/UserInfo/UserInfo';
import SizedAvatar from '../../components/Avatar/Avatar';
import { APP_NAME } from '../../common/constants';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function FullProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  usePageTitle(`${APP_NAME} | ${id} Profile`);

  useEffect(() => {
    try {
      getUserByUsername(id).then((snapshot) => {
        setUser(snapshot.val());
      });
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  return (
    <div className='card card-side shadow-xl bg-base-300 m-4 border-2 border-gray-500 flex flex-wrap rounded-xs '>
      <div className='flex ml-8'>
        <SizedAvatar user={user} />
      </div>
      <div className='container card-body text-left justify-between w-1'>
        <div className='top-div text-center'>
          <div>
            {user?.firstName && user?.lastName ? (
              <h2 className='font-bold mb-8 underline text-primary'>{`${user?.firstName} ${user?.lastName}`}</h2>
            ) : (
              <h2 className='font-bold mb-8 underline text-primary'>
                {user?.username}
              </h2>
            )}
          </div>
          <div className='text-right'>
            <UserInfo userData={user} />
          </div>
          <div>
            <p className='mt-3'>
              Member Since: {fullFormatDate(user?.createdOn)}
            </p>
          </div>
        </div>
        <div className='bottom-div card-actions justify-end mt-4'>
          <button
            onClick={() => navigate(-1)}
            className='btn btn-error'
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
