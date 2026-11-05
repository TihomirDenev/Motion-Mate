import { useContext, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { useDatabaseValue } from '../../hooks/useDatabaseValue';
import { usePageTitle } from '../../hooks/usePageTitle';
import { updateGoalProgress } from '../../services/goal.service';
import { getGoalStatus } from '../../helper/goal-status';
import PageHeader from '../UI/PageHeader';
import Icon from '../UI/Icon';
import LoadingState from '../UI/LoadingState';
import EmptyState from '../UI/EmptyState';
import InlineMessage from '../UI/InlineMessage';
import FormField from '../UI/FormField';
import Progress from './Progress';
import { useTranslation } from '../../i18n/useTranslation';

export default function DetailedGoal() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const { userData } = useContext(AppContext);
  const owner = params.get('owner') || userData.username;
  const allowed =
    owner === userData.username ||
    userData.friends?.[owner] ||
    userData.userRole === 'admin';
  const {
    data: goal,
    loading,
    error: loadError,
  } = useDatabaseValue(
    allowed && /^[\w-]+$/.test(owner) ? `users/${owner}/myGoals/${id}` : null
  );
  const [editing, setEditing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [now] = useState(() => Date.now());
  const { t, formatDate, formatNumber } = useTranslation();
  usePageTitle(`Motion Mate | ${goal?.name || t('goals.progressLabel')}`);
  const own = owner === userData.username;
  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await updateGoalProgress(owner, id, Number(progress));
      setEditing(false);
      setSaved(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  };
  if (loading) return <LoadingState />;
  if (loadError) return <InlineMessage>{loadError}</InlineMessage>;
  if (!goal)
    return (
      <EmptyState
        icon='target'
        title={t('goalDetail.missingTitle')}
        description={t('goalDetail.missingDescription')}
      >
        <Link
          className='btn btn-primary'
          to='/goals'
        >
          {t('goalDetail.back')}
        </Link>
      </EmptyState>
    );
  const status = getGoalStatus(goal, now);
  return (
    <div className='goal-detail page-enter'>
      <PageHeader
        back={{ to: '/goals', label: t('overview.allGoals') }}
        eyebrow={
          own
            ? t('goalDetail.ownEyebrow')
            : t('goalDetail.friendEyebrow', { name: owner })
        }
        title={goal.name}
        description={t(
          status === 'Completed'
            ? 'goalDetail.completedDescription'
            : 'goalDetail.description'
        )}
      />
      <section className='goal-detail-hero surface'>
        <div className='goal-detail-visual'>
          <Progress progress={editing ? progress : goal.progress} />
          <span className='pill'>{t(`goals.status.${status}`)}</span>
        </div>
        <div>
          <p className='eyebrow'>
            {t(
              `goals.types.${goal.type === 'manual' || goal.type === 'calories' ? goal.type : 'exercises'}`
            )}
          </p>
          <h2>
            {t(
              status === 'Completed'
                ? 'goalDetail.completedTitle'
                : 'goalDetail.title'
            )}
          </h2>
          <p>
            {t(
              goal.type === 'manual'
                ? 'goalDetail.manualText'
                : 'goalDetail.automaticText'
            )}
          </p>
          {own && goal.type === 'manual' && !editing && (
            <button
              className='btn btn-primary'
              onClick={() => {
                setProgress(Math.min(100, Number(goal.progress) || 0));
                setEditing(true);
                setSaved(false);
              }}
            >
              <Icon
                name='edit'
                size={16}
              />
              {t('goalDetail.update')}
            </button>
          )}
        </div>
      </section>
      <InlineMessage type='success'>
        {saved ? t('goalDetail.saved') : ''}
      </InlineMessage>
      {editing && (
        <form
          className='surface surface-padding progress-editor'
          onSubmit={save}
        >
          <FormField
            label={t('goalDetail.progressField', { progress })}
            type='range'
            min={0}
            max={100}
            step={1}
            value={progress}
            onChange={(event) => setProgress(event.target.value)}
          />
          <div className='range-labels'>
            <span>{t('goalDetail.rangeStart')}</span>
            <span>{t('goalDetail.rangeMiddle')}</span>
            <span>{t('goalDetail.rangeEnd')}</span>
          </div>
          <InlineMessage>{error}</InlineMessage>
          <div className='dialog-actions'>
            <button
              className='btn btn-ghost'
              type='button'
              disabled={busy}
              onClick={() => setEditing(false)}
            >
              {t('common.cancel')}
            </button>
            <button
              className='btn btn-primary'
              type='submit'
              disabled={busy}
            >
              {t(busy ? 'common.saving' : 'goalDetail.save')}
              <Icon
                name='check'
                size={16}
              />
            </button>
          </div>
        </form>
      )}
      <div className='goal-detail-metrics'>
        <div className='surface'>
          <span className='icon-tile tone-mint'>
            <Icon name='dumbbell' />
          </span>
          <strong>
            {formatNumber(goal.exercisesDone || 0)}
            <small>
              {goal.type === 'exercises'
                ? ` / ${formatNumber(goal.exercises)}`
                : ''}
            </small>
          </strong>
          <p>{t('overview.statExercises')}</p>
        </div>
        <div className='surface'>
          <span className='icon-tile tone-peach'>
            <Icon name='flame' />
          </span>
          <strong>
            {formatNumber(goal.caloriesBurned || 0)}
            <small>
              {goal.type === 'calories'
                ? ` / ${formatNumber(goal.calories)}`
                : ''}{' '}
              {t('common.kcal')}
            </small>
          </strong>
          <p>{t('goalDetail.energy')}</p>
        </div>
      </div>
      <section className='surface surface-padding goal-timeline'>
        <div className='section-heading'>
          <h2>{t('goalDetail.timeline')}</h2>
          <Icon
            name='calendar'
            size={20}
          />
        </div>
        <div>
          <span className='timeline-point' />
          <div>
            <small>{t('goalDetail.firstStep')}</small>
            <strong>
              {formatDate(goal.timePeriod?.from, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </strong>
          </div>
          <div className='timeline-line' />
          <span className='timeline-point timeline-finish' />
          <div>
            <small>{t('goalDetail.finishLine')}</small>
            <strong>
              {formatDate(goal.timePeriod?.to, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </strong>
          </div>
        </div>
      </section>
    </div>
  );
}
