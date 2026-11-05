import { useContext, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { deleteUser } from 'firebase/auth';
import { registerUser } from '../../services/auth.service';
import { createUser, uploadPhoto } from '../../services/users.service';
import { AppContext } from '../../context/AppContext';
import {
  validatePassword,
  validateEmailRegAsync,
  validateUserNameRegAsync,
  validatePhoneNumberAsync,
  validatePhoto,
} from '../../common/user.validations';
import { usePageTitle } from '../../hooks/usePageTitle';
import Icon from '../../components/UI/Icon';
import FormField from '../../components/UI/FormField';
import InlineMessage from '../../components/UI/InlineMessage';

export default function Register() {
  usePageTitle('Motion Mate | Your day one');
  const { userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(false);
  const change = (key) => (event) =>
    setForm((form) => ({ ...form, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    let credential;
    let profileCreated = false;
    try {
      const username = form.username.trim();
      const email = form.email.trim();
      validatePassword(form.password);
      await Promise.all([
        validateUserNameRegAsync(username),
        validateEmailRegAsync(email),
        validatePhoneNumberAsync(form.phoneNumber),
      ]);
      let avatar = '';
      if (image) {
        validatePhoto(image);
        avatar = await uploadPhoto(image);
        if (!avatar)
          throw new Error(
            'Your photo couldn’t be uploaded. Try another image or add it later.'
          );
      }
      credential = await registerUser(email, form.password);
      await createUser(
        credential.user.uid,
        username,
        email,
        form.phoneNumber,
        '',
        '',
        avatar,
        '',
        '',
        '',
        '',
        ''
      );
      profileCreated = true;
      setRegistered(true);
      navigate('/register-additional-info', { replace: true });
    } catch (error) {
      if (credential && !profileCreated)
        await deleteUser(credential.user).catch(() => {});
      setError(
        error.code === 'auth/email-already-in-use'
          ? 'This email already has an account. Try logging in.'
          : error.message
      );
    } finally {
      setBusy(false);
    }
  };

  if (userData && !busy && !registered)
    return (
      <Navigate
        to='/'
        replace
      />
    );
  return (
    <div className='auth-layout register-layout page-enter'>
      <aside className='auth-visual'>
        <img
          src='/images/yoga.jpg'
          alt='A group making time for movement outdoors'
        />
        <div className='auth-visual-shade' />
        <span className='auth-visual-kicker'>
          A LITTLE MOVEMENT CHANGES EVERYTHING.
        </span>
        <div>
          <span className='icon-tile'>
            <Icon
              name='sparkles'
              size={25}
            />
          </span>
          <h2>
            Meet your
            <br />
            next chapter.
          </h2>
          <p>
            Your goals. Your people. Your kind of movement. It all starts with
            showing up.
          </p>
          <ul className='auth-benefits'>
            <li>
              <Icon
                name='check'
                size={16}
              />
              Workouts that work for you
            </li>
            <li>
              <Icon
                name='check'
                size={16}
              />
              Progress you can feel
            </li>
            <li>
              <Icon
                name='check'
                size={16}
              />
              A community in your corner
            </li>
          </ul>
        </div>
      </aside>
      <section className='auth-form-panel'>
        <p className='eyebrow'>THIS IS YOUR DAY ONE</p>
        <h1>
          Make your move<span>.</span>
        </h1>
        <p className='auth-description'>
          A healthier everyday is closer than you think.
        </p>
        <form
          onSubmit={submit}
          className='form-stack'
        >
          <FormField
            label='Username'
            required
            name='username'
            autoComplete='username'
            autoCapitalize='none'
            spellCheck={false}
            minLength={2}
            maxLength={20}
            placeholder='Pick a name that feels like you'
            value={form.username}
            onChange={change('username')}
          />
          <FormField
            label='Email address'
            required
            name='email'
            type='email'
            autoComplete='email'
            placeholder='you@example.com'
            value={form.email}
            onChange={change('email')}
          />
          <FormField
            label='Phone number'
            required
            name='phone'
            type='tel'
            autoComplete='tel-national'
            inputMode='numeric'
            pattern='[0-9]{10}'
            minLength={10}
            maxLength={10}
            placeholder='0888123456'
            hint='10 digits, including the leading zero.'
            value={form.phoneNumber}
            onChange={change('phoneNumber')}
          />
          <FormField
            label='Password'
            required
            name='password'
            type='password'
            autoComplete='new-password'
            minLength={6}
            maxLength={15}
            placeholder='Create your password'
            hint='Use 6–15 characters.'
            value={form.password}
            onChange={change('password')}
          />
          <FormField
            label='Profile photo'
            type='file'
            accept='image/jpeg,image/png,image/webp,image/gif'
            hint='Optional. You can always add one later. Maximum 5 MB.'
            onChange={(event) => setImage(event.target.files?.[0] || null)}
          />
          <InlineMessage>{error}</InlineMessage>
          <button
            type='submit'
            className='btn btn-primary btn-full'
            disabled={busy}
          >
            {busy ? 'Creating your space…' : 'Create my account'}
            <Icon
              name='arrow'
              size={18}
            />
          </button>
        </form>
        <p className='auth-switch'>
          Already a Motion Mate?{' '}
          <Link to='/login'>
            Welcome back{' '}
            <Icon
              name='arrowUp'
              size={13}
            />
          </Link>
        </p>
      </section>
    </div>
  );
}
