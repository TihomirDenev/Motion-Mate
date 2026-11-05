import { useContext } from 'react';
import { Link } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import Icon from '../../components/UI/Icon';
import { useTranslation } from '../../i18n/useTranslation';

export default function About() {
  const { t } = useTranslation();
  usePageTitle(`Motion Mate | ${t('nav.story')}`);
  const { userData } = useContext(AppContext);
  return (
    <div className='about-page page-enter'>
      <section className='about-intro'>
        <div>
          <p className='eyebrow'>{t('about.eyebrow')}</p>
          <h1>
            {t('about.titleLine1')}
            <br />
            {t('about.titleLine2')} <span>{t('about.titleHighlight')}</span>
          </h1>
          <p>{t('about.paragraph1')}</p>
          <p>{t('about.paragraph2')}</p>
          <Link
            className='btn btn-primary'
            to={userData ? '/exercises' : '/register'}
          >
            {t('landing.primaryCta')}{' '}
            <Icon
              name='arrow'
              size={17}
            />
          </Link>
        </div>
        <div className='about-photo'>
          <img
            src='/images/yoga.jpg'
            alt={t('about.imageAlt')}
          />
          <span>{t('about.imageCaption')}</span>
        </div>
      </section>
      <section className='about-values'>
        <div className='landing-section-heading'>
          <p className='eyebrow'>{t('about.valuesEyebrow')}</p>
          <h2>
            {t('about.valuesLine1')}
            <br />
            {t('about.valuesLine2')}
          </h2>
        </div>
        <div className='card-grid'>
          {[
            {
              icon: 'dumbbell',
              title: t('about.value1Title'),
              copy: t('about.value1Text'),
              tone: 'mint',
            },
            {
              icon: 'target',
              title: t('about.value2Title'),
              copy: t('about.value2Text'),
              tone: 'lavender',
            },
            {
              icon: 'users',
              title: t('about.value3Title'),
              copy: t('about.value3Text'),
              tone: 'peach',
            },
          ].map((item) => (
            <article
              className={`feature-card tone-${item.tone}`}
              key={item.title}
            >
              <span className='icon-tile'>
                <Icon
                  name={item.icon}
                  size={24}
                />
              </span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className='about-manifesto'>
        <Icon
          name='activity'
          size={36}
        />
        <h2>
          {t('about.manifestoLine1')}
          <br />
          {t('about.manifestoLine2')}
          <br />
          <span>{t('about.manifestoLine3')}</span>
        </h2>
        <p>{t('about.madeBy')}</p>
        <Link
          className='text-button'
          to='/contact-us'
        >
          {t('about.meetTeam')}{' '}
          <Icon
            name='arrow'
            size={16}
          />
        </Link>
      </section>
    </div>
  );
}
