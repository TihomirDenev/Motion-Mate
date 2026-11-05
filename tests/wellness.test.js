import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateWellness, profileWellness } from '../src/helper/wellness.js';
import { getGoalStatus, localDateValue } from '../src/helper/goal-status.js';

test('BMI keeps full height precision until the final result', () => {
  const result = calculateWellness('bmi', { weight: 70, height: 175 });
  assert.equal(result.value, 22.9);
  assert.equal(result.labelKey, 'wellness.bmiRange.healthy');
  const imperial = calculateWellness(
    'bmi',
    { weight: 154.322, height: 68.8976378 },
    'imperial'
  );
  assert.equal(imperial.value, result.value);
});

test('imperial hydration converts liters into US fluid ounces', () => {
  const metric = calculateWellness('water', {
    weight: 70,
    activityLevel: 'Sedentary',
  });
  const imperial = calculateWellness(
    'water',
    { weight: 154.322, activityLevel: 'Sedentary' },
    'imperial'
  );
  assert.equal(metric.value, 2.31);
  assert.equal(metric.unitKey, 'wellness.litersPerDay');
  assert.equal(imperial.value, 78.1);
  assert.equal(imperial.unitKey, 'wellness.ouncesPerDay');
});

test('legacy profile activity labels produce the same personalized estimate', () => {
  assert.equal(
    calculateWellness('water', {
      weight: 80,
      activityLevel: 'Moderately Active',
    }).value,
    3.96
  );
  assert.equal(
    calculateWellness('water', {
      weight: 80,
      activityLevel: 'Moderately-Active',
    }).value,
    3.96
  );
});

test('maintenance calories use the energy activity factors, including sedentary days', () => {
  const form = {
    weight: 80,
    height: 180,
    age: 30,
    gender: 'Male',
    activityLevel: 'Moderately-Active',
  };
  assert.equal(calculateWellness('calories', form).value, 2873);
  assert.equal(
    calculateWellness('calories', { ...form, activityLevel: 'Sedentary' })
      .value,
    2224
  );
  assert.equal(
    calculateWellness('calories', { ...form, gender: 'Female' }).value,
    2503
  );
});

test('incomplete and non-finite measurements never produce a displayed result', () => {
  assert.equal(profileWellness('bmi', {}), null);
  assert.equal(profileWellness('calories', { weight: 80, height: 180 }), null);
  assert.throws(
    () => calculateWellness('bmi', { weight: 70, height: 0 }),
    /height/
  );
  assert.throws(
    () =>
      calculateWellness('water', {
        weight: Infinity,
        activityLevel: 'Sedentary',
      }),
    /weight/
  );
  assert.throws(
    () =>
      calculateWellness('water', { weight: 'abc', activityLevel: 'Sedentary' }),
    /weight/
  );
  assert.throws(
    () =>
      calculateWellness('calories', {
        weight: 80,
        height: 180,
        age: 30,
        gender: '',
        activityLevel: 'Sedentary',
      }),
    /sex/
  );
});

test('goal status distinguishes upcoming, active, archived, and completed goals', () => {
  const now = new Date('2026-11-05T12:00:00Z').getTime();
  const period = { from: now - 1000, to: now + 1000 };
  assert.equal(
    getGoalStatus({ progress: 10, timePeriod: period }, now),
    'In progress'
  );
  assert.equal(
    getGoalStatus(
      { progress: 0, timePeriod: { from: now + 1000, to: now + 2000 } },
      now
    ),
    'Upcoming'
  );
  assert.equal(
    getGoalStatus(
      { progress: 50, timePeriod: { from: now - 2000, to: now - 1000 } },
      now
    ),
    'Archived'
  );
  assert.equal(
    getGoalStatus(
      { progress: 100, timePeriod: { from: now - 2000, to: now - 1000 } },
      now
    ),
    'Completed'
  );
  assert.equal(localDateValue(new Date(2026, 0, 9, 23)), '2026-01-09');
});
