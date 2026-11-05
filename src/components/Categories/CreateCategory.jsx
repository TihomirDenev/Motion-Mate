import { useState } from 'react';
import { createCategory } from '../../services/category.service';
import { uploadCategoryPhoto } from '../../services/users.service';
import { validateCategoryForm } from '../../common/category.validations';
import { alertHelper } from '../../helper/alert-helper';
import AlertError from '../Alerts/AlertError/AlertError';
import AlertSuccess from '../Alerts/AlertSuccess/AlertSuccess';

const CreateCategory = ({ onCategoryCreated }) => {
  const [image, setImage] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [category, setCategory] = useState({
    name: '',
    description: '',
  });

  const updateCategory = (e, prop) => {
    setCategory({
      ...category,
      [prop]: e.target.value,
    });
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files[0]) {
      setImage(files[0]);
    }
  };

  const submitCategory = async () => {
    try {
      validateCategoryForm(category.name, category.description, image);
      const catUrl = await uploadCategoryPhoto(image);

      await createCategory(category.name, category.description, catUrl);
      onCategoryCreated();
      setCategory({
        name: '',
        description: '',
      });
      setImage(null);
      document.getElementById('category-create-modal').close();
      alertHelper(
        setAlertMessage,
        setShowSuccess,
        'Successfully created category!'
      );
    } catch (error) {
      alertHelper(setAlertMessage, setShowError, error.message);
    }
  };

  return (
    <div>
      <button
        className='btn btn-outline btn-primary'
        onClick={() =>
          document.getElementById('category-create-modal').showModal()
        }
      >
        Create Category
      </button>

      <dialog
        id='category-create-modal'
        className='modal'
      >
        <div className='modal-box '>
          <h3 className='font-bold text-lg mb-3'>Create New Category</h3>

          <label className='input flex items-center mb-3 select-primary w-full'>
            <input
              type='text'
              className='grow'
              placeholder='Name'
              value={category.name}
              onChange={(e) => updateCategory(e, 'name')}
            />
          </label>
          <label className='input flex items-center mb-3 select-primary w-full'>
            <input
              type='text'
              className='grow'
              placeholder='Description'
              value={category.description}
              onChange={(e) => updateCategory(e, 'description')}
            />
          </label>

          <label className='input flex items-center mb-3 select-primary w-full'>
            <input
              type='file'
              accept='image/*'
              className='grow'
              onChange={handleFileChange}
            />
          </label>
          <div className='flex flex-row gap-6'>
            <button
              className='btn btn-outline btn-primary'
              onClick={submitCategory}
            >
              Create
            </button>
            <form method='dialog'>
              <button className='btn btn-outline btn-primary'>Close</button>
            </form>
          </div>
        </div>
      </dialog>
      {showError && <AlertError message={alertMessage} />}
      {showSuccess && <AlertSuccess message={alertMessage} />}
    </div>
  );
};

export default CreateCategory;
