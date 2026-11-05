import { useContext, useState } from 'react';
import { Link } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { deleteGoal } from '../../services/goal.service';
import { getGoalStatus } from '../../helper/goal-status';
import Icon from '../UI/Icon';
import InlineMessage from '../UI/InlineMessage';
import Progress from './Progress';
import { useTranslation } from '../../i18n/useTranslation';

export default function Goal({
  id,
  owner,
  name,
  from,
  to,
  progress = 0,
  type,
}) {
  const { userData } = useContext(AppContext);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [now] = useState(() => Date.now());
  const { t, formatDate } = useTranslation();
  const status = getGoalStatus({ progress, timePeriod: { from, to } }, now);
  const own = owner === userData.username;
  const remove = async () => {
    setBusy(true);
    try {
      await deleteGoal(owner, id);
    } catch (error) {
      setError(error.message);
      setBusy(false);
    }
  };
  return (
    <article className='goal-card surface'>
      <div className='goal-card-top'>
        <span
          className={`icon-tile ${status === 'Completed' ? 'tone-mint' : 'tone-lavender'}`}
        >
          <Icon
            name={
              status === 'Completed'
                ? 'trophy'
                : type === 'calories'
                  ? 'flame'
                  : type === 'exercises'
                    ? 'dumbbell'
                    : 'target'
            }
            size={22}
          />
        </span>
        <span
          className={`pill ${status === 'Archived' ? 'pill-neutral' : status === 'Upcoming' ? 'pill-lavender' : ''}`}
        >
          {t(`goals.status.${status}`)}
        </span>
        {(own || userData.userRole === 'admin') && (
          <button
            className='icon-button goal-delete'
            disabled={busy}
            onClick={remove}
            aria-label={t('goals.delete', { name })}
          >
            <Icon
              name='trash'
              size={15}
            />
          </button>
        )}
      </div>
      <div className='goal-card-main'>
        <div>
          <span className='goal-kind'>
            {t(
              `goals.types.${type === 'manual' || type === 'calories' ? type : 'exercises'}`
            )}
          </span>
          <h3>{name}</h3>
          <p>
            {own ? t('goals.yourJourney') : t('goals.goalBy', { name: owner })}
          </p>
        </div>
        <Progress progress={progress} />
      </div>
      <div
        className='goal-progress-track'
        aria-hidden='true'
      >
        <span
          style={{
            width: `${Math.min(100, Math.max(0, Number(progress) || 0))}%`,
          }}
        />
      </div>
      <div className='goal-card-footer'>
        <span>
          <Icon
            name='calendar'
            size={13}
          />
          {formatDate(to, { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <Link
          to={`/goals/${id}${own ? '' : `?owner=${encodeURIComponent(owner)}`}`}
        >
          {t('goals.viewProgress')}{' '}
          <Icon
            name='arrow'
            size={14}
          />
        </Link>
      </div>
      <InlineMessage>{error}</InlineMessage>
    </article>
  );
}
