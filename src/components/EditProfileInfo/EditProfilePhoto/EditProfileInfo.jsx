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
import { activityLevels, normalizeActivity } from '../../../helper/wellness';
import PageHeader from '../../UI/PageHeader';
import FormField from '../../UI/FormField';
import Icon from '../../UI/Icon';
import InlineMessage from '../../UI/InlineMessage';
import { useTranslation } from '../../../i18n/useTranslation';

export default function EditProfileInfo({
  setEditProfile,
  onboarding = false,
}) {
  const { userData } = useContext(AppContext);
  const { t } = useTranslation();
  const [form, setForm] = useState(() => ({
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    age: userData.age || '',
    weight: userData.weight || '',
    height: userData.height || '',
    activityLevel: normalizeActivity(userData.activityLevel),
    gender: userData.gender || '',
    phoneNumber: String(userData.phoneNumber || ''),
  }));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const change = (key) => (event) =>
    setForm((value) => ({ ...value, [key]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (form.firstName) validateFirstName(form.firstName.trim());
      if (form.lastName) validateLastName(form.lastName.trim());
      if (form.age !== '') validateAge(Number(form.age));
      if (form.weight !== '') validateWeight(Number(form.weight));
      if (form.height !== '') validateHeight(Number(form.height));
      if (form.phoneNumber !== String(userData.phoneNumber || ''))
        await validatePhoneNumberAsync(form.phoneNumber);
      await updateUserByUsername(userData.username, {
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        age: form.age === '' ? '' : Number(form.age),
        weight: form.weight === '' ? '' : Number(form.weight),
        height: form.height === '' ? '' : Number(form.height),
      });
      setEditProfile(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className='profile-editor page-enter'>
      <PageHeader
        back={
          !onboarding
            ? { to: '/my-profile', label: t('nav.profile') }
            : undefined
        }
        eyebrow={t(
          onboarding ? 'editProfile.onboardingEyebrow' : 'editProfile.eyebrow'
        )}
        title={t(
          onboarding ? 'editProfile.onboardingTitle' : 'editProfile.title'
        )}
        description={t(
          onboarding
            ? 'editProfile.onboardingDescription'
            : 'editProfile.description'
        )}
      />
      <form onSubmit={submit}>
        <div className='profile-edit-grid'>
          <section className='surface surface-padding'>
            <div className='form-section-heading'>
              <span className='icon-tile tone-mint'>
                <Icon
                  name='user'
                  size={22}
                />
              </span>
              <div>
                <h2>{t('editProfile.aboutTitle')}</h2>
                <p>{t('editProfile.aboutText')}</p>
              </div>
            </div>
            <div className='form-stack'>
              <div className='form-grid'>
                <FormField
                  label={t('fields.firstName')}
                  autoComplete='given-name'
                  placeholder={t('fields.firstName')}
                  value={form.firstName}
                  onChange={change('firstName')}
                />
                <FormField
                  label={t('fields.lastName')}
                  autoComplete='family-name'
                  placeholder={t('fields.lastName')}
                  value={form.lastName}
                  onChange={change('lastName')}
                />
              </div>
              {!onboarding && (
                <FormField
                  label={t('fields.phone')}
                  type='tel'
                  inputMode='numeric'
                  required
                  pattern='[0-9]{10}'
                  maxLength={10}
                  autoComplete='tel-national'
                  value={form.phoneNumber}
                  onChange={change('phoneNumber')}
                />
              )}
              <div className='form-grid'>
                <FormField
                  label={t('fields.age')}
                  type='number'
                  min={10}
                  max={100}
                  placeholder={t('editProfile.agePlaceholder')}
                  value={form.age}
                  onChange={change('age')}
                />
                <FormField
                  label={t('fields.sex')}
                  value={form.gender}
                  onChange={change('gender')}
                >
                  <option value=''>{t('editProfile.notSpecified')}</option>
                  <option value='Female'>{t('gender.Female')}</option>
                  <option value='Male'>{t('gender.Male')}</option>
                </FormField>
              </div>
            </div>
          </section>
          <section className='surface surface-padding'>
            <div className='form-section-heading'>
              <span className='icon-tile tone-lavender'>
                <Icon
                  name='heart'
                  size={22}
                />
              </span>
              <div>
                <h2>{t('editProfile.startingTitle')}</h2>
                <p>{t('editProfile.startingText')}</p>
              </div>
            </div>
            <div className='form-stack'>
              <div className='form-grid'>
                <FormField
                  label={t('fields.weightKg')}
                  type='number'
                  step='any'
                  min={20}
                  max={500}
                  placeholder={t('common.example', { value: 70 })}
                  value={form.weight}
                  onChange={change('weight')}
                />
                <FormField
                  label={t('fields.heightCm')}
                  type='number'
                  step='any'
                  min={50}
                  max={300}
                  placeholder={t('common.example', { value: 175 })}
                  value={form.height}
                  onChange={change('height')}
                />
              </div>
              <FormField
                label={t('fields.activityLevel')}
                value={form.activityLevel}
                onChange={change('activityLevel')}
              >
                <option value=''>{t('editProfile.chooseRhythm')}</option>
                {activityLevels.map((level) => (
                  <option
                    key={level.value}
                    value={level.value}
                  >
                    {t(`activity.${level.value}.label`)}
                  </option>
                ))}
              </FormField>
              <div className='profile-edit-tip'>
                <Icon
                  name='sparkles'
                  size={18}
                />
                <p>{t('editProfile.tip')}</p>
              </div>
            </div>
          </section>
        </div>
        <InlineMessage>{error}</InlineMessage>
        <div className='profile-edit-actions'>
          <button
            className='btn btn-ghost'
            type='button'
            disabled={busy}
            onClick={() => setEditProfile(false)}
          >
            {t(onboarding ? 'editProfile.later' : 'editProfile.discard')}
          </button>
          <button
            className='btn btn-primary'
            type='submit'
            disabled={busy}
          >
            {t(
              busy
                ? 'editProfile.saving'
                : onboarding
                  ? 'editProfile.finishOnboarding'
                  : 'editProfile.save'
            )}
            <Icon
              name={onboarding ? 'arrow' : 'check'}
              size={17}
            />
          </button>
        </div>
      </form>
    </div>
  );
}
