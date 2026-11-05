import { useContext } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { useDatabaseValue } from '../../hooks/useDatabaseValue';
import { usePageTitle } from '../../hooks/usePageTitle';
import { FriendActions } from '../../components/SingleUser/SingleUserView';
import GoalsTable from '../../components/Goals/GoalsTable';
import UserInfo from '../../components/UserInfo/UserInfo';
import PageHeader from '../../components/UI/PageHeader';
import Avatar from '../../components/UI/Avatar';
import Icon from '../../components/UI/Icon';
import LoadingState from '../../components/UI/LoadingState';
import EmptyState from '../../components/UI/EmptyState';
import InlineMessage from '../../components/UI/InlineMessage';
import { useTranslation } from '../../i18n/useTranslation';

export default function FullProfileView() {
  const { id } = useParams();
  const { userData } = useContext(AppContext);
  const {
    data: user,
    loading,
    error,
  } = useDatabaseValue(/^[\w-]+$/.test(id) ? `users/${id}` : null);
  const { t, formatDate } = useTranslation();
  usePageTitle(`Motion Mate | ${t('publicProfile.pageTitle', { name: id })}`);
  if (id === userData.username)
    return (
      <Navigate
        to='/my-profile'
        replace
      />
    );
  if (loading) return <LoadingState />;
  if (error) return <InlineMessage>{error}</InlineMessage>;
  if (!user)
    return (
      <EmptyState
        icon='user'
        title={t('publicProfile.missingTitle')}
        description={t('publicProfile.missingDescription')}
      >
        <Link
          className='btn btn-primary'
          to='/all-users'
        >
          {t('community.meet')}
        </Link>
      </EmptyState>
    );
  const isFriend = Boolean(userData.friends?.[id]);
  const goals = Object.entries(user.myGoals || {}).map(([goalId, goal]) => ({
    ...goal,
    id: goalId,
    owner: id,
  }));
  return (
    <div className='profile-page page-enter'>
      <PageHeader
        back={{ to: '/all-users', label: t('friends.backCommunity') }}
        eyebrow={t('publicProfile.eyebrow')}
        title={t('publicProfile.title')}
        description={t('publicProfile.description')}
      />
      <section className='profile-hero surface'>
        <div className='profile-cover'>
          <span>{t('publicProfile.cover')}</span>
          <Icon
            name='users'
            size={110}
          />
        </div>
        <div className='profile-identity'>
          <Avatar
            user={user}
            size='xl'
            zoomable
          />
          <div className='profile-name'>
            <span className='pill'>
              {t(isFriend ? 'publicProfile.friend' : 'publicProfile.member')}
            </span>
            <h2>
              {[user.firstName, user.lastName].filter(Boolean).join(' ') ||
                user.username}
            </h2>
            <p>
              @{user.username} <span>·</span>{' '}
              {t('profile.movingSince', {
                date: formatDate(user.createdOn, {
                  month: 'long',
                  year: 'numeric',
                }),
              })}
            </p>
          </div>
          <FriendActions
            user={user}
            showProfile={false}
          />
        </div>
      </section>
      <UserInfo userData={user} />
      <section className='section-space'>
        <div className='section-heading'>
          <h2>{t('goals.sharedTitle')}</h2>
          <Icon
            name='target'
            size={20}
          />
        </div>
        {isFriend || userData.userRole === 'admin' ? (
          <GoalsTable goals={goals} />
        ) : (
          <div className='surface'>
            <EmptyState
              icon='users'
              title={t('publicProfile.privateTitle')}
              description={t('publicProfile.privateDescription')}
            />
          </div>
        )}
      </section>
    </div>
  );
}
