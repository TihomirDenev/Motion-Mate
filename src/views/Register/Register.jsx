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
import { useTranslation } from '../../i18n/useTranslation';

export default function Register() {
  const { t } = useTranslation();
  usePageTitle(`Motion Mate | ${t('titles.register')}`);
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
        if (!avatar) throw new Error(t('register.photoFailed'));
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
          ? t('register.emailInUse')
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
          alt={t('register.imageAlt')}
        />
        <div className='auth-visual-shade' />
        <span className='auth-visual-kicker'>{t('register.kicker')}</span>
        <div>
          <span className='icon-tile'>
            <Icon
              name='sparkles'
              size={25}
            />
          </span>
          <h2>
            {t('register.visualTitleLine1')}
            <br />
            {t('register.visualTitleLine2')}
          </h2>
          <p>{t('register.visualText')}</p>
          <ul className='auth-benefits'>
            <li>
              <Icon
                name='check'
                size={16}
              />
              {t('register.benefit1')}
            </li>
            <li>
              <Icon
                name='check'
                size={16}
              />
              {t('register.benefit2')}
            </li>
            <li>
              <Icon
                name='check'
                size={16}
              />
              {t('register.benefit3')}
            </li>
          </ul>
        </div>
      </aside>
      <section className='auth-form-panel'>
        <p className='eyebrow'>{t('register.eyebrow')}</p>
        <h1>
          {t('register.title')}
          <span>.</span>
        </h1>
        <p className='auth-description'>{t('register.description')}</p>
        <form
          onSubmit={submit}
          className='form-stack'
        >
          <FormField
            label={t('fields.username')}
            required
            name='username'
            autoComplete='username'
            autoCapitalize='none'
            spellCheck={false}
            minLength={2}
            maxLength={20}
            placeholder={t('register.usernamePlaceholder')}
            value={form.username}
            onChange={change('username')}
          />
          <FormField
            label={t('fields.email')}
            required
            name='email'
            type='email'
            autoComplete='email'
            placeholder='you@example.com'
            value={form.email}
            onChange={change('email')}
          />
          <FormField
            label={t('fields.phone')}
            required
            name='phone'
            type='tel'
            autoComplete='tel-national'
            inputMode='numeric'
            pattern='[0-9]{10}'
            minLength={10}
            maxLength={10}
            placeholder='0888123456'
            hint={t('register.phoneHint')}
            value={form.phoneNumber}
            onChange={change('phoneNumber')}
          />
          <FormField
            label={t('fields.password')}
            required
            name='password'
            type='password'
            autoComplete='new-password'
            minLength={6}
            maxLength={15}
            placeholder={t('register.passwordPlaceholder')}
            hint={t('register.passwordHint')}
            value={form.password}
            onChange={change('password')}
          />
          <FormField
            label={t('fields.photo')}
            type='file'
            accept='image/jpeg,image/png,image/webp,image/gif'
            hint={t('register.photoHint')}
            onChange={(event) => setImage(event.target.files?.[0] || null)}
          />
          <InlineMessage>{error}</InlineMessage>
          <button
            type='submit'
            className='btn btn-primary btn-full'
            disabled={busy}
          >
            {t(busy ? 'register.submitting' : 'register.submit')}
            <Icon
              name='arrow'
              size={18}
            />
          </button>
        </form>
        <p className='auth-switch'>
          {t('register.haveAccount')}{' '}
          <Link to='/login'>
            {t('register.login')}{' '}
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
