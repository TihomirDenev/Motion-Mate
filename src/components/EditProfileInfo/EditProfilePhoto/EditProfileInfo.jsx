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

export default function EditProfileInfo({
  setEditProfile,
  onboarding = false,
}) {
  const { userData } = useContext(AppContext);
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
          !onboarding ? { to: '/my-profile', label: 'My profile' } : undefined
        }
        eyebrow={
          onboarding
            ? 'YOUR SPACE IS READY · STEP 02 / 02'
            : 'MAKE THIS SPACE YOURS'
        }
        title={
          onboarding ? 'Let’s get to know you.' : 'The details that make you.'
        }
        description={
          onboarding
            ? 'A few details make your wellness insights more personal. You can also add them later.'
            : 'A little update for a more personal experience.'
        }
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
                <h2>A little about you</h2>
                <p>The person behind the progress.</p>
              </div>
            </div>
            <div className='form-stack'>
              <div className='form-grid'>
                <FormField
                  label='First name'
                  autoComplete='given-name'
                  placeholder='First name'
                  value={form.firstName}
                  onChange={change('firstName')}
                />
                <FormField
                  label='Last name'
                  autoComplete='family-name'
                  placeholder='Last name'
                  value={form.lastName}
                  onChange={change('lastName')}
                />
              </div>
              {!onboarding && (
                <FormField
                  label='Phone number'
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
                  label='Age (years)'
                  type='number'
                  min={10}
                  max={100}
                  placeholder='Your age'
                  value={form.age}
                  onChange={change('age')}
                />
                <FormField
                  label='Sex for calculations'
                  value={form.gender}
                  onChange={change('gender')}
                >
                  <option value=''>Not specified</option>
                  <option value='Female'>Female</option>
                  <option value='Male'>Male</option>
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
                <h2>Your starting point</h2>
                <p>Personalize your wellness snapshot.</p>
              </div>
            </div>
            <div className='form-stack'>
              <div className='form-grid'>
                <FormField
                  label='Weight (kg)'
                  type='number'
                  step='any'
                  min={20}
                  max={500}
                  placeholder='e.g. 70'
                  value={form.weight}
                  onChange={change('weight')}
                />
                <FormField
                  label='Height (cm)'
                  type='number'
                  step='any'
                  min={50}
                  max={300}
                  placeholder='e.g. 175'
                  value={form.height}
                  onChange={change('height')}
                />
              </div>
              <FormField
                label='Your activity level'
                value={form.activityLevel}
                onChange={change('activityLevel')}
              >
                <option value=''>Choose your rhythm</option>
                {activityLevels.map((level) => (
                  <option
                    key={level.value}
                    value={level.value}
                  >
                    {level.label}
                  </option>
                ))}
              </FormField>
              <div className='profile-edit-tip'>
                <Icon
                  name='sparkles'
                  size={18}
                />
                <p>
                  Your health details help tailor your hydration, energy, and
                  body balance estimates.
                </p>
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
            {onboarding ? 'I’ll do this later' : 'Discard changes'}
          </button>
          <button
            className='btn btn-primary'
            type='submit'
            disabled={busy}
          >
            {busy
              ? 'Saving your details…'
              : onboarding
                ? 'Find my momentum'
                : 'Save my changes'}
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
