import { useContext } from 'react';
import { Link, useSearchParams } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { activityLevels, profileWellness } from '../../helper/wellness';
import WellnessCalculator from '../../components/Wellness/WellnessCalculator';
import PageHeader from '../../components/UI/PageHeader';
import Icon from '../../components/UI/Icon';
import { useTranslation } from '../../i18n/useTranslation';

const tools = [
  { value: 'water', icon: 'drop', tone: 'blue', unit: 'wellness.litersShort' },
  { value: 'bmi', icon: 'scale', tone: 'lavender', unit: 'common.bmi' },
  {
    value: 'calories',
    icon: 'flame',
    tone: 'peach',
    unit: 'wellness.kcalPerDay',
  },
];

export default function WellnessHealthTools() {
  const { t, formatNumber } = useTranslation();
  usePageTitle(`Motion Mate | ${t('titles.wellness')}`);
  const { userData } = useContext(AppContext);
  const [params, setParams] = useSearchParams();
  const selected = tools.some((tool) => tool.value === params.get('tool'))
    ? params.get('tool')
    : 'water';
  return (
    <div className='wellness-page page-enter'>
      <PageHeader
        eyebrow={t('wellness.eyebrow')}
        title={t('wellness.title')}
        description={t('wellness.description')}
        actions={
          <Link
            className='btn btn-ghost'
            to='/my-profile'
          >
            <Icon
              name='user'
              size={16}
            />
            {t('wellness.healthProfile')}
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
                <span>{t(`wellness.tools.${tool.value}`)}</span>
                <strong>
                  {result
                    ? formatNumber(result.value, { maximumFractionDigits: 2 })
                    : '—'}{' '}
                  <small>{t(tool.unit)}</small>
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
        <p>{t('wellness.context')}</p>
      </div>
      <div
        className='wellness-tabs'
        role='group'
        aria-label={t('wellness.chooseTool')}
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
            {t(`wellness.tools.${tool.value}`)}
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
            <strong>{t('wellness.guideTitle')}</strong>
            <span>{t('wellness.guideText')}</span>
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
              <h3>{t(`activity.${level.value}.label`)}</h3>
              <p>{t(`activity.${level.value}.description`)}</p>
            </div>
          ))}
        </div>
      </details>
      <div className='wellness-bottom-note'>
        <Icon
          name='leaf'
          size={20}
        />
        <p>{t('wellness.bottomNote')}</p>
      </div>
    </div>
  );
}
