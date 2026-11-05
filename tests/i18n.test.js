import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import en from '../src/i18n/en.js';
import bg from '../src/i18n/bg.js';
import { translate, translateEntry } from '../src/i18n/i18n.js';

const flatten = (node, prefix = '') =>
  Object.entries(node).flatMap(([key, value]) =>
    value && typeof value === 'object'
      ? flatten(value, `${prefix}${key}.`)
      : [[`${prefix}${key}`, value]]
  );

const sourceFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(file);
    return /\.(js|jsx)$/.test(entry.name) && !file.includes('/i18n/')
      ? [file]
      : [];
  });

test('Bulgarian and English dictionaries contain the same keys', () => {
  const englishKeys = flatten(en)
    .map(([key]) => key)
    .sort();
  const bulgarianKeys = flatten(bg)
    .map(([key]) => key)
    .sort();
  assert.deepEqual(bulgarianKeys, englishKeys);
});

test('every translation uses the same placeholders in both languages', () => {
  const bulgarian = new Map(flatten(bg));
  for (const [key, value] of flatten(en)) {
    if (typeof value !== 'string') continue;
    const placeholders = (text) =>
      [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    assert.deepEqual(
      placeholders(bulgarian.get(key)),
      placeholders(value),
      key
    );
  }
});

test('every static translation key used in the app exists', () => {
  const known = new Set(flatten(en).map(([key]) => key));
  const missing = [];
  for (const file of sourceFiles('src')) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/\b(?:t|translate)\(\s*'([\w.]+)'/g))
      if (!known.has(match[1])) missing.push(`${file}: ${match[1]}`);
    for (const match of source.matchAll(
      /\bt\(\s*\n?\s*[^'`)]*\?\s*'([\w.]+)'\s*:\s*'([\w.]+)'/g
    ))
      for (const key of match.slice(1))
        if (!known.has(key)) missing.push(`${file}: ${key}`);
  }
  assert.deepEqual(missing, []);
});

test('translations interpolate values and pluralize counts', () => {
  assert.equal(translate('goals.count', { count: 1 }, 'bg'), '1 цел');
  assert.equal(translate('goals.count', { count: 3 }, 'bg'), '3 цели');
  assert.equal(translate('goals.count', { count: 3 }, 'en'), '3 goals');
  assert.equal(
    translate('profile.movingSince', { date: 'юни 2024' }, 'bg'),
    'В движение от юни 2024'
  );
  assert.equal(translate('missing.key', {}, 'bg'), 'missing.key');
});

test('stored database values fall back to their original text', () => {
  assert.equal(translateEntry('categoryNames', 'Yoga', 'bg'), 'Йога');
  assert.equal(translateEntry('categoryNames', 'Pilates', 'bg'), 'Pilates');
  assert.equal(translateEntry('levels', 'Hard', 'bg'), 'Трудно');
});
