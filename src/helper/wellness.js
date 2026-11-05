import {
  KG_TO_LBS_CONVERSION_FACTOR,
  INCHES_TO_CM_CONVERSION_FACTOR,
} from '../common/constants.js';

export const activityLevels = [
  {
    value: 'Sedentary',
    label: 'Mostly sitting',
    description: 'Desk-based days, with little planned exercise.',
    water: 1,
    calories: 1.2,
  },
  {
    value: 'Lightly-Active',
    label: 'Lightly active',
    description: 'Light exercise or a good walk 1–3 days a week.',
    water: 1.33,
    calories: 1.375,
  },
  {
    value: 'Moderately-Active',
    label: 'Moderately active',
    description: 'Regular exercise 3–5 days a week.',
    water: 1.5,
    calories: 1.55,
  },
  {
    value: 'Very-Active',
    label: 'Very active',
    description: 'Intense exercise 6–7 days a week or a physical job.',
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
  if (value < 18.5) return 'Below reference range';
  if (value < 25) return 'In the reference range';
  if (value < 30) return 'Above reference range';
  return 'High BMI range';
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
      imperial
        ? 'Enter a weight between 44.1 and 1102.3 lb.'
        : 'Enter a weight between 20 and 500 kg.'
    );
  if (
    tool !== 'water' &&
    (!Number.isFinite(height) || height < 50 || height > 300)
  )
    throw new Error(
      imperial
        ? 'Enter a height between 19.7 and 118.1 in.'
        : 'Enter a height between 50 and 300 cm.'
    );
  if (tool === 'bmi') {
    const bmi = weight / (height / 100) ** 2;
    return {
      value: Number(bmi.toFixed(1)),
      unit: 'BMI',
      label: bmiCategory(bmi),
      metricValue: bmi,
    };
  }
  const activity = activityLevels.find(
    (level) => level.value === normalizeActivity(form.activityLevel)
  );
  if (!activity)
    throw new Error('Choose the activity level that best fits your week.');
  if (tool === 'water') {
    const liters = weight * 0.033 * activity.water;
    return {
      value: imperial
        ? Number((liters * 33.8140227).toFixed(1))
        : Number(liters.toFixed(2)),
      unit: imperial ? 'US fl oz / day' : 'liters / day',
      label: 'Your daily hydration estimate',
      metricValue: liters,
    };
  }
  if (!Number.isFinite(age) || age < 10 || age > 100)
    throw new Error('Enter an age between 10 and 100.');
  if (!['Male', 'Female'].includes(form.gender))
    throw new Error('Choose a sex for the calorie formula.');
  const bmr =
    form.gender === 'Male'
      ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
      : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  const calories = Math.round(bmr * activity.calories);
  return {
    value: calories,
    unit: 'kcal / day',
    label: 'Estimated maintenance energy',
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
