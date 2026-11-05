import Icon from '../UI/Icon';
import { activityLevels, normalizeActivity } from '../../helper/wellness';

export default function UserInfo({ userData }) {
  const fullName = [userData?.firstName, userData?.lastName]
    .filter(Boolean)
    .join(' ');
  const activity = activityLevels.find(
    (level) => level.value === normalizeActivity(userData?.activityLevel)
  );
  const details = [
    { label: 'Full name', value: fullName },
    { label: 'Email address', value: userData?.email },
    { label: 'Phone number', value: userData?.phoneNumber },
  ];
  return (
    <div className='profile-details-grid'>
      <section className='surface profile-detail-card'>
        <div className='section-heading'>
          <h2>The everyday details</h2>
          <span className='icon-tile tone-mint'>
            <Icon
              name='user'
              size={18}
            />
          </span>
        </div>
        <dl>
          {details.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>
                {detail.value || (
                  <span className='not-added'>Not added yet</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section className='surface profile-detail-card'>
        <div className='section-heading'>
          <h2>Your kind of movement</h2>
          <span className='icon-tile tone-lavender'>
            <Icon
              name='activity'
              size={18}
            />
          </span>
        </div>
        <div className='activity-profile'>
          <span>{activity?.label || 'Find your rhythm'}</span>
          <p>
            {activity?.description ||
              'Add your activity level to personalize your wellness insights.'}
          </p>
        </div>
        <dl className='profile-small-details'>
          <div>
            <dt>Age</dt>
            <dd>{userData?.age ? `${userData.age} years` : 'Not added'}</dd>
          </div>
          <div>
            <dt>Sex for calculations</dt>
            <dd>{userData?.gender || 'Not added'}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
