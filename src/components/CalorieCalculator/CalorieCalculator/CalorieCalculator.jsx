import calorie from '../../../assets/calorie.png';
import MetricScalar from '../MetricScalar/MetricScalar';
import AlertError from '../../Alerts/AlertError/AlertError';
import ImperialScalar from '../ImperialScalar/ImperialScalar';
import AlertSuccess from '../../Alerts/AlertSuccess/AlertSuccess';
import { useContext, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import { alertHelper } from '../../../helper/alert-helper';
import {
  ACTIVITY_MULTIPLIERS,
  BMR_MEN_AGE_MULTIPLIER,
  BMR_MEN_CONSTANT,
  BMR_MEN_HEIGHT_MULTIPLIER,
  BMR_MEN_WEIGHT_MULTIPLIER,
  BMR_WOMEN_AGE_MULTIPLIER,
  BMR_WOMEN_CONSTANT,
  BMR_WOMEN_HEIGHT_MULTIPLIER,
  BMR_WOMEN_WEIGHT_MULTIPLIER,
  INCHES_TO_CM_CONVERSION_FACTOR,
  KG_TO_LBS_CONVERSION_FACTOR,
} from '../../../common/constants';
import {
  validateFormInImperial,
  validateFormInMetric,
} from '../../../common/calorie.validations';

const calculateTotalDailyEnergyExpenditure = (BMR, activityLevel) => {
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

  return Math.floor(BMR * activityMultiplier);
};

const calculateBMR = (gender, weight, height, age) => {
  if (gender === 'Male') {
    return (
      BMR_MEN_CONSTANT +
      BMR_MEN_WEIGHT_MULTIPLIER * weight +
      BMR_MEN_HEIGHT_MULTIPLIER * height -
      BMR_MEN_AGE_MULTIPLIER * age
    );
  } else if (gender === 'Female') {
    return (
      BMR_WOMEN_CONSTANT +
      BMR_WOMEN_WEIGHT_MULTIPLIER * weight +
      BMR_WOMEN_HEIGHT_MULTIPLIER * height -
      BMR_WOMEN_AGE_MULTIPLIER * age
    );
  }
};

export default function CalorieCalculator() {
  const { userData } = useContext(AppContext);
  const [alert, setAlert] = useState(false);
  const [calories, setCalories] = useState(0);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [form, setForm] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'Male',
    activityLevel: 'Sedentary',
  });
  const userCalorie =
    userData?.weight &&
    userData?.height &&
    userData?.age &&
    userData?.gender &&
    userData?.activityLevel
      ? calculateTotalDailyEnergyExpenditure(
          calculateBMR(
            userData.gender,
            userData.weight,
            userData.height,
            userData.age
          ),
          userData.activityLevel
        )
      : 0;

  const handleChange = () => {
    setIsChecked(!isChecked);
    setCalories(0);
    setForm({
      weight: '',
      height: '',
      age: '',
      gender: 'Male',
      activityLevel: 'Sedentary',
    });
  };

  const updateForm = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const calculate = () => {
    try {
      if (isChecked) {
        validateFormInMetric(form);
        const BMR = calculateBMR(
          form.gender,
          form.weight,
          form.height,
          form.age
        );
        const TDEE = calculateTotalDailyEnergyExpenditure(
          BMR,
          form.activityLevel
        );
        setCalories(TDEE);
      } else {
        validateFormInImperial(form);
        const weightInKg = form?.weight / KG_TO_LBS_CONVERSION_FACTOR;
        const heightInCm = form?.height * INCHES_TO_CM_CONVERSION_FACTOR;
        const BMR = calculateBMR(form.gender, weightInKg, heightInCm, form.age);
        const TDEE = calculateTotalDailyEnergyExpenditure(
          BMR,
          form.activityLevel
        );
        setCalories(TDEE);
      }
      alertHelper(setMessage, setSuccess, 'Calorie calculated successfully!');
    } catch (error) {
      alertHelper(setMessage, setAlert, error.message);
    }
  };

  return (
    <div className='card p-4 flex flex-col bg-base-100 text-center m-4 border-2 border-gray-500 rounded-2xl shadow-2xl'>
      <p className='font-bold text-xl mb-8 text-primary'>
        What is Your Daily Caloric Needs Based on Activity Level
      </p>
      <p>
        Knowing how many calories you need to consume each day is essential for
        maintaining, losing, or gaining weight. Your activity level plays a
        significant role in determining this amount. Different activity levels
        require different amounts of calories to keep your body properly fueled.
      </p>
      <div className='flex gap-2 mt-5'>
        <div className='w-1/4 justify-center'>
          {userData?.weight &&
          userData?.height &&
          userData?.age &&
          userData?.gender &&
          userData?.activityLevel ? (
            <div className='flex flex-col border-2 border-gray-500 rounded-3xl p-4 bg-orange-300 text-black h-full justify-center'>
              <p className='font-bold mb-3'>Calorie Intake Recommendation:</p>
              <p>
                Your daily calorie needs are automatically calculated based on
                your age, gender, weight, height, and activity level you
                provided in your profile.
              </p>
              <p>
                Calories to keep your body properly fueled:{' '}
                <strong>{userCalorie} kcal/day</strong>
              </p>
            </div>
          ) : (
            <div className='flex flex-col border-2 border-gray-500 rounded-3xl p-4 bg-orange-300 text-black h-full justify-center'>
              <p>
                Please provide your weight, height, age, gender and activity
                level in your profile to get an accurate calculation of your
                daily caloric needs.
              </p>
            </div>
          )}
        </div>
        <div className='flex flex-col border-2 border-gray-500 rounded-3xl p-4 bg-orange-300 text-black w-3/4'>
          <p className='font-bold mb-2'>Calorie Calculator: </p>
          <div className='flex items-center justify-center'>
            {isChecked ? (
              <MetricScalar
                form={form}
                updateForm={updateForm}
              />
            ) : (
              <ImperialScalar
                form={form}
                updateForm={updateForm}
              />
            )}
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
          {calories === 0 ? (
            <p>
              Enter your weight, height, and age, then choose your gender and
              activity level to calculate your daily calorie needs.
            </p>
          ) : (
            <p>
              Your estimated total daily energy expenditure (caloric needs) is
              around <strong>{calories} kcal/day</strong> to maintain your
              current weight and activity level.
            </p>
          )}
        </div>
      </div>
      <div className='text-center'>
        <h1 className='text-primary text-xl text-center font-bold mt-6'>
          Guidelines to Choose Your Activity Level
        </h1>
        <div className='flex items-center mx-4'>
          <div>
            <img
              src={calorie}
              alt='calorie'
              className='w-80'
            />
          </div>
          <div className='mx-4'>
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
          Why is Knowing Your Caloric Needs Important?
        </h1>
        <p>
          Understanding your daily caloric needs is crucial for achieving your
          health goals, whether you want to maintain your current weight, lose
          weight, or gain weight. Consuming the right amount of calories helps
          you: Maintain energy levels Support bodily functions such as
          metabolism and muscle repair Prevent over- or under-eating, which can
          lead to health issues Optimize physical performance and recovery Use
          the guidelines above to select your activity level and ensure you`re
          meeting your daily caloric requirements for a healthier lifestyle.
        </p>
      </div>
      {success && <AlertSuccess message={message} />}
      {alert && <AlertError message={message} />}
    </div>
  );
}
