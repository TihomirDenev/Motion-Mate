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

export default function FullProfileView() {
  const { id } = useParams();
  const { userData } = useContext(AppContext);
  const {
    data: user,
    loading,
    error,
  } = useDatabaseValue(/^[\w-]+$/.test(id) ? `users/${id}` : null);
  usePageTitle(`Motion Mate | ${id}’s profile`);
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
        title='This mate isn’t here'
        description='This profile may no longer be available.'
      >
        <Link
          className='btn btn-primary'
          to='/all-users'
        >
          Meet the community
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
        back={{ to: '/all-users', label: 'The community' }}
        eyebrow='MEET YOUR MOTION MATE'
        title='Good company starts here.'
        description='Every journey is a little better with someone in your corner.'
      />
      <section className='profile-hero surface'>
        <div className='profile-cover'>
          <span>A LITTLE MOVEMENT. A SHARED JOURNEY.</span>
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
              {isFriend ? 'YOUR MOTION MATE' : 'PART OF THE COMMUNITY'}
            </span>
            <h2>
              {[user.firstName, user.lastName].filter(Boolean).join(' ') ||
                user.username}
            </h2>
            <p>
              @{user.username} <span>·</span> Moving since{' '}
              {new Date(user.createdOn).toLocaleDateString('en-GB', {
                month: 'long',
                year: 'numeric',
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
          <h2>A little shared inspiration</h2>
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
              title='Good things grow together'
              description='Connect to follow their goals and discover their exercises.'
            />
          </div>
        )}
      </section>
    </div>
  );
}
