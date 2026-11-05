import { useContext, useEffect, useState } from 'react';
import {
  deleteCategory,
  getAllCategories,
} from '../../services/category.service';
import { CreateExercise } from '../Exercise/CreateExercise';
import CreateCategory from './CreateCategory';
import { DeleteIcon } from './DeleteIcon';
import { alertHelper } from '../../helper/alert-helper';
import { useNavigate } from 'react-router';
import AlertError from '../Alerts/AlertError/AlertError';
import AlertSuccess from '../Alerts/AlertSuccess/AlertSuccess';
import { APP_NAME } from '../../common/constants';
import { AppContext } from '../../context/AppContext';
import { usePageTitle } from '../../hooks/usePageTitle';

const Categories = () => {
  usePageTitle(`${APP_NAME} | Exercises`);

  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const [showError, setShowError] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  const navigateToExercise = (category) => {
    navigate(`/exercises/${category?.category}`);
  };

  const [reloadKey, setReloadKey] = useState(0);

  const fetchCategories = () => setReloadKey((key) => key + 1);

  const handleDelete = async (category) => {
    try {
      await deleteCategory(category.category, category.id);
      fetchCategories();
      alertHelper(
        setAlertMessage,
        setShowSuccess,
        'Successfully deleted category!'
      );
    } catch (error) {
      alertHelper(setAlertMessage, setShowError, error.message);
    }
  };

  useEffect(() => {
    getAllCategories()
      .then(setAllCategories)
      .catch((error) => console.error('Error fetching categories:', error));
  }, [reloadKey]);

  return (
    <div className='flex flex-col'>
      <>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>
            Here you can browse through different category exercises. <br />{' '}
            <br /> You can also{' '}
            {userData?.userRole === 'admin' && (
              <>
                <span className='inline-block'>
                  <CreateCategory onCategoryCreated={fetchCategories} />
                </span>{' '}
                and{' '}
              </>
            )}
            <span className='inline-block'>
              <CreateExercise />
            </span>
          </h1>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8'>
          {allCategories.length > 0 &&
            allCategories.map((category) => (
              <div
                className='card max-h-[400px] bg-base-100 shadow-xl image-full relative'
                key={category.id}
              >
                <figure>
                  <img
                    className='w-full'
                    src={category.imageUrl}
                    alt={category.category}
                  />
                </figure>
                <div className='card-body text-xl'>
                  {userData?.userRole === 'admin' && (
                    <button
                      onClick={() => handleDelete(category)}
                      className='absolute top-2 right-2'
                    >
                      <DeleteIcon />
                    </button>
                  )}

                  <h2 className='card-title text-white'>{category.category}</h2>
                  <p className='text-white opacity-70'>
                    {category.description}
                  </p>
                  <div className='flex flex-row'></div>
                  <button
                    onClick={() => navigateToExercise(category)}
                    className='btn btn-primary'
                  >
                    Join Now
                  </button>
                </div>
              </div>
            ))}
        </div>
      </>

      {showError && <AlertError message={alertMessage} />}
      {showSuccess && <AlertSuccess message={alertMessage} />}
    </div>
  );
};

export default Categories;
