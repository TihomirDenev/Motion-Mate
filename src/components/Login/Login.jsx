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
import { useTranslation } from '../../i18n/useTranslation';

export default function Login() {
  const { t } = useTranslation();
  usePageTitle(`Motion Mate | ${t('titles.login')}`);
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
        t(
          error.code === 'auth/too-many-requests'
            ? 'login.tooManyAttempts'
            : error.code === 'auth/network-request-failed'
              ? 'errors.network'
              : 'login.invalid'
        )
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
      setResetStatus(t('login.resetSent'));
    } catch {
      setResetError(t('login.resetFailed'));
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
          alt={t('login.imageAlt')}
        />
        <div className='auth-visual-shade' />
        <span className='auth-visual-kicker'>{t('login.kicker')}</span>
        <div>
          <span className='icon-tile'>
            <Icon
              name='activity'
              size={26}
            />
          </span>
          <h2>
            {t('login.visualTitleLine1')}
            <br />
            {t('login.visualTitleLine2')}
          </h2>
          <p>{t('login.visualText')}</p>
          <span className='auth-photo-caption'>{t('login.visualCaption')}</span>
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
          {t('login.backHome')}
        </Link>
        <p className='eyebrow'>{t('login.eyebrow')}</p>
        <h1>
          {t('login.title')}
          <span>.</span>
        </h1>
        <p className='auth-description'>{t('login.description')}</p>
        <div
          className='segmented-control auth-mode'
          role='group'
          aria-label={t('login.method')}
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
              {t(value === 'username' ? 'fields.username' : 'fields.email')}
            </button>
          ))}
        </div>
        <form
          onSubmit={submit}
          className='form-stack'
        >
          <FormField
            label={t(mode === 'username' ? 'fields.username' : 'fields.email')}
            type={mode === 'username' ? 'text' : 'email'}
            name={mode}
            autoComplete='username'
            autoCapitalize='none'
            spellCheck={false}
            required
            placeholder={
              mode === 'username'
                ? t('login.usernamePlaceholder')
                : 'you@example.com'
            }
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
          />
          <FormField
            label={t('fields.password')}
            type='password'
            name='password'
            autoComplete='current-password'
            required
            placeholder={t('login.passwordPlaceholder')}
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
            {t('login.forgot')}
          </button>
          <InlineMessage>{error}</InlineMessage>
          <button
            className='btn btn-primary btn-full'
            type='submit'
            disabled={busy}
          >
            {t(busy ? 'login.submitting' : 'login.submit')}
            <Icon
              name='arrow'
              size={18}
            />
          </button>
        </form>
        <p className='auth-switch'>
          {t('login.newHere')}{' '}
          <Link to='/register'>
            {t('login.createAccount')}{' '}
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
          {t('login.footnote')}
        </div>
      </section>
      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title={t('login.resetTitle')}
        description={t('login.resetDescription')}
      >
        <form
          onSubmit={reset}
          className='form-stack'
        >
          <FormField
            label={t('fields.email')}
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
            {t(busy ? 'login.resetSending' : 'login.resetSubmit')}
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
