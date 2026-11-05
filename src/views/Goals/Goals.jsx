import { useContext, useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { Link } from 'react-router';
import { db } from '../../config/firebase-config';
import { AppContext } from '../../context/AppContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { getGoalStatus } from '../../helper/goal-status';
import CreateGoal from '../../components/Goals/CreateGoal';
import GoalsTable from '../../components/Goals/GoalsTable';
import PageHeader from '../../components/UI/PageHeader';
import Icon from '../../components/UI/Icon';
import InlineMessage from '../../components/UI/InlineMessage';
import { useTranslation } from '../../i18n/useTranslation';

export default function Goals() {
  const { t, formatNumber } = useTranslation();
  usePageTitle(`Motion Mate | ${t('nav.goals')}`);
  const { userData } = useContext(AppContext);
  const [filter, setFilter] = useState('All');
  const [friendData, setFriendData] = useState({ key: '', goals: [] });
  const [error, setError] = useState('');
  const [now, setNow] = useState(() => Date.now());
  const friendsKey = Object.keys(userData.friends || {})
    .sort()
    .join(',');
  const goals = Object.entries(userData.myGoals || {}).map(([id, goal]) => ({
    id,
    ...goal,
  }));
  const friendsGoals = friendData.key === friendsKey ? friendData.goals : [];

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!friendsKey) return;
    const collected = new Map();
    const unsubscribe = friendsKey.split(',').map((friend) =>
      onValue(
        ref(db, `users/${friend}/myGoals`),
        (snapshot) => {
          collected.set(
            friend,
            Object.entries(snapshot.val() || {}).map(([id, goal]) => ({
              ...goal,
              id,
              owner: friend,
            }))
          );
          setFriendData({
            key: friendsKey,
            goals: [...collected.values()].flat(),
          });
        },
        (error) => setError(error.message)
      )
    );
    return () => unsubscribe.forEach((stop) => stop());
  }, [friendsKey]);

  const active = goals.filter((goal) =>
    ['In progress', 'Upcoming'].includes(getGoalStatus(goal, now))
  ).length;
  const completed = goals.filter(
    (goal) => getGoalStatus(goal, now) === 'Completed'
  ).length;
  const filtered = goals.filter(
    (goal) =>
      filter === 'All' ||
      (filter === 'Active'
        ? ['In progress', 'Upcoming'].includes(getGoalStatus(goal, now))
        : getGoalStatus(goal, now) === filter)
  );

  return (
    <div className='page-enter'>
      <PageHeader
        eyebrow={t('goals.eyebrow')}
        title={t('goals.title')}
        description={t('goals.description')}
        actions={<CreateGoal />}
      />
      <section className='goals-summary'>
        <div>
          <span className='icon-tile'>
            <Icon
              name='target'
              size={26}
            />
          </span>
          <h2>
            {t('goals.summaryLine1')}
            <br />
            {t('goals.summaryLine2')}
          </h2>
          <p>{t('goals.summaryText')}</p>
        </div>
        <div className='goals-summary-stats'>
          <div>
            <strong>{formatNumber(goals.length)}</strong>
            <span>{t('goals.statSet')}</span>
          </div>
          <div>
            <strong>{formatNumber(active)}</strong>
            <span>{t('goals.statActive')}</span>
          </div>
          <div>
            <strong>{formatNumber(completed)}</strong>
            <span>{t('goals.statCompleted')}</span>
          </div>
        </div>
        <div
          className='goal-orbits'
          aria-hidden='true'
        />
      </section>
      <div className='section-heading section-space'>
        <h2>{t('goals.yourGoals')}</h2>
        <span className='result-count'>
          {t('goals.count', { count: filtered.length })}
        </span>
      </div>
      <div
        className='filter-chips goals-filters'
        role='group'
        aria-label={t('goals.filter')}
      >
        {['All', 'Active', 'Completed', 'Archived'].map((value) => (
          <button
            key={value}
            className='filter-chip'
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {t(`goals.filters.${value}`)}
          </button>
        ))}
      </div>
      <GoalsTable
        goals={filtered}
        myGoals
        filtered={filter !== 'All'}
      />
      <section className='section-space'>
        <div className='section-heading'>
          <div>
            <h2>{t('goals.sharedTitle')}</h2>
            <p>{t('goals.sharedText')}</p>
          </div>
          <Link to='/my-friends'>
            {t('goals.yourCircle')}{' '}
            <Icon
              name='arrow'
              size={14}
            />
          </Link>
        </div>
        <InlineMessage>{error}</InlineMessage>
        <GoalsTable goals={friendsGoals} />
      </section>
    </div>
  );
}
