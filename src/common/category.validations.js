import { translate } from '../i18n/i18n';
import {
  CATEGORY_MAX_DESCRIPTION_LENGTH,
  CATEGORY_MAX_TITLE_LENGTH,
  CATEGORY_MIN_DESCRIPTION_LENGTH,
  CATEGORY_MIN_TITLE_LENGTH,
} from './constants';

export const validateCategoryForm = (name, description, url) => {
  if (
    name.length < CATEGORY_MIN_TITLE_LENGTH ||
    name.length > CATEGORY_MAX_TITLE_LENGTH
  ) {
    throw new Error(
      translate('errors.categoryNameLength', {
        min: CATEGORY_MIN_TITLE_LENGTH,
        max: CATEGORY_MAX_TITLE_LENGTH,
      })
    );
  }
  if (
    description.length < CATEGORY_MIN_DESCRIPTION_LENGTH ||
    description.length > CATEGORY_MAX_DESCRIPTION_LENGTH
  ) {
    throw new Error(
      translate('errors.categoryDescriptionLength', {
        min: CATEGORY_MIN_DESCRIPTION_LENGTH,
        max: CATEGORY_MAX_DESCRIPTION_LENGTH,
      })
    );
  }
  if (!url) {
    throw new Error(translate('errors.photoRequired'));
  }
};
