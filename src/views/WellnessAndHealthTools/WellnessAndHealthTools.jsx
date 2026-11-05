import { useContext } from 'react';
import { Link, useSearchParams } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { activityLevels, profileWellness } from '../../helper/wellness';
import WellnessCalculator from '../../components/Wellness/WellnessCalculator';
import PageHeader from '../../components/UI/PageHeader';
import Icon from '../../components/UI/Icon';

const tools = [
  {
    value: 'water',
    label: 'Hydration',
    icon: 'drop',
    tone: 'blue',
    unit: 'L / day',
  },
  {
    value: 'bmi',
    label: 'Body balance',
    icon: 'scale',
    tone: 'lavender',
    unit: 'BMI',
  },
  {
    value: 'calories',
    label: 'Daily energy',
    icon: 'flame',
    tone: 'peach',
    unit: 'kcal / day',
  },
];

export default function WellnessHealthTools() {
  usePageTitle('Motion Mate | Wellness');
  const { userData } = useContext(AppContext);
  const [params, setParams] = useSearchParams();
  const selected = tools.some((tool) => tool.value === params.get('tool'))
    ? params.get('tool')
    : 'water';
  return (
    <div className='wellness-page page-enter'>
      <PageHeader
        eyebrow='LOOK AFTER THE WHOLE YOU'
        title='Feel good. From within.'
        description='A little understanding. A little care. A healthier kind of everyday.'
        actions={
          <Link
            className='btn btn-ghost'
            to='/my-profile'
          >
            <Icon
              name='user'
              size={16}
            />
            Your health profile
          </Link>
        }
      />
      <div className='wellness-overview'>
        {tools.map((tool) => {
          const result = profileWellness(tool.value, userData);
          return (
            <button
              key={tool.value}
              className={`wellness-overview-card tone-${tool.tone}`}
              onClick={() => setParams({ tool: tool.value }, { replace: true })}
              aria-pressed={selected === tool.value}
            >
              <span className='icon-tile'>
                <Icon
                  name={tool.icon}
                  size={21}
                />
              </span>
              <div>
                <span>{tool.label}</span>
                <strong>
                  {result ? result.value.toLocaleString() : '—'}{' '}
                  <small>{tool.unit}</small>
                </strong>
              </div>
              <Icon
                name='arrowUp'
                size={16}
              />
            </button>
          );
        })}
      </div>
      <div className='wellness-context'>
        <Icon
          name='sparkles'
          size={15}
        />
        <p>
          Your snapshot is based on your profile. Explore the calculators below
          for a more personal look.
        </p>
      </div>
      <div
        className='wellness-tabs'
        role='group'
        aria-label='Choose a wellness calculator'
      >
        {tools.map((tool) => (
          <button
            key={tool.value}
            aria-pressed={selected === tool.value}
            onClick={() => setParams({ tool: tool.value }, { replace: true })}
          >
            <Icon
              name={tool.icon}
              size={17}
            />
            {tool.label}
          </button>
        ))}
      </div>
      <WellnessCalculator
        key={selected}
        tool={selected}
      />
      <details className='wellness-guide surface'>
        <summary>
          <span className='icon-tile tone-mint'>
            <Icon
              name='activity'
              size={20}
            />
          </span>
          <div>
            <strong>Find your activity level</strong>
            <span>A quick guide to your kind of everyday.</span>
          </div>
          <Icon
            name='down'
            size={18}
          />
        </summary>
        <div className='activity-guide-grid'>
          {activityLevels.map((level, index) => (
            <div key={level.value}>
              <span>0{index + 1}</span>
              <h3>{level.label}</h3>
              <p>{level.description}</p>
            </div>
          ))}
        </div>
      </details>
      <div className='wellness-bottom-note'>
        <Icon
          name='leaf'
          size={20}
        />
        <p>
          Wellness is more than a number. These tools offer a starting point —
          listen to your body, and make room for what feels good.
        </p>
      </div>
    </div>
  );
}
