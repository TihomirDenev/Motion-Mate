import water from '../../../assets/water.png';
import AlertError from '../../Alerts/AlertError/AlertError';
import AlertSuccess from '../../Alerts/AlertSuccess/AlertSuccess';
import MetricWaterIntake from '../MetricWaterIntake/MetricWaterIntake';
import ImperialWaterIntake from '../ImperialWaterIntake/ImperialWaterIntake';
import { AppContext } from '../../../context/AppContext';
import { alertHelper } from '../../../helper/alert-helper';
import { useContext, useState } from 'react';
import {
  validateFormInImperial,
  validateFormInMetric,
} from '../../../common/ALWIValidations';
import {
  ACTIVITY_MULTIPLIERS,
  KG_TO_LBS_CONVERSION_FACTOR,
  WATER_INTAKE_CONSTANT,
} from '../../../common/constants';

const calculateWaterIntake = (weight, activityLevel) => {
  let activityMultiplier;

  switch (activityLevel) {
    case 'Lightly-Active':
      activityMultiplier = ACTIVITY_MULTIPLIERS.lightly_active;
      break;
    case 'Moderately-Active':
      activityMultiplier = ACTIVITY_MULTIPLIERS.moderately_active;
      break;
    case 'Very-Active':
      activityMultiplier = ACTIVITY_MULTIPLIERS.very_active;
      break;
    default:
      activityMultiplier = ACTIVITY_MULTIPLIERS.default;
  }

  return weight * activityMultiplier;
};

export default function ActivityLevelWaterIntake() {
  const { userData } = useContext(AppContext);
  const [alert, setAlert] = useState(false);
  const [weight, setWeight] = useState('');
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [waterIntake, setWaterIntake] = useState(0);
  const [activityLevel, setActivityLevel] = useState('Sedentary');
  const userWaterIntake =
    userData?.weight && userData?.activityLevel
      ? (
          calculateWaterIntake(userData.weight, userData.activityLevel) *
          WATER_INTAKE_CONSTANT
        ).toFixed(2)
      : 0;

  const handleChange = () => {
    setIsChecked(!isChecked);
    setWaterIntake(0);
    setWeight('');
  };

  const calculate = () => {
    try {
      if (isChecked) {
        validateFormInMetric(weight);
        const intake = calculateWaterIntake(weight, activityLevel);
        setWaterIntake((intake * WATER_INTAKE_CONSTANT).toFixed(2));
      } else {
        validateFormInImperial(weight);
        const weightInKg = weight / KG_TO_LBS_CONVERSION_FACTOR;
        const intake = calculateWaterIntake(weightInKg, activityLevel);
        setWaterIntake((intake * WATER_INTAKE_CONSTANT).toFixed(2));
      }
      alertHelper(
        setMessage,
        setSuccess,
        'Activity Level Water Intake calculated successfully!'
      );
    } catch (error) {
      alertHelper(setMessage, setAlert, error.message);
    }
  };

  return (
    <div className='card p-4 flex flex-col bg-base-100 text-center m-4 border-2 border-gray-500 rounded-2xl shadow-2xl'>
      <p className='font-bold text-xl mb-8 text-primary'>
        Understanding how much water you need to drink daily is essential for
        maintaining good health, and your activity level plays a significant
        role in determining this amount.
      </p>
      <p>
        For more than a century, hydration guidelines have emphasized the
        importance of adjusting water intake based on physical activity.
        Different activity levels require different amounts of water to keep the
        body properly hydrated. A sedentary individual needs less water compared
        to someone who is very active.
      </p>
      <div className='flex gap-2 mt-5'>
        <div className='w-1/4'>
          {userData?.weight && userData?.activityLevel ? (
            <div className='flex flex-col border-2 border-gray-500 rounded-3xl p-4 bg-orange-300 text-black h-full justify-center'>
              <p className='mb-2 font-bold'>Your Recommended Water Intake:</p>
              <p>
                Water intake is automatically calculated based on the activity
                level and your weight you provided in your profile.
              </p>
              <p>Recommended Water Intake: </p>
              <strong>{userWaterIntake} liters per day.</strong>
            </div>
          ) : (
            <div className='flex flex-col border-2 border-gray-500 rounded-3xl p-4 bg-orange-300 text-black h-full justify-center'>
              <p>
                To view your recommended daily water intake, please update your
                profile with your activity level and weight.
              </p>
            </div>
          )}
        </div>
        <div className='flex flex-col border-2 border-gray-500 rounded-3xl p-4 bg-orange-300 text-black w-3/4'>
          <p className='font-bold mb-2'>Water Intake Calculator: </p>
          <div>
            <div>
              {isChecked ? (
                <MetricWaterIntake
                  weight={weight}
                  setWeight={setWeight}
                />
              ) : (
                <ImperialWaterIntake
                  weight={weight}
                  setWeight={setWeight}
                />
              )}
              <label>Activity Level:</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className='border-2 border-gray-500 rounded-sm p-2 ml-1 bg-gray-200 shadow-xl text-black w-44'
              >
                <option value='Sedentary'>Sedentary</option>
                <option value='Lightly-Active'>Lightly Active</option>
                <option value='Moderately-Active'>Moderately Active</option>
                <option value='Very-Active'>Very Active</option>
              </select>
            </div>
            <div className='flex my-4 items-center justify-end'>
              <div className='flex flex-col flex flex-row items-center border-2 border-gray-500 rounded-2xl p-2 bg-blue-200 text-black h-14'>
                <p>Imperial or Metric System</p>
                <label className='cursor-pointer flex items-center select-none justify-between px-1 py-2'>
                  <input
                    type='checkbox'
                    className='toggle toggle-info'
                    checked={isChecked}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <button
                className='border-2 border-gray-500 rounded-2xl p-2 bg-blue-200 text-black h-14 ml-4'
                onClick={() => calculate()}
              >
                Calculate
              </button>
            </div>
            {waterIntake === 0 ? (
              <h2>
                Enter your weight and choose your activity level to calculate
                your daily water intake.
              </h2>
            ) : isChecked ? (
              <h2>Recommended Water Intake: {waterIntake} liters per day.</h2>
            ) : (
              <h2>Recommended Water Intake: {waterIntake} ounces per day.</h2>
            )}
          </div>
        </div>
      </div>
      <div className='text-center'>
        <h1 className='text-primary text-xl text-center font-bold mt-6'>
          Guidelines to Choose Your Activity Level
        </h1>
        <div className='flex items-center mx-4'>
          <div>
            <img
              src={water}
              alt='WaterIntake'
              className='w-80'
            />
          </div>
          <div>
            <p>
              <strong className='text-primary'>Sedentary:</strong> Choose this
              if you have a job that involves sitting most of the day, and you
              engage in very little physical activity.
            </p>
            <p>
              <strong className='text-primary'>Lightly Active:</strong> Choose
              this if you occasionally exercise or have a job that involves some
              walking or other light physical activities. If you engage in light
              exercise 1-3 times a week, this level is suitable.
            </p>
            <p>
              <strong className='text-primary'>Moderately Active:</strong>{' '}
              Choose this if you exercise moderately (like brisk walking,
              jogging, or cycling) 3-5 times a week or have a job that involves
              a significant amount of physical activity.
            </p>
            <p>
              <strong className='text-primary'>Very Active:</strong> Choose this
              if you engage in intense physical activity or sports almost every
              day of the week, or if you have a very physically demanding job.
            </p>
          </div>
        </div>
      </div>
      <div className='mb-4 mt-6'>
        <h1 className='text-primary font-bold'>
          Why is Proper Hydration Important?
        </h1>
        <p>
          Proper hydration is crucial for maintaining overall health and
          well-being. Water is essential for various bodily functions, including
          regulating body temperature, transporting nutrients, and removing
          waste. Staying well-hydrated can enhance physical performance, improve
          mood and concentration, and prevent complications such as kidney
          stones and urinary tract infections.
        </p>
      </div>
      {success && <AlertSuccess message={message} />}
      {alert && <AlertError message={message} />}
    </div>
  );
}
