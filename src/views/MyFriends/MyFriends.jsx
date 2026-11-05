import { useContext, useEffect, useState } from 'react';
import { getAllFriends } from '../../services/users.service';
import { AppContext } from '../../context/AppContext';
import SingleUserView from '../../components/SingleUser/SingleUserView';
import { useNavigate } from 'react-router';
import { APP_NAME } from '../../common/constants';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function MyFriends() {
  usePageTitle(`${APP_NAME} | My Friends`);

  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const [refresh, setRefresh] = useState(false);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const friendList = await getAllFriends(userData?.username);
      setFriendList(friendList);
    };

    fetchUsers();
  }, [refresh, userData?.username]);

  return (
    <div>
      <div className='flex flex-col'>
        <ul>
          {friendList?.length !== 0 ? (
            friendList.map((user) => (
              <li key={user?.uid}>
                <SingleUserView
                  user={user}
                  setRefresh={setRefresh}
                />
              </li>
            ))
          ) : (
            <>
              <div className='flex place-content-center place-items-center min-h-72 text-lg gap-2 border-2 border-primary rounded-lg shadow-lg'>
                <h1 className='text-center'>
                  Looks like you do not have any friends yet
                </h1>
                <button
                  type='button'
                  className='btn btn-warning btn-sm'
                  onClick={() => navigate('/all-users')}
                >
                  find friends now!
                </button>
              </div>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
