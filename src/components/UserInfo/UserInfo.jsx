import Icon from '../UI/Icon';
import { activityLevels, normalizeActivity } from '../../helper/wellness';
import { useTranslation } from '../../i18n/useTranslation';

export default function UserInfo({ userData }) {
  const { t, te } = useTranslation();
  const fullName = [userData?.firstName, userData?.lastName]
    .filter(Boolean)
    .join(' ');
  const activity = activityLevels.find(
    (level) => level.value === normalizeActivity(userData?.activityLevel)
  );
  const details = [
    { label: t('fields.fullName'), value: fullName },
    { label: t('fields.email'), value: userData?.email },
    { label: t('fields.phone'), value: userData?.phoneNumber },
  ];
  return (
    <div className='profile-details-grid'>
      <section className='surface profile-detail-card'>
        <div className='section-heading'>
          <h2>{t('userInfo.detailsTitle')}</h2>
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
                  <span className='not-added'>{t('userInfo.notAddedYet')}</span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>
      <section className='surface profile-detail-card'>
        <div className='section-heading'>
          <h2>{t('userInfo.movementTitle')}</h2>
          <span className='icon-tile tone-lavender'>
            <Icon
              name='activity'
              size={18}
            />
          </span>
        </div>
        <div className='activity-profile'>
          <span>
            {activity
              ? t(`activity.${activity.value}.label`)
              : t('userInfo.findRhythm')}
          </span>
          <p>
            {activity
              ? t(`activity.${activity.value}.description`)
              : t('userInfo.addActivity')}
          </p>
        </div>
        <dl className='profile-small-details'>
          <div>
            <dt>{t('userInfo.age')}</dt>
            <dd>
              {userData?.age
                ? t('userInfo.years', { count: Number(userData.age) })
                : t('userInfo.notAdded')}
            </dd>
          </div>
          <div>
            <dt>{t('fields.sex')}</dt>
            <dd>
              {userData?.gender
                ? te('gender', userData.gender)
                : t('userInfo.notAdded')}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
