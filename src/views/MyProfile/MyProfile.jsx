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
import { useTranslation } from '../../i18n/useTranslation';

export default function MyProfile() {
  const { t, formatDate, formatNumber } = useTranslation();
  usePageTitle(`Motion Mate | ${t('nav.profile')}`);
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
  const memberSince = formatDate(userData.createdOn, {
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
        eyebrow={t('profile.eyebrow')}
        title={t('profile.title')}
        description={t('profile.description')}
      />
      <section className='profile-hero surface'>
        <div className='profile-cover'>
          <span>{t('profile.cover')}</span>
          <Icon
            name='activity'
            size={110}
          />
          <button
            className='profile-photo-button'
            aria-label={t('profile.changePhotoLabel')}
            onClick={() => setParams({ tab: 'photo' })}
          >
            <Icon
              name='camera'
              size={16}
            />
            <span>{t('profile.changePhoto')}</span>
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
              {t(
                userData.userRole === 'admin'
                  ? 'profile.admin'
                  : 'profile.member'
              )}
            </span>
            <h2>
              {[userData.firstName, userData.lastName]
                .filter(Boolean)
                .join(' ') || userData.username}
            </h2>
            <p>
              @{userData.username} <span>·</span>{' '}
              {t('profile.movingSince', { date: memberSince })}
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
            {t('profile.edit')}
          </button>
        </div>
        <div className='profile-social-stats'>
          <Link to='/my-friends'>
            <strong>{formatNumber(friends)}</strong>
            <span>{t('profile.mates')}</span>
            <Icon
              name='arrowUp'
              size={14}
            />
          </Link>
          <Link to='/goals'>
            <strong>{formatNumber(completeGoals)}</strong>
            <span>{t('profile.goals')}</span>
            <Icon
              name='arrowUp'
              size={14}
            />
          </Link>
          <Link to='/'>
            <strong>
              {formatNumber(userData.updatedScores?.doneExercises || 0)}
            </strong>
            <span>{t('overview.statExercises')}</span>
            <Icon
              name='arrowUp'
              size={14}
            />
          </Link>
        </div>
      </section>
      <div className='section-heading section-space'>
        <div>
          <h2>{t('profile.snapshotTitle')}</h2>
          <p>{t('profile.snapshotText')}</p>
        </div>
        <Link to='/wellness-health-tools'>
          {t('profile.exploreTools')}{' '}
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
            label: t('profile.weight'),
            value: userData.weight,
            unit: t('common.kg'),
            tone: 'blue',
          },
          {
            icon: 'activity',
            label: t('profile.height'),
            value: userData.height,
            unit: t('common.cm'),
            tone: 'mint',
          },
          {
            icon: 'heart',
            label: t('overview.bmi'),
            value: bmi?.value,
            unit: t('common.bmi'),
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
              {stat.value ? formatNumber(stat.value) : '—'}{' '}
              <small>{stat.unit}</small>
            </strong>
          </Link>
        ))}
      </div>
      <UserInfo userData={userData} />
      <section className='surface profile-settings'>
        <div className='section-heading'>
          <h2>{t('profile.settingsTitle')}</h2>
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
              label: t('profile.linkMates'),
              detail: t('profile.linkMatesText'),
            },
            {
              to: '/about',
              icon: 'leaf',
              label: t('profile.linkAbout'),
              detail: t('profile.linkAboutText'),
            },
            {
              to: '/contact-us',
              icon: 'info',
              label: t('nav.help'),
              detail: t('profile.linkHelpText'),
            },
            ...(userData.userRole === 'admin'
              ? [
                  {
                    to: '/admin-panel',
                    icon: 'shield',
                    label: t('nav.admin'),
                    detail: t('profile.linkAdminText'),
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
            {t('profile.resetTotals')}
          </button>
          <button
            className='text-button danger-button'
            onClick={logout}
          >
            <Icon
              name='logout'
              size={15}
            />
            {t('nav.logout')}
          </button>
        </div>
        <InlineMessage>{error}</InlineMessage>
      </section>
      <Modal
        open={resetOpen}
        onClose={() => !busy && setResetOpen(false)}
        title={t('profile.resetTitle')}
        description={t('profile.resetDescription')}
      >
        <InlineMessage>{error}</InlineMessage>
        <div className='dialog-actions'>
          <button
            className='btn btn-ghost'
            disabled={busy}
            onClick={() => setResetOpen(false)}
          >
            {t('profile.keepTotals')}
          </button>
          <button
            className='btn btn-primary'
            disabled={busy}
            onClick={reset}
          >
            {t(busy ? 'profile.resetting' : 'profile.resetConfirm')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
