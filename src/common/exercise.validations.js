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
    throw new Error('title is required');
  }
  if (title.length < EXERCISE_MIN_TITLE_LENGTH) {
    throw new Error('title is too short');
  }
  if (title.length > EXERCISE_MAX_TITLE_LENGTH) {
    throw new Error('title is too long');
  }
  if (content.length < EXERCISE_MIN_CONTENT_LENGTH) {
    throw new Error('content is too short');
  }
  if (content.length > EXERCISE_MAX_CONTENT_LENGTH) {
    throw new Error('content is too long');
  }
  if (
    ![hours, minutes, seconds, calories].every((value) =>
      Number.isFinite(Number(value))
    )
  )
    throw new Error('Enter valid numbers for duration and calories.');
  if (hours > 23 || minutes > 59 || seconds > 59)
    throw new Error('Use up to 23 hours, 59 minutes, and 59 seconds.');
  if (hours < 0 || minutes < 0 || seconds < 0) {
    throw new Error('duration cannot be negative!');
  }
  if (Number(hours) + Number(minutes) + Number(seconds) === 0) {
    throw new Error('missing time duration for exercise');
  }
  if (Number(calories) <= 0 || Number(calories) > 10000) {
    throw new Error('please add calories');
  }
  if (!level) {
    throw new Error('please select a level');
  }
  if (!category) {
    throw new Error('please select a category');
  }
};
