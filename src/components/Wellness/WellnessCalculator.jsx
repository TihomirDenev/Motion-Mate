import { useContext, useRef, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  activityLevels,
  calculateWellness,
  normalizeActivity,
  profileWellness,
} from '../../helper/wellness';
import {
  INCHES_TO_CM_CONVERSION_FACTOR,
  KG_TO_LBS_CONVERSION_FACTOR,
} from '../../common/constants';
import FormField from '../UI/FormField';
import Icon from '../UI/Icon';
import InlineMessage from '../UI/InlineMessage';
import { useTranslation } from '../../i18n/useTranslation';

const visuals = {
  water: { icon: 'drop', tone: 'blue' },
  bmi: { icon: 'scale', tone: 'lavender' },
  calories: { icon: 'flame', tone: 'peach' },
};

export default function WellnessCalculator({ tool }) {
  const { userData } = useContext(AppContext);
  const { t, formatNumber } = useTranslation();
  const getProfileForm = () => ({
    weight: userData.weight || '',
    height: userData.height || '',
    age: userData.age || '',
    gender: userData.gender || '',
    activityLevel: normalizeActivity(userData.activityLevel || 'Sedentary'),
  });
  const [form, setForm] = useState(getProfileForm);
  const [units, setUnits] = useState('metric');
  const [result, setResult] = useState(() =>
    profileWellness(tool, getProfileForm())
  );
  const [error, setError] = useState('');
  const resultRef = useRef(null);
  const copy = visuals[tool];
  const text = (key) => t(`wellness.${tool}.${key}`);
  const change = (key) => (event) => {
    setForm((value) => ({ ...value, [key]: event.target.value }));
    setResult(null);
    setError('');
  };
  const switchUnits = (next) => {
    if (units === next) return;
    const imperial = next === 'imperial';
    setForm((form) => ({
      ...form,
      weight: form.weight
        ? Number(
            (
              Number(form.weight) *
              (imperial
                ? KG_TO_LBS_CONVERSION_FACTOR
                : 1 / KG_TO_LBS_CONVERSION_FACTOR)
            ).toFixed(2)
          )
        : '',
      height: form.height
        ? Number(
            (
              Number(form.height) *
              (imperial
                ? 1 / INCHES_TO_CM_CONVERSION_FACTOR
                : INCHES_TO_CM_CONVERSION_FACTOR)
            ).toFixed(2)
          )
        : '',
    }));
    setUnits(next);
    setResult(null);
    setError('');
  };
  const calculate = (event) => {
    event.preventDefault();
    setError('');
    try {
      setResult(calculateWellness(tool, form, units));
      if (window.innerWidth < 768)
        requestAnimationFrame(() =>
          resultRef.current?.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)')
              .matches
              ? 'instant'
              : 'smooth',
            block: 'start',
          })
        );
    } catch (error) {
      setError(error.message);
      setResult(null);
    }
  };
  return (
    <section className='calculator-layout surface'>
      <div className='calculator-form'>
        <div className='calculator-heading'>
          <span className={`icon-tile tone-${copy.tone}`}>
            <Icon
              name={copy.icon}
              size={24}
            />
          </span>
          <div>
            <h2>{text('title')}</h2>
            <p>{text('description')}</p>
          </div>
        </div>
        <div className='calculator-unit-row'>
          <span>{t('wellness.measurements')}</span>
          <div
            className='segmented-control'
            role='group'
            aria-label={t('wellness.system')}
          >
            {['metric', 'imperial'].map((value) => (
              <button
                key={value}
                type='button'
                aria-pressed={units === value}
                onClick={() => switchUnits(value)}
              >
                {t(`wellness.${value}`)}
              </button>
            ))}
          </div>
        </div>
        <form
          className='form-stack'
          onSubmit={calculate}
        >
          <div className='form-grid'>
            <FormField
              label={t(
                units === 'metric' ? 'fields.weightKg' : 'fields.weightLb'
              )}
              type='number'
              inputMode='decimal'
              required
              step='any'
              placeholder={units === 'metric' ? '70' : '154'}
              value={form.weight}
              onChange={change('weight')}
            />
            {tool !== 'water' && (
              <FormField
                label={t(
                  units === 'metric' ? 'fields.heightCm' : 'fields.heightIn'
                )}
                type='number'
                inputMode='decimal'
                required
                step='any'
                placeholder={units === 'metric' ? '175' : '69'}
                value={form.height}
                onChange={change('height')}
              />
            )}
            {tool === 'water' && (
              <FormField
                label={t('fields.activityLevel')}
                value={form.activityLevel}
                onChange={change('activityLevel')}
              >
                {activityLevels.map((level) => (
                  <option
                    key={level.value}
                    value={level.value}
                  >
                    {t(`activity.${level.value}.label`)}
                  </option>
                ))}
              </FormField>
            )}
          </div>
          {tool === 'calories' && (
            <>
              <div className='form-grid'>
                <FormField
                  label={t('fields.age')}
                  type='number'
                  inputMode='numeric'
                  required
                  min={10}
                  max={100}
                  placeholder='30'
                  value={form.age}
                  onChange={change('age')}
                />
                <FormField
                  label={t('fields.sexFormula')}
                  value={form.gender}
                  required
                  onChange={change('gender')}
                >
                  <option value=''>{t('common.choose')}</option>
                  <option value='Female'>{t('gender.Female')}</option>
                  <option value='Male'>{t('gender.Male')}</option>
                </FormField>
              </div>
              <FormField
                label={t('fields.activityLevel')}
                value={form.activityLevel}
                onChange={change('activityLevel')}
              >
                {activityLevels.map((level) => (
                  <option
                    key={level.value}
                    value={level.value}
                  >
                    {t(`activity.${level.value}.label`)}
                  </option>
                ))}
              </FormField>
            </>
          )}
          <InlineMessage>{error}</InlineMessage>
          <button
            className='btn btn-primary btn-full'
            type='submit'
          >
            {text('button')}
            <Icon
              name='arrow'
              size={17}
            />
          </button>
          <button
            type='button'
            className='text-button'
            onClick={() => {
              setUnits('metric');
              setForm(getProfileForm());
              setResult(profileWellness(tool, getProfileForm()));
              setError('');
            }}
          >
            <Icon
              name='refresh'
              size={13}
            />
            {t('wellness.useProfile')}
          </button>
        </form>
      </div>
      <div
        ref={resultRef}
        className={`calculator-result tone-${copy.tone}`}
      >
        <span className='eyebrow'>{t('wellness.resultEyebrow')}</span>
        <div
          className='result-illustration'
          aria-hidden='true'
        >
          <span />
          <span />
          <Icon
            name={copy.icon}
            size={45}
          />
        </div>
        {result ? (
          <div
            role='status'
            className='result-output'
          >
            <strong>
              {formatNumber(result.value, { maximumFractionDigits: 2 })}
            </strong>
            <span>{t(result.unitKey)}</span>
            <p>{t(result.labelKey)}</p>
            {tool === 'water' && (
              <small>
                {t('wellness.glasses', {
                  count: Math.ceil(result.metricValue / 0.25),
                })}
              </small>
            )}
            {tool === 'bmi' && (
              <div
                className='bmi-scale'
                aria-label={t('wellness.bmiScale')}
              >
                <span />
                <span />
                <span />
                <span />
                <i
                  style={{
                    left: `${Math.max(2, Math.min(98, ((result.metricValue - 10) / 30) * 100))}%`,
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className='result-empty'>
            <h3>{text('empty')}</h3>
            <p>{t('wellness.emptyHint')}</p>
          </div>
        )}
        <p className='result-detail'>{text('detail')}</p>
      </div>
    </section>
  );
}
