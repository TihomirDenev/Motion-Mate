import { get, push, ref, remove } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getAllCategories = async () => {
  try {
    const snapshot = await get(ref(db, 'categories'));
    const data = snapshot.val();

    if (!snapshot.exists()) return [];

    const exercises = [];
    Object.keys(data).forEach((category) => {
      Object.keys(data[category]).forEach((categoryId) => {
        exercises.push({
          id: categoryId,
          category,
          ...data[category][categoryId],
        });
      });
    });

    return exercises;
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const createCategory = async (name, description, imageUrl) => {
  const category = {
    description,
    imageUrl,
  };

  try {
    const result = await push(ref(db, `categories/${name}`), category);
    return result.key;
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};

export const deleteCategory = async (categoryName, categoryId) => {
  try {
    const data = ref(db, `categories/${categoryName}/${categoryId}`);
    await remove(data);
  } catch (error) {
    throw new Error(error.message, { cause: error });
  }
};
