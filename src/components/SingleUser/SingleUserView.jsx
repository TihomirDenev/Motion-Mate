import { useContext, useState } from 'react';
import { Link } from 'react-router';
import { AppContext } from '../../context/AppContext';
import {
  addFriendService,
  removeFriendRequestService,
  removeFriendService,
  sendRequestService,
} from '../../services/users.service';
import Avatar from '../UI/Avatar';
import Icon from '../UI/Icon';
import InlineMessage from '../UI/InlineMessage';
import { useTranslation } from '../../i18n/useTranslation';

export function FriendActions({ user, showProfile = true }) {
  const { userData } = useContext(AppContext);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const friend = Boolean(userData.friends?.[user.username]);
  const incoming = Boolean(userData.requests?.[user.username]);
  const outgoing = Boolean(userData.myRequests?.[user.username]);
  const act = async (action) => {
    setBusy(true);
    setError('');
    try {
      await action(userData.username, user.username);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className='friend-actions'>
      <div>
        {incoming && !friend ? (
          <>
            <button
              className='btn btn-primary'
              disabled={busy}
              onClick={() => act(addFriendService)}
            >
              <Icon
                name='check'
                size={15}
              />
              {t('people.accept')}
            </button>
            <button
              className='icon-button danger-icon'
              aria-label={t('people.decline', { name: user.username })}
              disabled={busy}
              onClick={() => act(removeFriendRequestService)}
            >
              <Icon
                name='close'
                size={16}
              />
            </button>
          </>
        ) : friend ? (
          <button
            className='btn btn-danger'
            disabled={busy}
            onClick={() => act(removeFriendService)}
            aria-label={t('people.removeLabel', { name: user.username })}
          >
            <Icon
              name='users'
              size={15}
            />
            {t('people.remove')}
          </button>
        ) : outgoing ? (
          <button
            className='btn btn-ghost'
            disabled={busy}
            onClick={() => act(removeFriendRequestService)}
          >
            <Icon
              name='close'
              size={15}
            />
            {t('people.cancelRequest')}
          </button>
        ) : (
          <button
            className='btn btn-primary'
            disabled={busy}
            onClick={() => act(sendRequestService)}
          >
            <Icon
              name='plus'
              size={15}
            />
            {t(busy ? 'people.connecting' : 'people.add')}
          </button>
        )}
        {showProfile && (
          <Link
            className='btn btn-ghost'
            to={`/users/${encodeURIComponent(user.username)}`}
          >
            {t('people.profile')}
            <Icon
              name='arrowUp'
              size={14}
            />
          </Link>
        )}
      </div>
      <InlineMessage>{error}</InlineMessage>
    </div>
  );
}

export default function SingleUserView({ user }) {
  const { userData } = useContext(AppContext);
  const friend = Boolean(userData.friends?.[user.username]);
  const pending = Boolean(userData.myRequests?.[user.username]);
  const { t, formatDate } = useTranslation();
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username;
  return (
    <article className='person-card surface'>
      <div className='person-card-top'>
        <Avatar
          user={user}
          size='lg'
        />
        {friend ? (
          <span className='pill'>
            <Icon
              name='check'
              size={11}
            />
            {t('people.yourMate')}
          </span>
        ) : pending ? (
          <span className='pill pill-neutral'>{t('people.requestSent')}</span>
        ) : (
          <span
            className='person-flower'
            aria-hidden='true'
          >
            <Icon
              name='sparkles'
              size={20}
            />
          </span>
        )}
      </div>
      <Link
        className='person-name'
        to={`/users/${encodeURIComponent(user.username)}`}
      >
        <h2>{name}</h2>
        <p>@{user.username}</p>
      </Link>
      <p className='person-joined'>
        <Icon
          name='calendar'
          size={12}
        />
        {t('profile.movingSince', {
          date: formatDate(user.createdOn, { month: 'short', year: 'numeric' }),
        })}
      </p>
      <FriendActions user={user} />
    </article>
  );
}
