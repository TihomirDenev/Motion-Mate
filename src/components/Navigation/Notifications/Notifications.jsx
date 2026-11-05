import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import {
  addFriendService,
  getUserByUsername,
  removeFriendRequestService,
} from '../../../services/users.service';
import Modal from '../../UI/Modal';
import Icon from '../../UI/Icon';
import Avatar from '../../UI/Avatar';
import EmptyState from '../../UI/EmptyState';
import InlineMessage from '../../UI/InlineMessage';
import { useTranslation } from '../../../i18n/useTranslation';

export default function Notifications() {
  const { userData } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');
  const { t } = useTranslation();
  const requests = Object.keys(userData?.requests || {});
  const requestKey = requests.join(',');

  useEffect(() => {
    if (!requestKey || !open) return;
    let ignore = false;
    Promise.all(requestKey.split(',').map((name) => getUserByUsername(name)))
      .then((snapshots) => {
        if (!ignore)
          setUsers(snapshots.map((snapshot) => snapshot.val()).filter(Boolean));
      })
      .catch((error) => {
        if (!ignore) setError(error.message);
      });
    return () => {
      ignore = true;
    };
  }, [requestKey, open]);

  const respond = async (username, accept) => {
    setBusy(username);
    setError('');
    try {
      await (accept ? addFriendService : removeFriendRequestService)(
        userData.username,
        username
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy('');
    }
  };

  return (
    <>
      <button
        className='icon-button notification-button'
        aria-label={
          requests.length
            ? t('notifications.labelWithCount', { count: requests.length })
            : t('notifications.label')
        }
        onClick={() => setOpen(true)}
      >
        <Icon
          name='bell'
          size={21}
        />
        {requests.length > 0 && <span className='notification-dot' />}
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t('notifications.title')}
        description={t('notifications.description')}
      >
        <InlineMessage>{error}</InlineMessage>
        {requests.length ? (
          <div className='notification-list'>
            {users
              .filter((user) => requests.includes(user.username))
              .map((user) => (
                <div
                  className='notification-row'
                  key={user.username}
                >
                  <Avatar user={user} />
                  <div>
                    <strong>{user.firstName || user.username}</strong>
                    <p>{t('notifications.wantsToConnect')}</p>
                  </div>
                  <div className='notification-actions'>
                    <button
                      disabled={busy === user.username}
                      className='icon-button accept-button'
                      aria-label={t('notifications.accept', {
                        name: user.username,
                      })}
                      onClick={() => respond(user.username, true)}
                    >
                      <Icon name='check' />
                    </button>
                    <button
                      disabled={busy === user.username}
                      className='icon-button danger-icon'
                      aria-label={t('notifications.decline', {
                        name: user.username,
                      })}
                      onClick={() => respond(user.username, false)}
                    >
                      <Icon name='close' />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <EmptyState
            icon='bell'
            title={t('notifications.emptyTitle')}
            description={t('notifications.emptyDescription')}
          />
        )}
      </Modal>
    </>
  );
}
