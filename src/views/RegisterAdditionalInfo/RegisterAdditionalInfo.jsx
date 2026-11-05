import AlertError from '../../components/Alerts/AlertError/AlertError';
import AlertSuccess from '../../components/Alerts/AlertSuccess/AlertSuccess';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { alertHelper } from '../../helper/alert-helper';
import { updateUserByUsername } from '../../services/users.service';
import { AppContext } from '../../context/AppContext';
import {
  validateAge,
  validateFieldsForAdditionalInfo,
  validateFirstName,
  validateHeight,
  validateLastName,
  validateWeight,
} from '../../common/user.validations';
import { APP_NAME } from '../../common/constants';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function RegisterAdditionalInfo() {
  usePageTitle(`${APP_NAME} | Additional Info`);

  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
    gender: '',
  });

  const updateForm = (props) => (e) => {
    setForm({
      ...form,
      [props]: e.target.value,
    });
  };

  const validateAdditionalInfo = async () => {
    validateFieldsForAdditionalInfo(form);
    if (form.firstName !== '') {
      validateFirstName(form.firstName);
    }
    if (form.lastName !== '') {
      validateLastName(form.lastName);
    }
    if (form.age !== '') {
      validateAge(form.age);
    }
    if (form.weight !== '') {
      validateWeight(form.weight);
    }
    if (form.height !== '') {
      validateHeight(form.height);
    }
  };

  const addInfo = async (event) => {
    try {
      event.preventDefault();
      await validateAdditionalInfo();
      await updateUserByUsername(userData?.username, form);
      alertHelper(setMessage, setSuccess, 'Info Added successfully!');
      navigate('/');
    } catch (error) {
      alertHelper(setMessage, setAlert, error.message);
    }
  };

  return (
    <>
      <div
        id='register'
        className='hero min-h-screen bg-base-300'
      >
        <div className='hero-content flex-col lg:flex-row-reverse'>
          <div className='text-center lg:text-left'>
            <h1 className='text-5xl font-bold'>Additional</h1>
            <h1 className='text-5xl font-bold'>Info!</h1>
            <p className='py-6'>Not necessary!</p>
          </div>
          <div className='card shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
            <form className='card-body '>
              <div className='flex flex-col'>
                <label className='flex items-center select-none justify-between px-1 py-2'>
                  <span className='text-sm'>First Name: </span>
                </label>
                <input
                  onChange={updateForm('firstName')}
                  type='text'
                  placeholder='First Name'
                  className='input w-full'
                  value={form.firstName}
                />
              </div>
              <div className='flex flex-col'>
                <label className='flex items-center select-none justify-between px-1 py-2'>
                  <span className='text-sm'>Last Name: </span>
                </label>
                <input
                  onChange={updateForm('lastName')}
                  type='text'
                  placeholder='Last Name'
                  className='input w-full'
                  value={form.lastName}
                />
              </div>
              <div className='flex flex-col'>
                <label className='flex items-center select-none px-1 py-2 justify-start gap-1'>
                  <span className='text-sm mr-1'>Age: </span>
                </label>
                <input
                  onChange={updateForm('age')}
                  type='number'
                  placeholder={'Age'}
                  className='input w-11/12'
                  value={form.age}
                />
              </div>
              <div className='flex flex-col'>
                <label className='flex items-center select-none px-1 py-2 justify-start gap-1'>
                  <span className='text-sm  mr-1'>Weight: </span>
                </label>
                <input
                  onChange={updateForm('weight')}
                  type='number'
                  placeholder={'Weight in kg'}
                  className='input w-11/12'
                  value={form.weight}
                />
              </div>
              <div className='flex flex-col'>
                <label className='flex items-center select-none px-1 py-2 justify-start gap-1'>
                  <span className='text-sm mr-1'>Height: </span>
                </label>
                <input
                  onChange={updateForm('height')}
                  type='number'
                  placeholder={'Height in cm'}
                  className='input w-11/12'
                  value={form.height}
                />
              </div>
              <div className='flex flex-col'>
                <label className='flex items-center select-none justify-between px-1 py-2'>
                  <span className='text-sm'>Activity Level: </span>
                </label>
                <select
                  onChange={updateForm('activityLevel')}
                  className='select w-11/12'
                  value={form.activityLevel}
                >
                  <option value='base'>Choose Level</option>
                  <option value='Sedentary'>Sedentary</option>
                  <option value='Lightly Active'>Lightly Active</option>
                  <option value='Moderately Active'>Moderately Active</option>
                  <option value='Very Active'>Very Active</option>
                </select>
              </div>
              <div className='flex flex-col'>
                <label className='flex items-center select-none justify-between px-1 py-2'>
                  <span className='text-sm'>Gender: </span>
                </label>
                <select
                  onChange={updateForm('gender')}
                  className='select w-11/12'
                  value={form.gender}
                >
                  <option value='base'>Choose Gender</option>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                </select>
              </div>

              <div className='flex flex-col flex flex-row justify-center mt-6'>
                <button
                  onClick={addInfo}
                  className='btn btn-primary mx-3'
                >
                  Add Additional Info
                </button>
                <button
                  onClick={() => navigate('/')}
                  className='btn btn-primary mx-3'
                >
                  Skip and Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {success && <AlertSuccess message={message} />}
      {alert && <AlertError message={message} />}
    </>
  );
}
