import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/users.service';
import { SVG } from '../../components/About/SVG';
import { APP_NAME } from '../../common/constants';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function About() {
  usePageTitle(`${APP_NAME} | About`);

  const [countUser, setCountUser] = useState();

  useEffect(() => {
    getAllUsers().then((snapshot) => {
      setCountUser(Object.values(snapshot.val()).length);
    });
  }, [countUser]);

  return (
    <ul className='timeline timeline-snap-icon max-md:timeline-compact timeline-vertical'>
      <div className='text-lg font-black text-center mb-3 text-primary'>
        MOTION MATE
      </div>
      <li>
        <div className='timeline-middle'>
          <SVG />
        </div>
        <div className='timeline-start md:text-end mb-10 text-lg font-black'>
          This is your personal fitness app, designed for users to set their own
          goals and exercises. With a simple and intuitive design, we make every
          workout not a duty, but a habit, that drives you out of bed! We
          encourage people to be active and feel energized.
        </div>
        <hr className='bg-primary' />
      </li>
      <li>
        <hr className='bg-primary' />
        <div className='timeline-middle'>
          <SVG />
        </div>
        <div className='timeline-end mb-10 text-lg font-black'>
          <div className='text-lg font-black text-primary'>Why choose us?</div>
          Skip the everyday calculations of how much calories you have burned.
          Here you can calculate your daily calories burned during workout.
          Also, you don`t need to search in the web to find your perfect
          exercise videos. Make your list here, where you have access to them
          non-stop and at any time you can add more exercises in your session,
          divide them in different categories for better user experience.
        </div>
        <hr className='bg-primary' />
      </li>
      <li>
        <hr className='bg-primary' />
        <div className='timeline-middle'>
          <SVG />
        </div>
        <div className='timeline-start md:text-end mb-10 text-lg font-black'>
          <div className='text-lg font-black text-primary'>
            BMI, Water Intake Calculator, goals and more
          </div>
          We provide you with Body Mass Index tool to assess whether an
          individual has a healthy body weight for a given height. <br />
          Calorie and Water Intake Calculator for understanding how much water
          and calories you need to consume daily.
          <br /> You can also set different personal goals with a time period.
          For example, set a goal to be active all seven days of the week and
          more on!
        </div>
        <hr className='bg-primary' />
      </li>
      <li>
        <hr className='bg-primary' />
        <div className='timeline-middle'>
          <SVG />
        </div>
        <div className='timeline-end mb-10 text-lg font-black'>
          <div className='text-lg font-black text-primary'>Motion Mates</div>
          Connect with people using the same app! <br />
          You can add other users in your friend list and share exercises and
          goals.
          <br /> You decide who is your perfect Motion Mate!
        </div>
        <hr className='bg-primary' />
      </li>
      <li>
        <hr className='bg-primary' />
        <div className='timeline-middle'>
          <SVG />
        </div>
        <div className='timeline-start md:text-end mb-10 text-lg font-black'>
          <div className='text-lg font-black text-primary'>
            So what are you waiting for ?
          </div>
          We are currently {countUser} users, and we are looking for the next
          active people to join us!
        </div>
      </li>
    </ul>
  );
}
