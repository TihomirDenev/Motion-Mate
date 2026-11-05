import { useContext, useState } from 'react';
import { Link } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { useDatabaseValue } from '../../hooks/useDatabaseValue';
import { usePageTitle } from '../../hooks/usePageTitle';
import SingleUserView from '../../components/SingleUser/SingleUserView';
import PageHeader from '../../components/UI/PageHeader';
import Icon from '../../components/UI/Icon';
import LoadingState from '../../components/UI/LoadingState';
import EmptyState from '../../components/UI/EmptyState';
import InlineMessage from '../../components/UI/InlineMessage';

export default function MyFriends() {
  usePageTitle('Motion Mate | My circle');
  const { userData } = useContext(AppContext);
  const { data, loading, error } = useDatabaseValue('users');
  const [tab, setTab] = useState('friends');
  const tabs = [
    { key: 'friends', label: 'My mates' },
    { key: 'myRequests', label: 'Sent requests' },
    { key: 'requests', label: 'Received' },
  ];
  const users = Object.values(data || {}).filter(
    (user) => userData[tab]?.[user.username]
  );
  return (
    <div className='page-enter'>
      <PageHeader
        back={{ to: '/all-users', label: 'The community' }}
        eyebrow='THE PEOPLE IN YOUR CORNER'
        title='Your circle. Your energy.'
        description='Keep good company on your way to feeling good.'
        actions={
          <Link
            className='btn btn-primary'
            to='/all-users'
          >
            <Icon
              name='plus'
              size={17}
            />
            Find more mates
          </Link>
        }
      />
      <div
        className='filter-chips friends-tabs'
        role='group'
        aria-label='Friend lists'
      >
        {tabs.map((item) => (
          <button
            key={item.key}
            className='filter-chip'
            aria-pressed={tab === item.key}
            onClick={() => setTab(item.key)}
          >
            {item.label}
            <small>{Object.keys(userData[item.key] || {}).length}</small>
          </button>
        ))}
      </div>
      <InlineMessage>{error}</InlineMessage>
      {loading ? (
        <LoadingState />
      ) : users.length ? (
        <div className='people-grid'>
          {users.map((user) => (
            <SingleUserView
              key={user.username}
              user={user}
            />
          ))}
        </div>
      ) : (
        <div className='surface'>
          <EmptyState
            icon={tab === 'friends' ? 'users' : 'mail'}
            title={
              tab === 'friends'
                ? 'Your circle starts with a hello'
                : 'Nothing waiting in the wings'
            }
            description={
              tab === 'friends'
                ? 'Find a mate, share a little motivation, and make progress together.'
                : 'Friend requests will appear here. Go meet someone who moves like you.'
            }
          >
            <Link
              className='btn btn-primary'
              to='/all-users'
            >
              Explore the community{' '}
              <Icon
                name='arrow'
                size={16}
              />
            </Link>
          </EmptyState>
        </div>
      )}
    </div>
  );
}
