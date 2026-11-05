import { usePageTitle } from '../../hooks/usePageTitle';
import PageHeader from '../../components/UI/PageHeader';
import Icon from '../../components/UI/Icon';
import Avatar from '../../components/UI/Avatar';

const team = [
  {
    firstName: 'Tihomir',
    lastName: 'Denev',
    email: 'Tihomir@motion-mate.bg',
    github: 'TihomirDenev',
    tone: 'mint',
  },
  {
    firstName: 'Radoslav',
    lastName: 'Marinov',
    email: 'Radoslav@motion-mate.bg',
    github: 'Radoslav-Marinovv',
    tone: 'lavender',
  },
  {
    firstName: 'Tanya',
    lastName: 'Zhecheva',
    email: 'Tanya@motion-mate.bg',
    github: 'TanyaZhecheva',
    tone: 'peach',
  },
];

export default function ContactUs() {
  usePageTitle('Motion Mate | We’re here for you');
  return (
    <div className='contact-page page-enter'>
      <PageHeader
        eyebrow='A LITTLE CONVERSATION GOES A LONG WAY'
        title='We’re in your corner.'
        description='A question, an idea, or a little feedback? We’d love to hear what’s on your mind.'
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
            Real people.
            <br />A shared love for movement.
          </h2>
          <p>
            Meet the team behind Motion Mate. We’re here to help make your
            journey a little smoother.
          </p>
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
        {team.map((person) => (
          <article
            className='team-card surface'
            key={person.firstName}
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
            />
            <h2>
              {person.firstName}{' '}
              <br />
              {person.lastName}
            </h2>
            <p>Motion Mate co-creator</p>
            <div className='team-actions'>
              <a
                className='btn btn-primary'
                href={`mailto:${person.email}`}
              >
                <Icon
                  name='mail'
                  size={16}
                />
                Say hello
              </a>
              <a
                className='icon-button'
                href={`https://github.com/${person.github}`}
                target='_blank'
                rel='noreferrer'
                aria-label={`${person.firstName} on GitHub`}
              >
                <Icon
                  name='arrowUp'
                  size={17}
                />
              </a>
            </div>
          </article>
        ))}
      </div>
      <section className='contact-faq section-space'>
        <div className='section-heading'>
          <div>
            <h2>A few quick answers</h2>
            <p>A little help to keep you moving.</p>
          </div>
          <Icon
            name='info'
            size={21}
          />
        </div>
        {[
          {
            question: 'How do I build my first workout?',
            answer:
              'Open the exercise library, choose a category, and add exercises to your workout. They’ll appear on your overview, where you can start each exercise timer. Create your own moves or discover exercises from your friends.',
          },
          {
            question: 'How does goal progress work?',
            answer:
              'Exercise and calorie goals update when you finish an exercise timer within your goal dates. For a personal milestone, open the goal, update the progress slider, and save your changes.',
          },
          {
            question: 'Can I personalize my wellness results?',
            answer:
              'Absolutely. Add your weight, height, age, activity level, and sex for calculations to your profile. Your wellness tools will use these details as a starting point. You can also try different measurements in each calculator.',
          },
          {
            question: 'How can I suggest an improvement?',
            answer:
              'We love a good idea. Email a team member or visit our GitHub repository to share your feedback. Motion Mate gets better with the people who use it.',
          },
        ].map((item) => (
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
        <span>Built together. Always moving forward.</span>
        <strong>
          Find us on GitHub{' '}
          <Icon
            name='arrowUp'
            size={15}
          />
        </strong>
      </a>
    </div>
  );
}
