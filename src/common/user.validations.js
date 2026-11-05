import { translate } from '../i18n/i18n';
import { getAllUsers, getUserByUsername } from '../services/users.service';
import {
  AGE_MAX,
  AGE_MIN,
  HEIGHT_MAX,
  HEIGHT_MIN,
  MAX_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  PHONE_NUMBER_LENGTH,
  WEIGHT_MAX,
  WEIGHT_MIN,
} from './constants';

export const validateRequiredFieldsReg = (form) => {
  if (
    form.username === '' ||
    form.email === '' ||
    form.password === '' ||
    form.phoneNumber === ''
  ) {
    throw new Error(translate('errors.requiredFields'));
  }
};

export const validateUserNameRegAsync = async (username) => {
  if (!/^[a-zA-Z0-9_-]+$/.test(username))
    throw new Error(translate('errors.usernameCharacters'));
  if (
    username.length < MIN_USERNAME_LENGTH ||
    username.length > MAX_USERNAME_LENGTH
  ) {
    throw new Error(
      translate('errors.usernameLength', {
        min: MIN_USERNAME_LENGTH,
        max: MAX_USERNAME_LENGTH,
      })
    );
  }
  const userObject = await getUserByUsername(username);
  const userData = userObject.val();
  if (userData?.username) {
    throw new Error(translate('errors.usernameTaken'));
  }
};

export const validateEmailRegAsync = async (email) => {
  if (!email.includes('@') || !email.includes('.')) {
    throw new Error(translate('errors.emailInvalid'));
  }
  const snapshot = await getAllUsers();
  const allUsers = Object.values(snapshot.val() || {});
  const userEmail = allUsers.find((user) => user.email === email);
  if (userEmail) {
    throw new Error(translate('errors.emailTaken'));
  }
};

export const validatePhoneNumberAsync = async (phoneNumber) => {
  if (phoneNumber.length !== PHONE_NUMBER_LENGTH) {
    throw new Error(
      translate('errors.phoneLength', { length: PHONE_NUMBER_LENGTH })
    );
  }
  if (!/^\d+$/.test(phoneNumber)) {
    throw new Error(translate('errors.phoneDigits'));
  }
  const snapshot = await getAllUsers();
  const allUsers = Object.values(snapshot.val() || {});
  const userPhoneNumber = allUsers.find(
    (user) => user.phoneNumber === phoneNumber
  );
  if (userPhoneNumber) {
    throw new Error(translate('errors.phoneTaken'));
  }
};

export const validatePassword = (password) => {
  if (
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    throw new Error(
      translate('errors.passwordLength', {
        min: MIN_PASSWORD_LENGTH,
        max: MAX_PASSWORD_LENGTH,
      })
    );
  }
};

export const validatePhoto = (photo) => {
  if (!photo) {
    throw new Error(translate('errors.photoRequired'));
  }
  if (
    !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(photo.type)
  )
    throw new Error(translate('errors.photoType'));
  if (photo.size > 5 * 1024 * 1024)
    throw new Error(translate('errors.photoSize'));
};

export const validateRequiredFieldsLogUsername = (form) => {
  if (form.username === '' || form.password === '') {
    throw new Error(translate('errors.allFields'));
  }
};

export const validateUserNameLogAsync = async (username) => {
  if (
    username.length < MIN_USERNAME_LENGTH ||
    username.length > MAX_USERNAME_LENGTH
  ) {
    throw new Error(
      translate('errors.usernameLength', {
        min: MIN_USERNAME_LENGTH,
        max: MAX_USERNAME_LENGTH,
      })
    );
  }
  const userObject = await getUserByUsername(username);
  const userData = userObject.val();
  if (!userData?.username) {
    throw new Error(translate('errors.usernameMissing'));
  }
};

export const validateRequiredFieldsLogEmail = (form) => {
  if (form.email === '' || form.password === '') {
    throw new Error(translate('errors.allFields'));
  }
};

export const validateEmailLogAsync = async (email) => {
  if (!email.includes('@') || !email.includes('.')) {
    throw new Error(translate('errors.emailInvalid'));
  }
  const snapshot = await getAllUsers();
  const allUsers = Object.values(snapshot.val() || {});
  const userEmail = allUsers.find((user) => user.email === email);
  if (!userEmail) {
    throw new Error(translate('errors.emailMissing'));
  }
};

export const validateFirstName = (firstName) => {
  const alphabeticRegex = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
  if (
    firstName.length < MIN_NAME_LENGTH ||
    firstName.length > MAX_NAME_LENGTH
  ) {
    throw new Error(
      translate('errors.firstNameLength', {
        min: MIN_NAME_LENGTH,
        max: MAX_NAME_LENGTH,
      })
    );
  }
  if (!alphabeticRegex.test(firstName)) {
    throw new Error(translate('errors.firstNameLetters'));
  }
};

export const validateLastName = (lastName) => {
  const alphabeticRegex = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
  if (lastName.length < MIN_NAME_LENGTH || lastName.length > MAX_NAME_LENGTH) {
    throw new Error(
      translate('errors.lastNameLength', {
        min: MIN_NAME_LENGTH,
        max: MAX_NAME_LENGTH,
      })
    );
  }
  if (!alphabeticRegex.test(lastName)) {
    throw new Error(translate('errors.lastNameLetters'));
  }
};

export const validateAge = (age) => {
  if (age < AGE_MIN || age > AGE_MAX) {
    throw new Error(
      translate('errors.ageRange', { min: AGE_MIN, max: AGE_MAX })
    );
  }
};

export const validateWeight = (weight) => {
  if (weight < WEIGHT_MIN || weight > WEIGHT_MAX) {
    throw new Error(
      translate('errors.weightRange', { min: WEIGHT_MIN, max: WEIGHT_MAX })
    );
  }
};

export const validateHeight = (height) => {
  if (height < HEIGHT_MIN || height > HEIGHT_MAX) {
    throw new Error(
      translate('errors.heightRange', { min: HEIGHT_MIN, max: HEIGHT_MAX })
    );
  }
};

export const validateFieldsForAdditionalInfo = (form) => {
  if (
    form.firstName === '' &&
    form.lastName === '' &&
    form.age === '' &&
    form.weight === '' &&
    form.height === '' &&
    form.activityLevel === ''
  ) {
    throw new Error(translate('errors.oneField'));
  }
};
