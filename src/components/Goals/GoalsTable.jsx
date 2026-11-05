import { Link } from 'react-router';
import Goal from './Goal';
import EmptyState from '../UI/EmptyState';
import Icon from '../UI/Icon';
import { useTranslation } from '../../i18n/useTranslation';

export default function GoalsTable({
  goals,
  myGoals = false,
  filtered = false,
}) {
  const { t } = useTranslation();
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
        title={t(
          filtered
            ? 'goals.filteredEmptyTitle'
            : myGoals
              ? 'goals.emptyTitle'
              : 'goals.friendsEmptyTitle'
        )}
        description={t(
          filtered
            ? 'goals.filteredEmptyDescription'
            : myGoals
              ? 'goals.emptyDescription'
              : 'goals.friendsEmptyDescription'
        )}
      >
        {!myGoals && (
          <Link
            className='text-button'
            to='/all-users'
          >
            {t('overview.communityTitle')}{' '}
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
