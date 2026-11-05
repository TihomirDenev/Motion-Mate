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
    throw new Error('Please fill all required fields.');
  }
};

export const validateUserNameRegAsync = async (username) => {
  if (!/^[a-zA-Z0-9_-]+$/.test(username))
    throw new Error(
      'Use letters, numbers, underscores, or hyphens for your username.'
    );
  if (
    username.length < MIN_USERNAME_LENGTH ||
    username.length > MAX_USERNAME_LENGTH
  ) {
    throw new Error(
      `User Name name must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters long!`
    );
  }
  const userObject = await getUserByUsername(username);
  const userData = userObject.val();
  if (userData?.username) {
    throw new Error('User with this username already exists!');
  }
};

export const validateEmailRegAsync = async (email) => {
  if (!email.includes('@') || !email.includes('.')) {
    throw new Error('Please enter a valid email address.');
  }
  const snapshot = await getAllUsers();
  const allUsers = Object.values(snapshot.val() || {});
  const userEmail = allUsers.find((user) => user.email === email);
  if (userEmail) {
    throw new Error('User with this email already exists!');
  }
};

export const validatePhoneNumberAsync = async (phoneNumber) => {
  if (phoneNumber.length !== PHONE_NUMBER_LENGTH) {
    throw new Error(`Phone number must be ${PHONE_NUMBER_LENGTH} digits long!`);
  }
  if (!/^\d+$/.test(phoneNumber)) {
    throw new Error('Phone number must contain only digits!');
  }
  const snapshot = await getAllUsers();
  const allUsers = Object.values(snapshot.val() || {});
  const userPhoneNumber = allUsers.find(
    (user) => user.phoneNumber === phoneNumber
  );
  if (userPhoneNumber) {
    throw new Error('User with this phone number already exists!');
  }
};

export const validatePassword = (password) => {
  if (
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    throw new Error(
      `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters long!`
    );
  }
};

export const validatePhoto = (photo) => {
  if (!photo) {
    throw new Error('Please upload a photo.');
  }
  if (
    !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(photo.type)
  )
    throw new Error('Choose a JPG, PNG, WebP, or GIF image.');
  if (photo.size > 5 * 1024 * 1024)
    throw new Error('Choose an image smaller than 5 MB.');
};

export const validateRequiredFieldsLogUsername = (form) => {
  if (form.username === '' || form.password === '') {
    throw new Error('Please fill in all fields.');
  }
};

export const validateUserNameLogAsync = async (username) => {
  if (
    username.length < MIN_USERNAME_LENGTH ||
    username.length > MAX_USERNAME_LENGTH
  ) {
    throw new Error(
      `User Name name must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters long!`
    );
  }
  const userObject = await getUserByUsername(username);
  const userData = userObject.val();
  if (!userData?.username) {
    throw new Error('User with this username does not exist!');
  }
};

export const validateRequiredFieldsLogEmail = (form) => {
  if (form.email === '' || form.password === '') {
    throw new Error('Please fill in all fields.');
  }
};

export const validateEmailLogAsync = async (email) => {
  if (!email.includes('@') || !email.includes('.')) {
    throw new Error('Please enter a valid email address.');
  }
  const snapshot = await getAllUsers();
  const allUsers = Object.values(snapshot.val() || {});
  const userEmail = allUsers.find((user) => user.email === email);
  if (!userEmail) {
    throw new Error('User with this email does not exist!');
  }
};

export const validateFirstName = (firstName) => {
  const alphabeticRegex = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
  if (
    firstName.length < MIN_NAME_LENGTH ||
    firstName.length > MAX_NAME_LENGTH
  ) {
    throw new Error(
      `First name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters long!`
    );
  }
  if (!alphabeticRegex.test(firstName)) {
    throw new Error('First name must contain only alphabetic characters!');
  }
};

export const validateLastName = (lastName) => {
  const alphabeticRegex = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
  if (lastName.length < MIN_NAME_LENGTH || lastName.length > MAX_NAME_LENGTH) {
    throw new Error(
      `Last name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters long!`
    );
  }
  if (!alphabeticRegex.test(lastName)) {
    throw new Error('Last name must contain only alphabetic characters!');
  }
};

export const validateAge = (age) => {
  if (age < AGE_MIN || age > AGE_MAX) {
    throw new Error(`Age must be between ${AGE_MIN} and ${AGE_MAX}.`);
  }
};

export const validateWeight = (weight) => {
  if (weight < WEIGHT_MIN || weight > WEIGHT_MAX) {
    throw new Error(
      `Weight must be between ${WEIGHT_MIN} kg and ${WEIGHT_MAX} kg.`
    );
  }
};

export const validateHeight = (height) => {
  if (height < HEIGHT_MIN || height > HEIGHT_MAX) {
    throw new Error(
      `Height must be between ${HEIGHT_MIN} cm and ${HEIGHT_MAX} cm.`
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
    throw new Error('Please fill in at least one of the fields!');
  }
};
