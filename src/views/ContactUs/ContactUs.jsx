import { usePageTitle } from '../../hooks/usePageTitle';
import PageHeader from '../../components/UI/PageHeader';
import Icon from '../../components/UI/Icon';
import Avatar from '../../components/UI/Avatar';
import { useTranslation } from '../../i18n/useTranslation';

const team = [
  {
    key: 'tihomir',
    email: 'Tihomir@motion-mate.bg',
    github: 'TihomirDenev',
    tone: 'mint',
  },
  {
    key: 'radoslav',
    email: 'Radoslav@motion-mate.bg',
    github: 'Radoslav-Marinovv',
    tone: 'lavender',
  },
  {
    key: 'tanya',
    email: 'Tanya@motion-mate.bg',
    github: 'TanyaZhecheva',
    tone: 'peach',
  },
];

export default function ContactUs() {
  const { t } = useTranslation();
  usePageTitle(`Motion Mate | ${t('contact.pageTitle')}`);
  return (
    <div className='contact-page page-enter'>
      <PageHeader
        eyebrow={t('contact.eyebrow')}
        title={t('contact.title')}
        description={t('contact.description')}
      />
      <section className='contact-intro'>
        <span className='icon-tile'>
          <Icon
            name='mail'
            size={30}
          />
        </span>
        <div>
          <h2>
            {t('contact.introLine1')}
            <br />
            {t('contact.introLine2')}
          </h2>
          <p>{t('contact.introText')}</p>
        </div>
        <span
          className='contact-sparkle'
          aria-hidden='true'
        >
          <Icon
            name='sparkles'
            size={75}
          />
        </span>
      </section>
      <div className='team-grid'>
        {team.map((member) => {
          const person = {
            ...member,
            firstName: t(`contact.team.${member.key}.firstName`),
            lastName: t(`contact.team.${member.key}.lastName`),
            avatar: `https://github.com/${member.github}.png?size=240`,
          };
          return (
            <article
              className='team-card surface'
              key={person.key}
            >
              <div className={`team-cover tone-${person.tone}`}>
                <Icon
                  name='activity'
                  size={47}
                />
              </div>
              <Avatar
                user={person}
                size='lg'
                zoomable
              />
              <h2>
                {person.firstName} <br />
                {person.lastName}
              </h2>
              <p>{t('contact.role')}</p>
              <div className='team-actions'>
                <a
                  className='btn btn-primary'
                  href={`mailto:${person.email}`}
                >
                  <Icon
                    name='mail'
                    size={16}
                  />
                  {t('contact.sayHello')}
                </a>
                <a
                  className='icon-button'
                  href={`https://github.com/${person.github}`}
                  target='_blank'
                  rel='noreferrer'
                  aria-label={t('contact.github', { name: person.firstName })}
                >
                  <Icon
                    name='arrowUp'
                    size={17}
                  />
                </a>
              </div>
            </article>
          );
        })}
      </div>
      <section className='contact-faq section-space'>
        <div className='section-heading'>
          <div>
            <h2>{t('contact.faqTitle')}</h2>
            <p>{t('contact.faqText')}</p>
          </div>
          <Icon
            name='info'
            size={21}
          />
        </div>
        {[1, 2, 3, 4]
          .map((number) => ({
            question: t(`contact.faq${number}Question`),
            answer: t(`contact.faq${number}Answer`),
          }))
          .map((item) => (
            <details
              className='faq-item surface'
              key={item.question}
            >
              <summary>
                {item.question}
                <Icon
                  name='plus'
                  size={17}
                />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
      </section>
      <a
        className='contact-github'
        href='https://github.com/TihomirDenev/Motion-Mate'
        target='_blank'
        rel='noreferrer'
      >
        <span>{t('contact.githubText')}</span>
        <strong>
          {t('contact.githubLink')}{' '}
          <Icon
            name='arrowUp'
            size={15}
          />
        </strong>
      </a>
    </div>
  );
}
