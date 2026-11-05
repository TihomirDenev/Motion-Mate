import { useContext, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import { updateUserByUsername } from '../../../services/users.service';
import {
  validateAge,
  validateFirstName,
  validateHeight,
  validateLastName,
  validatePhoneNumberAsync,
  validateWeight,
} from '../../../common/user.validations';
import { alertHelper } from '../../../helper/alert-helper';
import AlertSuccess from '../../Alerts/AlertSuccess/AlertSuccess';
import AlertError from '../../Alerts/AlertError/AlertError';
import UserInfo from '../../UserInfo/UserInfo';

export default function EditProfileInfo({ setEditProfile }) {
  const { userData } = useContext(AppContext);
  const [message, setMessage] = useState(null);
  const [alert, setAlert] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    age: userData?.age || '',
    weight: userData?.weight || '',
    height: userData?.height || '',
    activityLevel: userData?.activityLevel || '',
    gender: userData?.gender || '',
    phoneNumber: userData?.phoneNumber || '',
  });

  const updateForm = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const validateFieldsAsync = async () => {
    if (userData?.firstName !== form.firstName && form.firstName !== '') {
      validateFirstName(form.firstName);
    }
    if (userData?.lastName !== form.lastName && form.lastName !== '') {
      validateLastName(form.lastName);
    }
    if (userData?.age !== form.age && form.age !== '') {
      validateAge(form.age);
    }
    if (userData.weight !== form.weight && form.weight !== '') {
      validateWeight(form.weight);
    }
    if (userData?.height !== form.height && form.height !== '') {
      validateHeight(form.height);
    }
    if (userData?.phoneNumber !== form.phoneNumber) {
      await validatePhoneNumberAsync(form.phoneNumber);
    }
  };

  const editProfileInformation = async () => {
    try {
      await validateFieldsAsync();
      await updateUserByUsername(userData?.username, form);
      setEditProfile(false);
      alertHelper(setMessage, setSuccess, 'Info Changed successfully!');
    } catch (error) {
      alertHelper(setMessage, setAlert, error.message);
    }
  };

  return (
    <div className='flex flex-col text-center mx-2'>
      <h1 className='mb-4 text-xl'>
        <p>Greetings, {userData?.username}! Ready to make updates? </p>
        <p>Edit your account details here.</p>
      </h1>
      <div className='border-2 border-gray-500 rounded-sm bg-base-300 p-4 shadow-lg flex flex-col justify-center items-center'>
        <div className='flex'>
          <div className='text-left text-lg mr-5'>
            <div>
              <p className='font-bold underline text-primary mb-6'>
                Main Information:
              </p>
              <UserInfo userData={userData} />
            </div>
          </div>
          <div className='mr-4 flex flex-col text-left text-lg px-4'>
            <p className='font-bold underline text-primary mb-3'>
              Edit Personal Information here:
            </p>
            <label htmlFor='firstName'>First Name:</label>
            <input
              type='text'
              name='firstName'
              placeholder='First Name'
              id='firstName'
              value={form?.firstName}
              onChange={updateForm('firstName')}
              className='border-2 border-gray-500 rounded-sm p-2 m-2 bg-gray-200 shadow-xl text-black'
            />
            <label htmlFor='lastName'>Last Name:</label>
            <input
              type='text'
              name='lastName'
              placeholder='Last Name'
              id='lastName'
              value={form?.lastName}
              onChange={updateForm('lastName')}
              className='border-2 border-gray-500 rounded-sm p-2 m-2 bg-gray-200 shadow-xl text-black'
            />
            <label htmlFor='age'>Age:</label>
            <input
              type='number'
              name='age'
              placeholder='Age'
              id='age'
              value={form?.age}
              onChange={updateForm('age')}
              className='border-2 border-gray-500 rounded-sm p-2 m-2 bg-gray-200 shadow-xl text-black'
            />
            <label htmlFor='phoneNumber'>Phone Number:</label>
            <input
              type='number'
              name='phoneNumber'
              placeholder='Phone Number'
              id='phoneNumber'
              value={form?.phoneNumber}
              onChange={updateForm('phoneNumber')}
              className='border-2 border-gray-500 rounded-sm p-2 m-2 bg-gray-200 shadow-xl text-black'
            />
          </div>
          <div className='mr-4 flex flex-col text-left text-lg px-4'>
            <p className='font-bold underline text-primary mb-3'>
              Edit Physical Attributes:
            </p>
            <label htmlFor='weight'>Weight in kg:</label>
            <input
              type='number'
              name='weight'
              placeholder='Weight'
              id='weight'
              value={form?.weight}
              onChange={updateForm('weight')}
              className='border-2 border-gray-500 rounded-sm p-2 m-2 bg-gray-200 shadow-xl text-black'
            />
            <label htmlFor='height'>Height in cm:</label>
            <input
              type='number'
              name='height'
              placeholder='Height'
              id='height'
              value={form?.height}
              onChange={updateForm('height')}
              className='border-2 border-gray-500 rounded-sm p-2 m-2 bg-gray-200 shadow-xl text-black'
            />
            <label htmlFor='activity-level'>Activity Level:</label>
            <select
              name='activity-level'
              id='activity-level'
              value={form?.activityLevel}
              onChange={updateForm('activityLevel')}
              className='border-2 border-gray-500 rounded-sm p-2 m-2 bg-gray-200 shadow-xl text-black'
            >
              <option value='Sedentary'>Sedentary</option>
              <option value='Lightly-Active'>Lightly Active</option>
              <option value='Moderately-Active'>Moderately Active</option>
              <option value='Very-Active'>Very Active</option>
            </select>
            <label htmlFor='gender'>Gender:</label>
            <select
              name='gender'
              id='gender'
              value={form?.gender}
              onChange={updateForm('gender')}
              className='border-2 border-gray-500 rounded-sm p-2 m-2 bg-gray-200 shadow-xl text-black'
            >
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
            </select>
          </div>
        </div>
        <div className='my-5'>
          <button
            className='btn btn-primary mr-4'
            onClick={() => editProfileInformation()}
          >
            Save Changes
          </button>
          <button
            className='btn btn-error'
            onClick={() => setEditProfile(false)}
          >
            Discard Changes
          </button>
        </div>
      </div>
      {success && <AlertSuccess message={message} />}
      {alert && <AlertError message={message} />}
    </div>
  );
}
