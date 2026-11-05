import {
  KG_TO_LBS_CONVERSION_FACTOR,
  INCHES_TO_CM_CONVERSION_FACTOR,
} from '../common/constants.js';
import { translate } from '../i18n/i18n.js';

export const activityLevels = [
  {
    value: 'Sedentary',
    water: 1,
    calories: 1.2,
  },
  {
    value: 'Lightly-Active',
    water: 1.33,
    calories: 1.375,
  },
  {
    value: 'Moderately-Active',
    water: 1.5,
    calories: 1.55,
  },
  {
    value: 'Very-Active',
    water: 1.75,
    calories: 1.725,
  },
];

export function normalizeActivity(value = '') {
  return String(value || '')
    .trim()
    .replaceAll(' ', '-');
}

export function bmiCategory(value) {
  if (value < 18.5) return 'below';
  if (value < 25) return 'healthy';
  if (value < 30) return 'above';
  return 'high';
}

export function calculateWellness(tool, form, units = 'metric') {
  const imperial = units === 'imperial';
  const weight = imperial
    ? Number(form.weight) / KG_TO_LBS_CONVERSION_FACTOR
    : Number(form.weight);
  const height = imperial
    ? Number(form.height) * INCHES_TO_CM_CONVERSION_FACTOR
    : Number(form.height);
  const age = Number(form.age);
  if (!Number.isFinite(weight) || weight < 20 || weight > 500)
    throw new Error(
      translate(imperial ? 'errors.weightLb' : 'errors.weightKg')
    );
  if (
    tool !== 'water' &&
    (!Number.isFinite(height) || height < 50 || height > 300)
  )
    throw new Error(
      translate(imperial ? 'errors.heightIn' : 'errors.heightCm')
    );
  if (tool === 'bmi') {
    const bmi = weight / (height / 100) ** 2;
    const rounded = Number(bmi.toFixed(1));
    return {
      value: rounded,
      unitKey: 'common.bmi',
      labelKey: `wellness.bmiRange.${bmiCategory(rounded)}`,
      metricValue: bmi,
    };
  }
  const activity = activityLevels.find(
    (level) => level.value === normalizeActivity(form.activityLevel)
  );
  if (!activity) throw new Error(translate('errors.activity'));
  if (tool === 'water') {
    const liters = weight * 0.033 * activity.water;
    return {
      value: imperial
        ? Number((liters * 33.8140227).toFixed(1))
        : Number(liters.toFixed(2)),
      unitKey: imperial ? 'wellness.ouncesPerDay' : 'wellness.litersPerDay',
      labelKey: 'wellness.waterLabel',
      metricValue: liters,
    };
  }
  if (!Number.isFinite(age) || age < 18 || age > 100)
    throw new Error(translate('errors.age'));
  if (!['Male', 'Female'].includes(form.gender))
    throw new Error(translate('errors.sex'));
  const bmr =
    form.gender === 'Male'
      ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
      : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  const calories = Math.round(bmr * activity.calories);
  return {
    value: calories,
    unitKey: 'wellness.kcalPerDay',
    labelKey: 'wellness.caloriesLabel',
    metricValue: calories,
  };
}

export function profileWellness(tool, profile) {
  try {
    return calculateWellness(tool, profile);
  } catch {
    return null;
  }
}
