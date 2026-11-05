import { translate } from '../i18n/i18n';
import {
  EXERCISE_MAX_CONTENT_LENGTH,
  EXERCISE_MAX_TITLE_LENGTH,
  EXERCISE_MIN_CONTENT_LENGTH,
  EXERCISE_MIN_TITLE_LENGTH,
} from './constants';

export const validateExerciseForm = (
  title,
  content,
  hours,
  minutes,
  seconds,
  calories,
  level,
  category
) => {
  if (!title) {
    throw new Error(translate('errors.exerciseTitleRequired'));
  }
  if (title.length < EXERCISE_MIN_TITLE_LENGTH) {
    throw new Error(
      translate('errors.exerciseTitleLength', {
        min: EXERCISE_MIN_TITLE_LENGTH,
        max: EXERCISE_MAX_TITLE_LENGTH,
      })
    );
  }
  if (title.length > EXERCISE_MAX_TITLE_LENGTH) {
    throw new Error(
      translate('errors.exerciseTitleLength', {
        min: EXERCISE_MIN_TITLE_LENGTH,
        max: EXERCISE_MAX_TITLE_LENGTH,
      })
    );
  }
  if (content.length < EXERCISE_MIN_CONTENT_LENGTH) {
    throw new Error(
      translate('errors.exerciseContentLength', {
        min: EXERCISE_MIN_CONTENT_LENGTH,
        max: EXERCISE_MAX_CONTENT_LENGTH,
      })
    );
  }
  if (content.length > EXERCISE_MAX_CONTENT_LENGTH) {
    throw new Error(
      translate('errors.exerciseContentLength', {
        min: EXERCISE_MIN_CONTENT_LENGTH,
        max: EXERCISE_MAX_CONTENT_LENGTH,
      })
    );
  }
  if (
    ![hours, minutes, seconds, calories].every((value) =>
      Number.isFinite(Number(value))
    )
  )
    throw new Error(translate('errors.exerciseNumbers'));
  if (hours > 23 || minutes > 59 || seconds > 59)
    throw new Error(translate('errors.exerciseDurationMax'));
  if (hours < 0 || minutes < 0 || seconds < 0) {
    throw new Error(translate('errors.exerciseDurationNegative'));
  }
  if (Number(hours) + Number(minutes) + Number(seconds) === 0) {
    throw new Error(translate('errors.exerciseDurationMissing'));
  }
  if (Number(calories) <= 0 || Number(calories) > 10000) {
    throw new Error(translate('errors.exerciseCalories'));
  }
  if (!level) {
    throw new Error(translate('errors.exerciseLevel'));
  }
  if (!category) {
    throw new Error(translate('errors.exerciseCategory'));
  }
};
