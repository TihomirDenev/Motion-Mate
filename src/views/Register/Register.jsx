import { useContext, useEffect, useState } from 'react';
import { registerUser } from '../../services/auth.service';
import { alertHelper } from '../../helper/alert-helper';
import { useNavigate } from 'react-router';
import { AppContext } from '../../context/AppContext';
import AlertError from '../../components/Alerts/AlertError/AlertError';
import AlertSuccess from '../../components/Alerts/AlertSuccess/AlertSuccess';
import {
  createUser,
  getUserData,
  uploadPhoto,
} from '../../services/users.service';
import {
  validatePassword,
  validateRequiredFieldsReg,
  validateEmailRegAsync,
  validateUserNameRegAsync,
  validatePhoneNumberAsync,
  validatePhoto,
} from '../../common/user.validations';
import { APP_NAME } from '../../common/constants';
import { usePageTitle } from '../../hooks/usePageTitle';

export default function Register() {
  usePageTitle(`${APP_NAME} | Register`);

  const navigate = useNavigate();
  const { user, setAppState } = useContext(AppContext);

  const [image, setImage] = useState(null);
  const [alert, setAlert] = useState(false);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
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

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files[0]) {
      setImage(files[0]);
    }
  };

  const validateRegisterForm = async () => {
    validateRequiredFieldsReg(form);
    await validateUserNameRegAsync(form.username);
    await validateEmailRegAsync(form.email);
    await validatePhoneNumberAsync(form.phoneNumber);
    validatePassword(form.password);
    validatePhoto(image);
  };

  const register = async (event) => {
    try {
      event.preventDefault();
      await validateRegisterForm();

      const url = await uploadPhoto(image);
      if (!url) {
        throw new Error('Photo upload failed. Please try again.');
      }
      const userCredential = await registerUser(form.email, form.password);

      await createUser(
        userCredential.user.uid,
        form.username,
        userCredential.user.email,
        form.phoneNumber,
        form.firstName,
        form.lastName,
        url,
        form.age,
        form.weight,
        form.height,
        form.activityLevel,
        form.gender
      );

      const snapshot = await getUserData(userCredential.user.uid);
      const userData = snapshot.val() ? Object.values(snapshot.val())[0] : null;
      setAppState((prev) => ({ ...prev, user: userCredential.user, userData }));
      alertHelper(setMessage, setSuccess, 'User registered successfully!');
      navigate('/register-additional-info');
    } catch (error) {
      alertHelper(setMessage, setAlert, error.message);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <>
      <div
        id='register'
        className='hero min-h-screen bg-base-300'
      >
        <div className='hero-content flex-col lg:flex-row-reverse'>
          <div className='text-center lg:text-left'>
            <h1 className='text-5xl font-bold'>Register!</h1>
            <p className='py-6'>Join our journey!</p>
          </div>
          <div className='card shrink-0 w-full max-w-sm shadow-2xl bg-base-100'>
            <form className='card-body '>
              <div className='flex flex-col'>
                <label className='flex items-center select-none justify-between px-1 py-2'>
                  <span className='text-sm'>
                    Username: <span className='text-red-600'>*</span>
                  </span>
                </label>
                <input
                  onChange={updateForm('username')}
                  type='text'
                  placeholder='username'
                  className='input w-full'
                  required
                  value={form.username}
                />
              </div>
              <div className='flex flex-col'>
                <label className='flex items-center select-none justify-between px-1 py-2'>
                  <span className='text-sm'>
                    Email: <span className='text-red-600'>*</span>
                  </span>
                </label>
                <input
                  onChange={updateForm('email')}
                  type='email'
                  placeholder='email'
                  className='input w-full'
                  required
                  value={form.email}
                />
              </div>

              <div className='flex flex-col'>
                <label className='flex items-center select-none justify-between px-1 py-2'>
                  <span className='text-sm'>
                    Phone: <span className='text-red-600'>*</span>
                  </span>
                </label>
                <input
                  onChange={updateForm('phoneNumber')}
                  type='number'
                  placeholder='+359 123-456-789'
                  className='input no-spinners w-full'
                  pattern='[0-9]{3}-[0-9]{3}-[0-9]{3}'
                  required
                  value={form.phoneNumber}
                />
              </div>
              <div className='flex flex-col'>
                <label className='flex items-center select-none justify-between px-1 py-2'>
                  <span className='text-sm'>
                    Password: <span className='text-red-600'>*</span>
                  </span>
                </label>
                <input
                  onChange={updateForm('password')}
                  type='password'
                  placeholder='password'
                  className='input w-full'
                  required
                  value={form.password}
                />
              </div>
              <div className='flex flex-col'>
                <label className='flex items-center select-none justify-between px-1 py-2'>
                  <span className='text-sm'>
                    Upload Photo <span className='text-red-600'>*</span>
                  </span>
                </label>
                <input
                  onChange={handleFileChange}
                  type='file'
                  accept='image/*'
                  placeholder='avatar'
                  className='file-input w-full max-w-xs'
                />
              </div>
              <div className='flex flex-col mt-6'>
                <button
                  onClick={register}
                  className='btn btn-primary '
                >
                  Register
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
