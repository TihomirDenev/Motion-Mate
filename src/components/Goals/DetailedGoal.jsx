import { onValue, ref } from 'firebase/database';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { db } from '../../config/firebase-config';
import { AppContext } from '../../context/AppContext';
import { APP_NAME } from '../../common/constants';
import TimeLeft from './TimeLeft';
import GoalButton from './GoalButton';
import Progress from './Progress';
import { updateGoalProgress } from '../../services/goal.service';
import { alertHelper } from '../../helper/alert-helper';
import AlertError from '../Alerts/AlertError/AlertError';
import { shortFormatDate } from '../../helper/format-date';
import { usePageTitle } from '../../hooks/usePageTitle';
import { handleAvatarError } from '../../helper/avatar-fallback';

const DetailedGoal = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const [goal, setGoal] = useState(null);
  const [showError, setShowError] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  const [progressSlider, setProgressSlider] = useState(0);
  const [toggleEditGoal, setToggleEditGoal] = useState(false);

  const outerTableDiv =
    'label text-primary border-b-2 place-content-center border-primary p-2 bg-base-200';
  const innerTableDiv = 'flex place-content-between w-full gap-2';
  const paragraph = 'text-lg text-secondary';

  usePageTitle(`${APP_NAME} | ${goal?.name || 'Detailed Goal'}`);

  const handleProgressChange = async (e) => {
    e.preventDefault();
    try {
      await updateGoalProgress(
        userData?.username,
        params.id,
        Number(e.target.value)
      );
    } catch (error) {
      alertHelper(setShowMessage, setShowError, error.message);
    }
  };

  useEffect(() => {
    return onValue(
      ref(db, `users/${userData?.username}/myGoals/${params.id}`),
      (snapshot) => {
        setGoal(snapshot.val());
        setProgressSlider(snapshot.val()?.progress);
      }
    );
  }, [userData?.username, params.id]);

  return (
    <div className='w-2/3 place-self-center'>
      <div
        className={
          'flex place-content-center gap-3 mb-2 border-2 border-primary rounded-sm p-2 shadow-lg'
        }
      >
        <div className='avatar'>
          <div className='mask mask-squircle w-12 h-12'>
            <img
              src={userData?.avatar}
              onError={handleAvatarError}
              alt={`Avatar of ${userData?.firstName} ${userData?.lastName}`}
            />
          </div>
        </div>
        <div>
          <div className='font-bold'>
            {userData?.firstName} {userData?.lastName}
          </div>
          <div className='text-sm opacity-50'>{userData?.email}</div>
        </div>
      </div>
      <div className='flex flex-col w-full justify-around gap-2 overflow-x-auto border-2 border-primary rounded-sm p-2 shadow-2xl'>
        <div className='flex justify-around items-center border-2 border-secondary rounded-lg p-3 shadow-xl'>
          <TimeLeft goal={goal} />
          {typeof goal?.progress !== 'undefined' ? (
            <Progress progress={goal?.progress} />
          ) : (
            <div className='skeleton rounded-full w-20 h-20'></div>
          )}

          <GoalButton
            primary
            title='Edit Goal Progress'
            onClick={() => setToggleEditGoal((prev) => !prev)}
          />
        </div>

        <div className='flex flex-col ring-offset-0 h-14 border-b-2 border-primary mt-2 p-2'>
          {toggleEditGoal && (
            <>
              <input
                type='range'
                min={0}
                max={100}
                value={progressSlider}
                className='range'
                onChange={(e) => setProgressSlider(e.target.value)}
                onMouseUp={(e) => handleProgressChange(e)}
                step={1}
              />
              <div className='flex justify-between text-sm px-2'>
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </>
          )}
        </div>
        <div className='text-lg text-secondary'>
          {/* Goal Type */}
          <div className='flex place-content-center text-lg text-primary font-bold border-b-4 border-primary p-2'>
            <h2>Goal Type</h2>
          </div>

          <div className='flex items-center select-none justify-between border-b-2 border-primary place-content-center p-2 bg-base-200'>
            <div className='text-lg text-secondary first-letter:uppercase'>
              {goal?.type}
            </div>
          </div>
          {/* Current Goal Status */}
          <div className='flex place-content-center text-lg text-primary font-bold border-b-4 border-primary p-2'>
            <h2>Current Goal Status</h2>
          </div>
          <div className='flex flex-col'>
            <div className={outerTableDiv}>
              <div className={innerTableDiv}>
                <h3>Exercises Done:</h3>
                <p className={paragraph}>{goal?.exercisesDone || 0}</p>
              </div>
            </div>

            <div className={outerTableDiv}>
              <div className={innerTableDiv}>
                <h3>Calories Burned:</h3>
                <p className={paragraph}>{goal?.caloriesBurned || 0}</p>
              </div>
            </div>

            <div className={outerTableDiv}>
              <div className={innerTableDiv}>
                <h3>Progress:</h3>
                <div className={paragraph}>{goal?.progress}%</div>
              </div>
            </div>
          </div>
          {/* Goal Details */}
          <div className='flex place-content-center text-lg text-primary font-bold border-b-4 border-primary p-2'>
            <h2>Goal Details</h2>
          </div>

          <div className='flex flex-col'>
            <div className={outerTableDiv}>
              <div className={innerTableDiv}>
                <h3>Goal Name:</h3>
                <p className={paragraph}>{goal?.name}</p>
              </div>
            </div>

            <div className={outerTableDiv}>
              <div className={innerTableDiv}>
                <h3>Calories:</h3>
                <p className={paragraph}>{goal?.calories}</p>
              </div>
            </div>

            <div className={outerTableDiv}>
              <div className={innerTableDiv}>
                <h3>Exercises:</h3>
                <div className={paragraph}>{goal?.exercises}</div>
              </div>
            </div>

            <div className={outerTableDiv}>
              <div className={innerTableDiv}>
                <h3>Goal Time Period:</h3>
                <div className={paragraph}>
                  <p className='border-b-2 border-primary'>
                    Starts: {shortFormatDate(goal?.timePeriod?.from)}
                  </p>
                  <p className='border-b-2 border-primary'>
                    Ends: {shortFormatDate(goal?.timePeriod?.to)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <GoalButton
          primary
          title='Back'
          onClick={() => navigate(-1)}
        />
      </div>
      {showError && <AlertError message={showMessage} />}
    </div>
  );
};

export default DetailedGoal;
