import { useContext } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AppContext } from '../../context/AppContext';
import { APP_NAME } from '../../common/constants';
import { HomeAuthenticated } from './HomeAuthenticated';
import { Carousel } from '../../components/Home/Carousel';
import { getAllUsers } from '../../services/users.service';
import { getExercises } from '../../services/exercise.service';
import { getAllCategories } from '../../services/category.service';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function Home() {
  usePageTitle(`${APP_NAME} | Home`);

  const navigate = useNavigate();

  const { userData } = useContext(AppContext);

  const [allUsers, setAllUsers] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const func = async () => {
      const result = await getAllUsers();
      const exercises = await getExercises();
      const exercisesLength = exercises.reduce((acc, category) => {
        acc += Object.values(category).length;
        return acc;
      }, 0);

      const users = result.val();
      const categories = await getAllCategories();
      setAllCategories(categories.length);
      setAllUsers(Object.keys(users).length);
      setAllExercises(exercisesLength);
    };
    func();
  }, []);

  return (
    <div>
      {userData?.username ? (
        <HomeAuthenticated />
      ) : (
        <div className='flex flex-col '>
          <div className=' bg-base-200 shadow-2xl'>
            <div className='hero-content flex-col lg:flex-row'>
              <Carousel />
              <div>
                <h1 className='text-5xl font-bold'>
                  Ready to join the lifestyle?
                </h1>
                <p className='py-6'>
                  Find the right category that fits you. Challenge yourself with
                  exercises with difficulty for beginners or lovers. Here you
                  can find all type of exercises for all parts of the body, find
                  other users and exchange ideas.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className='btn btn-secondary'
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
          <div className='mt-10 place-self-center'>
            <div className='stats stats-vertical md:stats-horizontal bg-base-100 shadow-2xl flex-1'>
              <div className='stat'>
                <div className='stat-figure text-secondary'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    className='inline-block w-8 h-8 stroke-current'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    ></path>
                  </svg>
                </div>
                <div className='stat-title'>Category exercises</div>
                <div className='stat-value text-secondary'>
                  {allCategories || 0}
                </div>
                <div className='stat-desc'>Create your own personal </div>
              </div>

              <div className='stat'>
                <div className='stat-figure text-secondary'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    className='inline-block w-8 h-8 stroke-current'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4'
                    ></path>
                  </svg>
                </div>
                <div className='stat-title'>All Users</div>
                <div className='stat-value text-secondary'>{allUsers || 0}</div>
                <div className='stat-desc'>
                  ↗︎ What are you waiting for - join us!
                </div>
              </div>

              <div className='stat'>
                <div className='stat-figure text-secondary'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    className='inline-block w-8 h-8 stroke-current'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
                    ></path>
                  </svg>
                </div>
                <div className='stat-title'>Exercises available</div>
                <div className='stat-value text-secondary mb-1'>
                  {allExercises || 0}
                </div>
                <div className='stat-desc'>Be active</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
