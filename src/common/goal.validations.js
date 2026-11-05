import { translate } from '../i18n/i18n';
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
    throw new Error(translate('errors.goalNameRequired'));
  }

  if (name.length < GOAL_MIN_NAME_LENGTH) {
    throw new Error(
      translate('errors.goalNameMin', { min: GOAL_MIN_NAME_LENGTH })
    );
  }

  if (name.length > GOAL_MAX_NAME_LENGTH) {
    throw new Error(
      translate('errors.goalNameMax', { max: GOAL_MAX_NAME_LENGTH })
    );
  }

  if (!owner) {
    throw new Error(translate('errors.goalOwner'));
  }

  if (!timePeriodStart) {
    throw new Error(translate('errors.goalStartRequired'));
  }

  if (!timePeriodEnd) {
    throw new Error(translate('errors.goalEndRequired'));
  }

  if (timePeriodEnd < timeNow) {
    throw new Error(translate('errors.goalEndPast'));
  }

  if (timePeriodStart > timePeriodEnd) {
    throw new Error(translate('errors.goalOrder'));
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
    throw new Error(translate('errors.goalNameRequired'));
  }

  if (name.length < GOAL_MIN_NAME_LENGTH) {
    throw new Error(
      translate('errors.goalNameMin', { min: GOAL_MIN_NAME_LENGTH })
    );
  }

  if (name.length > GOAL_MAX_NAME_LENGTH) {
    throw new Error(
      translate('errors.goalNameMax', { max: GOAL_MAX_NAME_LENGTH })
    );
  }

  if (!owner) {
    throw new Error(translate('errors.goalOwner'));
  }

  if (!timePeriodStart) {
    throw new Error(translate('errors.goalStartRequired'));
  }

  if (!timePeriodEnd) {
    throw new Error(translate('errors.goalEndRequired'));
  }

  if (timePeriodEnd < timeNow) {
    throw new Error(translate('errors.goalEndPast'));
  }

  if (timePeriodStart > timePeriodEnd) {
    throw new Error(translate('errors.goalOrder'));
  }

  if (exercises < GOAL_MIN_EXERCISES) {
    throw new Error(
      translate('errors.goalExercisesRange', {
        min: GOAL_MIN_EXERCISES,
        max: GOAL_MAX_EXERCISES,
      })
    );
  }

  if (exercises > GOAL_MAX_EXERCISES) {
    throw new Error(
      translate('errors.goalExercisesRange', {
        min: GOAL_MIN_EXERCISES,
        max: GOAL_MAX_EXERCISES,
      })
    );
  }

  if (progress < GOAL_MIN_PROGRESS) {
    throw new Error(translate('errors.progressRange'));
  }

  if (progress > GOAL_MAX_PROGRESS) {
    throw new Error(translate('errors.progressRange'));
  }

  if (calories < GOAL_MIN_CALORIES) {
    throw new Error(
      translate('errors.goalCaloriesRange', {
        min: GOAL_MIN_CALORIES,
        max: GOAL_MAX_CALORIES,
      })
    );
  }

  if (calories > GOAL_MAX_CALORIES) {
    throw new Error(
      translate('errors.goalCaloriesRange', {
        min: GOAL_MIN_CALORIES,
        max: GOAL_MAX_CALORIES,
      })
    );
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
    throw new Error(translate('errors.goalNameRequired'));
  }

  if (name.length < GOAL_MIN_NAME_LENGTH) {
    throw new Error(
      translate('errors.goalNameMin', { min: GOAL_MIN_NAME_LENGTH })
    );
  }

  if (name.length > GOAL_MAX_NAME_LENGTH) {
    throw new Error(
      translate('errors.goalNameMax', { max: GOAL_MAX_NAME_LENGTH })
    );
  }

  if (!owner) {
    throw new Error(translate('errors.goalOwner'));
  }

  if (!timePeriodStart) {
    throw new Error(translate('errors.goalStartRequired'));
  }

  if (!timePeriodEnd) {
    throw new Error(translate('errors.goalEndRequired'));
  }

  if (timePeriodEnd < timeNow) {
    throw new Error(translate('errors.goalEndPast'));
  }

  if (timePeriodStart > timePeriodEnd) {
    throw new Error(translate('errors.goalOrder'));
  }

  if (exercises < GOAL_MIN_EXERCISES) {
    throw new Error(
      translate('errors.goalExercisesRange', {
        min: GOAL_MIN_EXERCISES,
        max: GOAL_MAX_EXERCISES,
      })
    );
  }

  if (exercises > GOAL_MAX_EXERCISES) {
    throw new Error(
      translate('errors.goalExercisesRange', {
        min: GOAL_MIN_EXERCISES,
        max: GOAL_MAX_EXERCISES,
      })
    );
  }

  if (progress < GOAL_MIN_PROGRESS) {
    throw new Error(translate('errors.progressRange'));
  }

  if (progress > GOAL_MAX_PROGRESS) {
    throw new Error(translate('errors.progressRange'));
  }

  if (calories < GOAL_MIN_CALORIES) {
    throw new Error(
      translate('errors.goalCaloriesRange', {
        min: GOAL_MIN_CALORIES,
        max: GOAL_MAX_CALORIES,
      })
    );
  }

  if (calories > GOAL_MAX_CALORIES) {
    throw new Error(
      translate('errors.goalCaloriesRange', {
        min: GOAL_MIN_CALORIES,
        max: GOAL_MAX_CALORIES,
      })
    );
  }
};
