import { useContext, useState } from 'react';
import { Link } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { useDatabaseValue } from '../../hooks/useDatabaseValue';
import { usePageTitle } from '../../hooks/usePageTitle';
import {
  blockUserAsync,
  deleteUserAsync,
  promoteToAdminAsync,
} from '../../services/users.service';
import PageHeader from '../../components/UI/PageHeader';
import Icon from '../../components/UI/Icon';
import Avatar from '../../components/UI/Avatar';
import LoadingState from '../../components/UI/LoadingState';
import EmptyState from '../../components/UI/EmptyState';
import InlineMessage from '../../components/UI/InlineMessage';
import Modal from '../../components/UI/Modal';

export default function AdminPanel() {
  usePageTitle('Motion Mate | Administration');
  const { userData } = useContext(AppContext);
  const {
    data,
    loading,
    error: loadError,
  } = useDatabaseValue(userData.userRole === 'admin' ? 'users' : null);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const allUsers = Object.values(data || {});
  const users = allUsers.filter(
    (user) =>
      user.username !== userData.username &&
      `${user.username} ${user.firstName || ''} ${user.lastName || ''}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );
  const act = async (user, action) => {
    setBusy(user.username);
    setError('');
    setMessage('');
    try {
      if (action === 'role')
        await promoteToAdminAsync(
          user.username,
          user.userRole === 'admin' ? 'user' : 'admin'
        );
      if (action === 'block')
        await blockUserAsync(user.username, !user.isBlocked);
      if (action === 'delete') {
        await deleteUserAsync(user.username);
        setSelected(null);
      }
      setMessage(
        action === 'delete'
          ? 'Community profile removed.'
          : 'Community access updated.'
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy('');
    }
  };
  return (
    <div className='page-enter'>
      <PageHeader
        eyebrow='LOOK AFTER YOUR COMMUNITY'
        title='A space in good hands.'
        description='Manage community profiles, access, and the people who help keep things moving.'
      />
      <div className='admin-summary'>
        {[
          {
            label: 'Community members',
            value: allUsers.length,
            icon: 'users',
            tone: 'mint',
          },
          {
            label: 'Administrators',
            value: allUsers.filter((user) => user.userRole === 'admin').length,
            icon: 'shield',
            tone: 'lavender',
          },
          {
            label: 'Paused accounts',
            value: allUsers.filter((user) => user.isBlocked).length,
            icon: 'user',
            tone: 'peach',
          },
        ].map((item) => (
          <div
            key={item.label}
            className='surface'
          >
            <span className={`icon-tile tone-${item.tone}`}>
              <Icon
                name={item.icon}
                size={22}
              />
            </span>
            <div>
              <strong>{item.value}</strong>
              <p>{item.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='toolbar section-space'>
        <label className='search-field'>
          <Icon
            name='search'
            size={18}
          />
          <input
            type='search'
            aria-label='Search community members'
            placeholder='Find a community member…'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <span className='result-count'>{users.length} profiles</span>
      </div>
      <InlineMessage>{error || loadError}</InlineMessage>
      <InlineMessage type='success'>{message}</InlineMessage>
      {loading ? (
        <LoadingState />
      ) : users.length ? (
        <div className='admin-user-list surface'>
          {users.map((user) => (
            <article
              className='admin-user-row'
              key={user.username}
            >
              <Link
                className='admin-user-identity'
                to={`/users/${encodeURIComponent(user.username)}`}
              >
                <Avatar user={user} />
                <div>
                  <h2>
                    {[user.firstName, user.lastName]
                      .filter(Boolean)
                      .join(' ') || user.username}
                  </h2>
                  <p>@{user.username}</p>
                </div>
              </Link>
              <div className='admin-user-status'>
                <span
                  className={`pill ${user.isBlocked ? 'pill-peach' : 'pill-neutral'}`}
                >
                  {user.isBlocked ? 'Paused' : 'Active'}
                </span>
                {user.userRole === 'admin' && (
                  <span className='pill pill-lavender'>Admin</span>
                )}
              </div>
              <div className='admin-user-actions'>
                <button
                  className='btn btn-ghost btn-sm'
                  disabled={busy === user.username}
                  onClick={() => act(user, 'role')}
                >
                  <Icon
                    name='shield'
                    size={14}
                  />
                  {user.userRole === 'admin' ? 'Make member' : 'Make admin'}
                </button>
                <button
                  className='btn btn-ghost btn-sm'
                  disabled={busy === user.username}
                  onClick={() => act(user, 'block')}
                >
                  {user.isBlocked ? 'Restore access' : 'Pause access'}
                </button>
                <button
                  className='icon-button danger-button'
                  disabled={busy === user.username}
                  onClick={() => {
                    setError('');
                    setSelected(user);
                  }}
                  aria-label={`Remove profile ${user.username}`}
                >
                  <Icon
                    name='trash'
                    size={16}
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className='surface'>
          <EmptyState
            icon='search'
            title='No matching profiles'
            description='Try a different name or username.'
          />
        </div>
      )}
      <Modal
        open={Boolean(selected)}
        onClose={() => !busy && setSelected(null)}
        title='Remove this community profile?'
        description={
          selected
            ? `${selected.username}’s profile and its saved data will be removed from Motion Mate. This doesn’t delete their Firebase sign-in account.`
            : ''
        }
      >
        <InlineMessage>{error}</InlineMessage>
        <div className='dialog-actions'>
          <button
            className='btn btn-ghost'
            disabled={Boolean(busy)}
            onClick={() => setSelected(null)}
          >
            Cancel
          </button>
          <button
            className='btn btn-error'
            disabled={Boolean(busy)}
            onClick={() => act(selected, 'delete')}
          >
            {busy ? 'Removing…' : 'Remove profile'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
