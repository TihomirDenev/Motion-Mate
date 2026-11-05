import {
  faMedal,
  faRankingStar,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { deleteGoal } from '../../services/goal.service';
import { AppContext } from '../../context/AppContext';
import { onValue, ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import InfoBite from '../Exercise/InfoBite';
import { useNavigate } from 'react-router';
import { NoActivityCard } from './NoActivityCard';

export const FinishedGoal = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState();
  const { userData } = useContext(AppContext);
  const [toggleDelete, setToggleDelete] = useState(null);

  useEffect(() => {
    return onValue(
      ref(db, `users/${userData?.username}`),

      (snapshot) => {
        const myGoals = snapshot.val()?.myGoals;

        if (myGoals) {
          try {
            const goalsWithId = Object.entries(myGoals).map(([id, goal]) => ({
              id,
              ...goal,
            }));

            const result = goalsWithId.filter((goal) => goal?.progress >= 100);
            if (result) {
              setGoals(result);
            }
          } catch (error) {
            throw new Error(error.message, { cause: error });
          }
        } else {
          setGoals(null);
        }
      }
    );
  }, [userData?.username]);

  const removeGoalAsync = async (userData, goal) => {
    await deleteGoal(userData?.username, goal.id);
    setToggleDelete(!toggleDelete);
  };

  return (
    <>
      {goals?.length > 0 ? (
        <>
          {goals?.map((goal) => (
            <div key={goal.id}>
              <div className='flex flex-col items-center'>
                <div className='card w-96 bg-base-300 m-2 shadow-xl'>
                  <div className='card-body p-4'>
                    <div className='flex justify-between items-center'>
                      <h2 className='card-title text-lg font-bold'>Goal</h2>
                      <h3 className='text-lg font-bold'>{goal.name}</h3>
                      <div className='flex space-x-2'>
                        <FontAwesomeIcon
                          icon={faStar}
                          className='text-yellow-500'
                        />
                        <FontAwesomeIcon
                          icon={faMedal}
                          className='text-blue-500'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-2 '>
                      <InfoBite
                        isBlock
                        title={'Duration'}
                        content={`From : ${new Date(
                          goal?.timePeriod?.from
                        ).toLocaleString()}`}
                      />

                      <InfoBite
                        isBlock
                        content={`To: ${new Date(
                          goal?.timePeriod?.to
                        ).toLocaleString()}`}
                      />

                      <InfoBite
                        title={'Calories'}
                        content={String(goal.calories)}
                      />
                    </div>

                    <div className='card-actions justify-end mt-4'>
                      <button
                        onClick={() => removeGoalAsync(userData, goal)}
                        className='btn btn-secondary'
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <NoActivityCard
            onClick={() => navigate('/goals')}
            icon={faRankingStar}
            title={'No finished goals!'}
            content={
              'Challenge yourself with setting personal goals to keep track of your progress!'
            }
          />
        </>
      )}
    </>
  );
};
