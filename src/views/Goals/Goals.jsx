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

export default function Goals() {
  usePageTitle('Motion Mate | My goals');
  const { userData } = useContext(AppContext);
  const [filter, setFilter] = useState('All goals');
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
      filter === 'All goals' ||
      (filter === 'Active'
        ? ['In progress', 'Upcoming'].includes(getGoalStatus(goal, now))
        : getGoalStatus(goal, now) === filter)
  );

  return (
    <div className='page-enter'>
      <PageHeader
        eyebrow='SMALL STEPS. REAL PROGRESS.'
        title='Make room for your goals.'
        description='Turn your intentions into something you can see, feel, and celebrate.'
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
            Progress is a practice.
            <br />
            You’re already showing up.
          </h2>
          <p>Keep your eyes on your own finish line.</p>
        </div>
        <div className='goals-summary-stats'>
          <div>
            <strong>{goals.length}</strong>
            <span>Goals set</span>
          </div>
          <div>
            <strong>{active}</strong>
            <span>In motion</span>
          </div>
          <div>
            <strong>{completed}</strong>
            <span>Celebrated</span>
          </div>
        </div>
        <div
          className='goal-orbits'
          aria-hidden='true'
        />
      </section>
      <div className='section-heading section-space'>
        <h2>Your goals</h2>
        <span className='result-count'>
          {filtered.length} {filtered.length === 1 ? 'goal' : 'goals'}
        </span>
      </div>
      <div
        className='filter-chips goals-filters'
        role='group'
        aria-label='Filter goals'
      >
        {['All goals', 'Active', 'Completed', 'Archived'].map((value) => (
          <button
            key={value}
            className='filter-chip'
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <GoalsTable
        goals={filtered}
        myGoals
        filtered={filter !== 'All goals'}
      />
      <section className='section-space'>
        <div className='section-heading'>
          <div>
            <h2>A little shared inspiration</h2>
            <p>See what your Motion Mates are working towards.</p>
          </div>
          <Link to='/my-friends'>
            Your circle{' '}
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
