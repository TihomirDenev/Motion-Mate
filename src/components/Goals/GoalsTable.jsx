import { Link } from 'react-router';
import Goal from './Goal';
import EmptyState from '../UI/EmptyState';
import Icon from '../UI/Icon';

export default function GoalsTable({
  goals,
  myGoals = false,
  filtered = false,
}) {
  return goals?.length ? (
    <div className='goals-grid'>
      {goals.map((goal) => (
        <Goal
          key={`${goal.owner}-${goal.id}`}
          {...goal}
          from={goal.timePeriod?.from}
          to={goal.timePeriod?.to}
        />
      ))}
    </div>
  ) : (
    <div className='surface'>
      <EmptyState
        icon={myGoals ? 'target' : 'users'}
        title={
          filtered
            ? 'A fresh space for progress'
            : myGoals
              ? 'Every great journey starts with a goal'
              : 'Grow together'
        }
        description={
          filtered
            ? 'Your goals will appear here as you move through your journey.'
            : myGoals
              ? 'Choose something that matters to you and create your first goal with the button above.'
              : 'Connect with Motion Mates to share a little motivation and see their goals.'
        }
      >
        {!myGoals && (
          <Link
            className='text-button'
            to='/all-users'
          >
            Find your people{' '}
            <Icon
              name='arrow'
              size={16}
            />
          </Link>
        )}
      </EmptyState>
    </div>
  );
}
