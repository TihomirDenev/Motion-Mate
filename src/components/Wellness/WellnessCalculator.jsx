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

const content = {
  water: {
    title: 'Find your daily flow',
    description:
      'A little hydration goes a long way. Find a starting point for your day.',
    icon: 'drop',
    tone: 'blue',
    empty: 'A little refreshment, made personal.',
    detail:
      'Start with regular sips through the day. Your needs change with the weather, movement, and how you feel.',
    button: 'Find my hydration target',
  },
  bmi: {
    title: 'Get to know your balance',
    description:
      'One simple measure to help you understand your body a little better.',
    icon: 'scale',
    tone: 'lavender',
    empty: 'A fresh perspective on your balance.',
    detail:
      'BMI is a broad screening measure. It doesn’t distinguish muscle from fat or describe your overall fitness.',
    button: 'Calculate my BMI',
  },
  calories: {
    title: 'Fuel your everyday',
    description:
      'Find an estimate of the energy that keeps you moving at your current weight.',
    icon: 'flame',
    tone: 'peach',
    empty: 'Energy for everything that makes you, you.',
    detail:
      'Calculated with the revised Harris–Benedict equation and your activity level. A starting estimate, rather than a fixed daily target.',
    button: 'Find my daily energy',
  },
};

export default function WellnessCalculator({ tool }) {
  const { userData } = useContext(AppContext);
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
  const copy = content[tool];
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
            <h2>{copy.title}</h2>
            <p>{copy.description}</p>
          </div>
        </div>
        <div className='calculator-unit-row'>
          <span>Your measurements</span>
          <div
            className='segmented-control'
            role='group'
            aria-label='Measurement system'
          >
            {['metric', 'imperial'].map((value) => (
              <button
                key={value}
                type='button'
                aria-pressed={units === value}
                onClick={() => switchUnits(value)}
              >
                {value === 'metric' ? 'Metric' : 'Imperial'}
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
              label={`Weight (${units === 'metric' ? 'kg' : 'lb'})`}
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
                label={`Height (${units === 'metric' ? 'cm' : 'in'})`}
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
                label='Activity level'
                value={form.activityLevel}
                onChange={change('activityLevel')}
              >
                {activityLevels.map((level) => (
                  <option
                    key={level.value}
                    value={level.value}
                  >
                    {level.label}
                  </option>
                ))}
              </FormField>
            )}
          </div>
          {tool === 'calories' && (
            <>
              <div className='form-grid'>
                <FormField
                  label='Age (years)'
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
                  label='Sex used by the formula'
                  value={form.gender}
                  required
                  onChange={change('gender')}
                >
                  <option value=''>Choose</option>
                  <option value='Female'>Female</option>
                  <option value='Male'>Male</option>
                </FormField>
              </div>
              <FormField
                label='Activity level'
                value={form.activityLevel}
                onChange={change('activityLevel')}
              >
                {activityLevels.map((level) => (
                  <option
                    key={level.value}
                    value={level.value}
                  >
                    {level.label}
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
            {copy.button}
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
            Use my profile details
          </button>
        </form>
      </div>
      <div ref={resultRef} className={`calculator-result tone-${copy.tone}`}>
        <span className='eyebrow'>A LITTLE INSIGHT, JUST FOR YOU</span>
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
              {result.value.toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })}
            </strong>
            <span>{result.unit}</span>
            <p>{result.label}</p>
            {tool === 'water' && (
              <small>
                About {Math.ceil(result.metricValue / 0.25)} glasses of 250 ml
              </small>
            )}
            {tool === 'bmi' && (
              <div
                className='bmi-scale'
                aria-label='BMI reference scale'
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
            <h3>{copy.empty}</h3>
            <p>Enter your details to see your personal estimate.</p>
          </div>
        )}
        <p className='result-detail'>{copy.detail}</p>
      </div>
    </section>
  );
}
