import { useContext, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { useDatabaseValue } from '../../hooks/useDatabaseValue';
import { usePageTitle } from '../../hooks/usePageTitle';
import { updateGoalProgress } from '../../services/goal.service';
import { shortFormatDate } from '../../helper/format-date';
import { getGoalStatus } from '../../helper/goal-status';
import PageHeader from '../UI/PageHeader';
import Icon from '../UI/Icon';
import LoadingState from '../UI/LoadingState';
import EmptyState from '../UI/EmptyState';
import InlineMessage from '../UI/InlineMessage';
import FormField from '../UI/FormField';
import Progress from './Progress';

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
  usePageTitle(`Motion Mate | ${goal?.name || 'Goal progress'}`);
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
        title='This goal isn’t here'
        description='It may have been removed, or it belongs to someone outside your circle.'
      >
        <Link
          className='btn btn-primary'
          to='/goals'
        >
          Back to goals
        </Link>
      </EmptyState>
    );
  const status = getGoalStatus(goal, now);
  return (
    <div className='goal-detail page-enter'>
      <PageHeader
        back={{ to: '/goals', label: 'All goals' }}
        eyebrow={own ? 'YOUR PERSONAL JOURNEY' : `${owner}’S JOURNEY`}
        title={goal.name}
        description={
          status === 'Completed'
            ? 'You showed up. You made it happen. Take a moment to celebrate.'
            : 'Every small step brings you a little closer.'
        }
      />
      <section className='goal-detail-hero surface'>
        <div className='goal-detail-visual'>
          <Progress progress={editing ? progress : goal.progress} />
          <span className='pill'>{status}</span>
        </div>
        <div>
          <p className='eyebrow'>
            {goal.type === 'manual'
              ? 'PERSONAL MILESTONE'
              : goal.type === 'exercises'
                ? 'MOVEMENT GOAL'
                : 'ENERGY GOAL'}
          </p>
          <h2>
            {status === 'Completed'
              ? 'That’s a win worth celebrating.'
              : 'Keep moving. It all adds up.'}
          </h2>
          <p>
            {goal.type === 'manual'
              ? 'Track your progress at your own pace. Every step forward counts.'
              : 'Every completed exercise within your goal dates moves your progress forward automatically.'}
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
              Update progress
            </button>
          )}
        </div>
      </section>
      <InlineMessage type='success'>
        {saved ? 'Your progress is saved. Keep that momentum going.' : ''}
      </InlineMessage>
      {editing && (
        <form
          className='surface surface-padding progress-editor'
          onSubmit={save}
        >
          <FormField
            label={`Your progress · ${progress}%`}
            type='range'
            min={0}
            max={100}
            step={1}
            value={progress}
            onChange={(event) => setProgress(event.target.value)}
          />
          <div className='range-labels'>
            <span>Just starting</span>
            <span>Halfway there</span>
            <span>Made it!</span>
          </div>
          <InlineMessage>{error}</InlineMessage>
          <div className='dialog-actions'>
            <button
              className='btn btn-ghost'
              type='button'
              disabled={busy}
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
            <button
              className='btn btn-primary'
              type='submit'
              disabled={busy}
            >
              {busy ? 'Saving…' : 'Save progress'}
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
            {goal.exercisesDone || 0}
            <small>
              {goal.type === 'exercises' ? ` / ${goal.exercises}` : ''}
            </small>
          </strong>
          <p>Exercises completed</p>
        </div>
        <div className='surface'>
          <span className='icon-tile tone-peach'>
            <Icon name='flame' />
          </span>
          <strong>
            {goal.caloriesBurned || 0}
            <small>
              {goal.type === 'calories' ? ` / ${goal.calories}` : ''} kcal
            </small>
          </strong>
          <p>Energy put into you</p>
        </div>
      </div>
      <section className='surface surface-padding goal-timeline'>
        <div className='section-heading'>
          <h2>Your timeline</h2>
          <Icon
            name='calendar'
            size={20}
          />
        </div>
        <div>
          <span className='timeline-point' />
          <div>
            <small>THE FIRST STEP</small>
            <strong>{shortFormatDate(goal.timePeriod?.from)}</strong>
          </div>
          <div className='timeline-line' />
          <span className='timeline-point timeline-finish' />
          <div>
            <small>YOUR FINISH LINE</small>
            <strong>{shortFormatDate(goal.timePeriod?.to)}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
