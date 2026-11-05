import {
  GOAL_MAX_CALORIES,
  GOAL_MAX_EXERCISES,
  GOAL_MAX_NAME_LENGTH,
  GOAL_MAX_PROGRESS,
  GOAL_MIN_CALORIES,
  GOAL_MIN_EXERCISES,
  GOAL_MIN_NAME_LENGTH,
  GOAL_MIN_PROGRESS,
} from './constants';

export const validateGoalForm = (
  name,
  owner,
  timePeriodStart,
  timePeriodEnd
) => {
  const timeNow = new Date().getTime();

  if (!name) {
    throw new Error('Name is required');
  }

  if (name.length < GOAL_MIN_NAME_LENGTH) {
    throw new Error(`Name must be at least ${GOAL_MIN_NAME_LENGTH} characters`);
  }

  if (name.length > GOAL_MAX_NAME_LENGTH) {
    throw new Error(`Name must be at most ${GOAL_MAX_NAME_LENGTH} characters`);
  }

  if (!owner) {
    throw new Error('Owner is required');
  }

  if (!timePeriodStart) {
    throw new Error('Start date is required');
  }

  if (!timePeriodEnd) {
    throw new Error('End date is required');
  }

  if (timePeriodEnd < timeNow) {
    throw new Error('End date must be today or after');
  }

  if (timePeriodStart > timePeriodEnd) {
    throw new Error('Start date must be before end date');
  }
};

export const goalCreateValidation = (
  name,
  owner,
  timePeriodStart,
  timePeriodEnd,
  exercises,
  progress,
  calories
) => {
  const timeNow = new Date().getTime();

  if (!name) {
    throw new Error('Name is required');
  }

  if (name.length < GOAL_MIN_NAME_LENGTH) {
    throw new Error(`Name must be at least ${GOAL_MIN_NAME_LENGTH} characters`);
  }

  if (name.length > GOAL_MAX_NAME_LENGTH) {
    throw new Error(`Name must be at most ${GOAL_MAX_NAME_LENGTH} characters`);
  }

  if (!owner) {
    throw new Error('Owner is required');
  }

  if (!timePeriodStart) {
    throw new Error('Start date is required');
  }

  if (!timePeriodEnd) {
    throw new Error('End date is required');
  }

  if (timePeriodEnd < timeNow) {
    throw new Error('End date must be today or after');
  }

  if (timePeriodStart > timePeriodEnd) {
    throw new Error('Start date must be before end date');
  }

  if (exercises < GOAL_MIN_EXERCISES) {
    throw new Error(`Exercises must be at least ${GOAL_MIN_EXERCISES}`);
  }

  if (exercises > GOAL_MAX_EXERCISES) {
    throw new Error(`Exercises must be at most ${GOAL_MAX_EXERCISES}`);
  }

  if (progress < GOAL_MIN_PROGRESS) {
    throw new Error(`Progress must be at least ${GOAL_MIN_PROGRESS}`);
  }

  if (progress > GOAL_MAX_PROGRESS) {
    throw new Error(`Progress must be at most ${GOAL_MAX_PROGRESS}`);
  }

  if (calories < GOAL_MIN_CALORIES) {
    throw new Error(`Calories must be at least ${GOAL_MIN_CALORIES}`);
  }

  if (calories > GOAL_MAX_CALORIES) {
    throw new Error(`Calories must be at most ${GOAL_MAX_CALORIES}`);
  }
};

export const goalUpdateValidation = (
  name,
  owner,
  timePeriodStart,
  timePeriodEnd,
  exercises,
  progress,
  calories
) => {
  const timeNow = new Date().getTime();

  if (!name) {
    throw new Error('Name is required');
  }

  if (name.length < GOAL_MIN_NAME_LENGTH) {
    throw new Error(`Name must be at least ${GOAL_MIN_NAME_LENGTH} characters`);
  }

  if (name.length > GOAL_MAX_NAME_LENGTH) {
    throw new Error(`Name must be at most ${GOAL_MAX_NAME_LENGTH} characters`);
  }

  if (!owner) {
    throw new Error('Owner is required');
  }

  if (!timePeriodStart) {
    throw new Error('Start date is required');
  }

  if (!timePeriodEnd) {
    throw new Error('End date is required');
  }

  if (timePeriodEnd < timeNow) {
    throw new Error('End date must be today or after');
  }

  if (timePeriodStart > timePeriodEnd) {
    throw new Error('Start date must be before end date');
  }

  if (exercises < GOAL_MIN_EXERCISES) {
    throw new Error(`Exercises must be at least ${GOAL_MIN_EXERCISES}`);
  }

  if (exercises > GOAL_MAX_EXERCISES) {
    throw new Error(`Exercises must be at most ${GOAL_MAX_EXERCISES}`);
  }

  if (progress < GOAL_MIN_PROGRESS) {
    throw new Error(`Progress must be at least ${GOAL_MIN_PROGRESS}`);
  }

  if (progress > GOAL_MAX_PROGRESS) {
    throw new Error(`Progress must be at most ${GOAL_MAX_PROGRESS}`);
  }

  if (calories < GOAL_MIN_CALORIES) {
    throw new Error(`Calories must be at least ${GOAL_MIN_CALORIES}`);
  }

  if (calories > GOAL_MAX_CALORIES) {
    throw new Error(`Calories must be at most ${GOAL_MAX_CALORIES}`);
  }
};
