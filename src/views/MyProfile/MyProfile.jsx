import { useContext, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { logoutUser } from '../../services/auth.service';
import { profileWellness } from '../../helper/wellness';
import { resetUserScores } from '../../services/users.service';
import EditProfileInfo from '../../components/EditProfileInfo/EditProfilePhoto/EditProfileInfo';
import ChangeProfilePhoto from '../../components/EditProfileInfo/ChangeProfilePhoto/ChangeProfilePhoto';
import UserInfo from '../../components/UserInfo/UserInfo';
import PageHeader from '../../components/UI/PageHeader';
import Avatar from '../../components/UI/Avatar';
import Icon from '../../components/UI/Icon';
import Modal from '../../components/UI/Modal';
import InlineMessage from '../../components/UI/InlineMessage';

export default function MyProfile() {
  usePageTitle('Motion Mate | My profile');
  const { userData } = useContext(AppContext);
  const [params, setParams] = useSearchParams();
  const [resetOpen, setResetOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const tab = params.get('tab');
  const friends = Object.keys(userData.friends || {}).length;
  const bmi = profileWellness('bmi', userData);
  const completeGoals = Object.values(userData.myGoals || {}).filter(
    (goal) => Number(goal.progress) >= 100
  ).length;
  const memberSince = new Date(userData.createdOn).toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
  const closeEditor = () => setParams({});
  const logout = async () => {
    try {
      await logoutUser();
      navigate('/login', { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };
  const reset = async () => {
    setBusy(true);
    setError('');
    try {
      await resetUserScores(userData.username);
      setResetOpen(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  };
  if (tab === 'edit') return <EditProfileInfo setEditProfile={closeEditor} />;
  if (tab === 'photo')
    return <ChangeProfilePhoto setChangeProfilePhoto={closeEditor} />;

  return (
    <div className='profile-page page-enter'>
      <PageHeader
        eyebrow='YOUR PERSONAL SPACE'
        title='A little more you.'
        description='The person behind every small step and every big win.'
      />
      <section className='profile-hero surface'>
        <div className='profile-cover'>
          <span>YOUR JOURNEY. YOUR PACE.</span>
          <Icon
            name='activity'
            size={110}
          />
          <button
            className='profile-photo-button'
            aria-label='Change profile photo'
            onClick={() => setParams({ tab: 'photo' })}
          >
            <Icon
              name='camera'
              size={16}
            />
            <span>Change photo</span>
          </button>
        </div>
        <div className='profile-identity'>
          <Avatar
            user={userData}
            size='xl'
            zoomable
          />
          <div className='profile-name'>
            <span className='pill'>
              {userData.userRole === 'admin'
                ? 'COMMUNITY ADMIN'
                : 'MOTION MATE'}
            </span>
            <h2>
              {[userData.firstName, userData.lastName]
                .filter(Boolean)
                .join(' ') || userData.username}
            </h2>
            <p>
              @{userData.username} <span>·</span> Moving since {memberSince}
            </p>
          </div>
          <button
            className='btn btn-primary'
            onClick={() => setParams({ tab: 'edit' })}
          >
            <Icon
              name='edit'
              size={16}
            />
            Edit profile
          </button>
        </div>
        <div className='profile-social-stats'>
          <Link to='/my-friends'>
            <strong>{friends}</strong>
            <span>Motion Mates</span>
            <Icon
              name='arrowUp'
              size={14}
            />
          </Link>
          <Link to='/goals'>
            <strong>{completeGoals}</strong>
            <span>Goals celebrated</span>
            <Icon
              name='arrowUp'
              size={14}
            />
          </Link>
          <Link to='/'>
            <strong>{userData.updatedScores?.doneExercises || 0}</strong>
            <span>Exercises completed</span>
            <Icon
              name='arrowUp'
              size={14}
            />
          </Link>
        </div>
      </section>
      <div className='section-heading section-space'>
        <div>
          <h2>Your wellness snapshot</h2>
          <p>A starting point for getting to know your body.</p>
        </div>
        <Link to='/wellness-health-tools'>
          Explore tools{' '}
          <Icon
            name='arrow'
            size={14}
          />
        </Link>
      </div>
      <div className='profile-health-grid'>
        {[
          {
            icon: 'scale',
            label: 'Weight',
            value: userData.weight,
            unit: 'kg',
            tone: 'blue',
          },
          {
            icon: 'activity',
            label: 'Height',
            value: userData.height,
            unit: 'cm',
            tone: 'mint',
          },
          {
            icon: 'heart',
            label: 'Body mass index',
            value: bmi?.value,
            unit: 'BMI',
            tone: 'lavender',
          },
        ].map((stat) => (
          <Link
            className={`profile-health-card tone-${stat.tone}`}
            to='/wellness-health-tools'
            key={stat.label}
          >
            <span className='icon-tile'>
              <Icon
                name={stat.icon}
                size={20}
              />
            </span>
            <span>{stat.label}</span>
            <strong>
              {stat.value || '—'} <small>{stat.unit}</small>
            </strong>
          </Link>
        ))}
      </div>
      <UserInfo userData={userData} />
      <section className='surface profile-settings'>
        <div className='section-heading'>
          <h2>Your space, your way</h2>
          <Icon
            name='settings'
            size={19}
          />
        </div>
        <div className='profile-links'>
          {[
            {
              to: '/my-friends',
              icon: 'users',
              label: 'My Motion Mates',
              detail: 'Good company. Better momentum.',
            },
            {
              to: '/about',
              icon: 'leaf',
              label: 'About Motion Mate',
              detail: 'A little more about our story.',
            },
            {
              to: '/contact-us',
              icon: 'info',
              label: 'Help & support',
              detail: 'We’re here for your journey.',
            },
            ...(userData.userRole === 'admin'
              ? [
                  {
                    to: '/admin-panel',
                    icon: 'shield',
                    label: 'Administration',
                    detail: 'Look after your community.',
                  },
                ]
              : []),
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
            >
              <span className='icon-tile'>
                <Icon
                  name={link.icon}
                  size={18}
                />
              </span>
              <span>
                <strong>{link.label}</strong>
                <small>{link.detail}</small>
              </span>
              <Icon
                name='chevron'
                size={16}
              />
            </Link>
          ))}
        </div>
        <div className='profile-settings-bottom'>
          <button
            className='text-button muted'
            disabled={Boolean(userData.endCurrentExercise)}
            onClick={() => {
              setError('');
              setResetOpen(true);
            }}
          >
            <Icon
              name='refresh'
              size={14}
            />
            Reset workout totals
          </button>
          <button
            className='text-button danger-button'
            onClick={logout}
          >
            <Icon
              name='logout'
              size={15}
            />
            Log out
          </button>
        </div>
        <InlineMessage>{error}</InlineMessage>
      </section>
      <Modal
        open={resetOpen}
        onClose={() => !busy && setResetOpen(false)}
        title='Start a fresh count?'
        description='Your exercise and calorie totals will go back to zero. Your goals and exercise library stay with you.'
      >
        <InlineMessage>{error}</InlineMessage>
        <div className='dialog-actions'>
          <button
            className='btn btn-ghost'
            disabled={busy}
            onClick={() => setResetOpen(false)}
          >
            Keep my totals
          </button>
          <button
            className='btn btn-primary'
            disabled={busy}
            onClick={reset}
          >
            {busy ? 'Resetting…' : 'Reset totals'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
