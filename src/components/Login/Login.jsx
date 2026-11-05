import { useContext, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase-config';
import { AppContext } from '../../context/AppContext';
import { loginUser, loginUserByUsername } from '../../services/auth.service';
import { usePageTitle } from '../../hooks/usePageTitle';
import Icon from '../UI/Icon';
import FormField from '../UI/FormField';
import InlineMessage from '../UI/InlineMessage';
import Modal from '../UI/Modal';

export default function Login() {
  usePageTitle('Motion Mate | Welcome back');
  const { userData } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState('username');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const [resetError, setResetError] = useState('');
  const redirect = location.state?.from?.pathname || '/';

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await (mode === 'username' ? loginUserByUsername : loginUser)(
        identifier.trim(),
        password
      );
      navigate(redirect, { replace: true });
    } catch (error) {
      setError(
        error.code === 'auth/too-many-requests'
          ? 'Too many attempts. Give it a moment and try again.'
          : error.code === 'auth/network-request-failed'
            ? 'We couldn’t connect. Check your connection and try again.'
            : 'That login doesn’t look right. Check your details and try again.'
      );
    } finally {
      setBusy(false);
    }
  };
  const reset = async (event) => {
    event.preventDefault();
    setBusy(true);
    setResetError('');
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetStatus(
        'If an account uses this email, a reset link is on its way. Check your inbox.'
      );
    } catch {
      setResetError(
        'We couldn’t send the link. Check the email and try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  if (userData && !busy)
    return (
      <Navigate
        to={redirect}
        replace
      />
    );
  return (
    <div className='auth-layout page-enter'>
      <aside className='auth-visual'>
        <img
          src='/images/runner.jpg'
          alt='Runner enjoying a quiet moment outdoors'
        />
        <div className='auth-visual-shade' />
        <span className='auth-visual-kicker'>
          YOUR JOURNEY IS STILL UNFOLDING.
        </span>
        <div>
          <span className='icon-tile'>
            <Icon
              name='activity'
              size={26}
            />
          </span>
          <h2>
            Pick up
            <br />
            your momentum.
          </h2>
          <p>
            Big changes start with the little things you do for yourself.
            Welcome back to your space.
          </p>
          <span className='auth-photo-caption'>
            MOVE WITH INTENTION. LIVE WITH ENERGY.
          </span>
        </div>
      </aside>
      <section className='auth-form-panel'>
        <Link
          to='/'
          className='back-link'
        >
          <Icon
            name='back'
            size={16}
          />
          Back to home
        </Link>
        <p className='eyebrow'>LET’S KEEP MOVING</p>
        <h1>
          Good to see you<span>.</span>
        </h1>
        <p className='auth-description'>
          Your next good day starts right here.
        </p>
        <div
          className='segmented-control auth-mode'
          role='group'
          aria-label='Sign-in method'
        >
          {['username', 'email'].map((value) => (
            <button
              key={value}
              type='button'
              aria-pressed={mode === value}
              onClick={() => {
                setMode(value);
                setIdentifier('');
                setError('');
              }}
            >
              {value === 'username' ? 'Username' : 'Email address'}
            </button>
          ))}
        </div>
        <form
          onSubmit={submit}
          className='form-stack'
        >
          <FormField
            label={mode === 'username' ? 'Username' : 'Email address'}
            type={mode === 'username' ? 'text' : 'email'}
            name={mode}
            autoComplete='username'
            autoCapitalize='none'
            spellCheck={false}
            required
            placeholder={
              mode === 'username' ? 'Your username' : 'you@example.com'
            }
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
          />
          <FormField
            label='Password'
            type='password'
            name='password'
            autoComplete='current-password'
            required
            placeholder='Your password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            className='forgot-password text-button'
            type='button'
            onClick={() => {
              setResetOpen(true);
              setResetStatus('');
              setResetError('');
            }}
          >
            Forgot your password?
          </button>
          <InlineMessage>{error}</InlineMessage>
          <button
            className='btn btn-primary btn-full'
            type='submit'
            disabled={busy}
          >
            {busy ? 'Signing you in…' : 'Let’s get moving'}
            <Icon
              name='arrow'
              size={18}
            />
          </button>
        </form>
        <p className='auth-switch'>
          New around here?{' '}
          <Link to='/register'>
            Create an account{' '}
            <Icon
              name='arrowUp'
              size={13}
            />
          </Link>
        </p>
        <div className='auth-footnote'>
          <Icon
            name='heart'
            size={14}
          />{' '}
          A little better. Every single day.
        </div>
      </section>
      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title='A fresh start'
        description='Enter your account email and we’ll help you reset your password.'
      >
        <form
          onSubmit={reset}
          className='form-stack'
        >
          <FormField
            label='Email address'
            type='email'
            autoComplete='email'
            required
            value={resetEmail}
            placeholder='you@example.com'
            onChange={(event) => setResetEmail(event.target.value)}
          />
          <InlineMessage>{resetError}</InlineMessage>
          <InlineMessage type='success'>{resetStatus}</InlineMessage>
          <button
            className='btn btn-primary btn-full'
            disabled={busy || Boolean(resetStatus)}
            type='submit'
          >
            {busy ? 'Sending…' : 'Send reset link'}
            <Icon
              name='mail'
              size={16}
            />
          </button>
        </form>
      </Modal>
    </div>
  );
}
