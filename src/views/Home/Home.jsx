import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { HomeAuthenticated } from './HomeAuthenticated';
import { getAllUsers } from '../../services/users.service';
import { getExercises } from '../../services/exercise.service';
import { getAllCategories } from '../../services/category.service';
import { usePageTitle } from '../../hooks/usePageTitle';
import Icon from '../../components/UI/Icon';
import Authenticated from '../../hoc/Authenticated/Authenticated';
import { useTranslation } from '../../i18n/useTranslation';

export default function Home() {
  const { userData } = useContext(AppContext);
  const { t, formatNumber } = useTranslation();
  usePageTitle(
    `Motion Mate | ${t(userData ? 'titles.overview' : 'titles.landing')}`
  );
  const [counts, setCounts] = useState(null);
  useEffect(() => {
    if (userData) return;
    let ignore = false;
    Promise.all([getAllUsers(), getExercises(), getAllCategories()])
      .then(([users, exercises, categories]) => {
        if (!ignore)
          setCounts({
            users: Object.keys(users.val() || {}).length,
            exercises: exercises.reduce(
              (sum, group) => sum + Object.keys(group).length,
              0
            ),
            categories: categories.length,
          });
      })
      .catch(() => {
        /* The introduction stays available if community totals cannot load. */
      });
    return () => {
      ignore = true;
    };
  }, [userData]);

  if (userData)
    return (
      <Authenticated>
        <HomeAuthenticated />
      </Authenticated>
    );
  return (
    <div className='landing page-enter'>
      <section className='landing-hero'>
        <div className='landing-copy'>
          <span className='landing-badge'>
            <span className='status-dot' /> {t('landing.badge')}
          </span>
          <h1>
            {t('landing.titleLine1')}
            <br />
            {t('landing.titleLine2')} <span>{t('landing.titleHighlight')}</span>
          </h1>
          <p>{t('landing.description')}</p>
          <div className='landing-actions'>
            <Link
              className='btn btn-primary'
              to='/register'
            >
              {t('landing.primaryCta')}{' '}
              <Icon
                name='arrow'
                size={18}
              />
            </Link>
            <Link
              className='text-button'
              to='/about'
            >
              {t('landing.secondaryCta')}{' '}
              <Icon
                name='arrowUp'
                size={16}
              />
            </Link>
          </div>
          <div className='landing-community'>
            <div
              className='initials-stack'
              aria-hidden='true'
            >
              <span>TD</span>
              <span>TJ</span>
              <span>RM</span>
            </div>
            <div>
              <strong>{t('landing.communityTitle')}</strong>
              <small>
                {counts
                  ? t('landing.communityCount', { count: counts.users })
                  : t('landing.communityFallback')}
              </small>
            </div>
          </div>
        </div>
        <div className='landing-visual'>
          <img
            src='/images/runner.jpg'
            alt={t('landing.imageAlt')}
            fetchPriority='high'
          />
          <div className='landing-image-shade' />
          <span className='image-kicker'>{t('landing.imageKicker')}</span>
          <div className='image-caption'>
            {t('landing.captionLine1')}
            <br />
            {t('landing.captionLine2')}
            <span>.</span>
          </div>
          <div className='floating-note'>
            <span className='icon-tile'>
              <Icon
                name='activity'
                size={23}
              />
            </span>
            <div>
              <strong>{t('landing.noteTitle')}</strong>
              <small>{t('landing.noteText')}</small>
            </div>
            <Icon
              name='arrowUp'
              size={18}
            />
          </div>
          <div
            className='visual-orbit'
            aria-hidden='true'
          />
        </div>
      </section>
      <div className='landing-stats'>
        <div>
          <strong>{counts ? formatNumber(counts.categories) : '—'}</strong>
          <span>{t('landing.statCategories')}</span>
        </div>
        <div>
          <strong>{counts ? formatNumber(counts.exercises) : '—'}</strong>
          <span>{t('landing.statExercises')}</span>
        </div>
        <div>
          <strong>{counts ? formatNumber(counts.users) : '—'}</strong>
          <span>{t('landing.statUsers')}</span>
        </div>
      </div>
      <section className='landing-features'>
        <div className='landing-section-heading'>
          <p className='eyebrow'>{t('landing.featuresEyebrow')}</p>
          <h2>
            {t('landing.featuresTitleLine1')}
            <br />
            {t('landing.featuresTitleLine2')}
          </h2>
          <p>{t('landing.featuresDescription')}</p>
        </div>
        <div className='card-grid'>
          {[
            {
              icon: 'dumbbell',
              title: t('landing.feature1Title'),
              text: t('landing.feature1Text'),
              tone: 'mint',
              number: '01',
            },
            {
              icon: 'target',
              title: t('landing.feature2Title'),
              text: t('landing.feature2Text'),
              tone: 'lavender',
              number: '02',
            },
            {
              icon: 'heart',
              title: t('landing.feature3Title'),
              text: t('landing.feature3Text'),
              tone: 'peach',
              number: '03',
            },
          ].map((feature) => (
            <article
              className={`feature-card tone-${feature.tone}`}
              key={feature.title}
            >
              <div>
                <span className='icon-tile'>
                  <Icon
                    name={feature.icon}
                    size={24}
                  />
                </span>
                <small>{feature.number}</small>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <Link
                to='/register'
                aria-label={t('landing.featureLink', { title: feature.title })}
              >
                <Icon name='arrowUp' />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className='landing-cta'>
        <div>
          <p className='eyebrow'>{t('landing.ctaEyebrow')}</p>
          <h2>
            {t('landing.ctaTitleLine1')}
            <br />
            {t('landing.ctaTitleLine2')}
          </h2>
        </div>
        <Link
          className='btn btn-lime'
          to='/register'
        >
          {t('landing.ctaButton')} <Icon name='arrow' />
        </Link>
        <div
          className='cta-rings'
          aria-hidden='true'
        />
      </section>
    </div>
  );
}
