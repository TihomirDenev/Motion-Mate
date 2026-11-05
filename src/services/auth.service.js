import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../config/firebase-config.js';
import { getUserByUsername } from './users.service.js';

export const registerUser = (email, password) => {
  try {
    return createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const loginUser = (email, password) => {
  try {
    return signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const loginUserByUsername = async (username, password) => {
  try {
    const user = await getUserByUsername(username);
    if (!user.exists()) {
      throw new Error('No user found with this username');
    }
    const { email } = user.val();
    return signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const logoutUser = () => {
  try {
    return signOut(auth);
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};
