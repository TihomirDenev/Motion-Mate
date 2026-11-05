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
import { useTranslation } from '../../i18n/useTranslation';

export default function MyFriends() {
  const { t } = useTranslation();
  usePageTitle(`Motion Mate | ${t('community.myCircle')}`);
  const { userData } = useContext(AppContext);
  const { data, loading, error } = useDatabaseValue('users');
  const [tab, setTab] = useState('friends');
  const tabs = [
    { key: 'friends', label: t('friends.tabs.friends') },
    { key: 'myRequests', label: t('friends.tabs.sent') },
    { key: 'requests', label: t('friends.tabs.received') },
  ];
  const users = Object.values(data || {}).filter(
    (user) => userData[tab]?.[user.username]
  );
  return (
    <div className='page-enter'>
      <PageHeader
        back={{ to: '/all-users', label: t('friends.backCommunity') }}
        eyebrow={t('friends.eyebrow')}
        title={t('friends.title')}
        description={t('friends.description')}
        actions={
          <Link
            className='btn btn-primary'
            to='/all-users'
          >
            <Icon
              name='plus'
              size={17}
            />
            {t('friends.findMore')}
          </Link>
        }
      />
      <div
        className='filter-chips friends-tabs'
        role='group'
        aria-label={t('friends.lists')}
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
            title={t(
              tab === 'friends'
                ? 'friends.emptyTitle'
                : 'friends.requestsEmptyTitle'
            )}
            description={t(
              tab === 'friends'
                ? 'friends.emptyDescription'
                : 'friends.requestsEmptyDescription'
            )}
          >
            <Link
              className='btn btn-primary'
              to='/all-users'
            >
              {t('friends.explore')}{' '}
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
