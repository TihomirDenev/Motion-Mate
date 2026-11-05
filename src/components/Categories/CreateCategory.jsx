import { useState } from 'react';
import { createCategory } from '../../services/category.service';
import { uploadCategoryPhoto } from '../../services/users.service';
import { validateCategoryForm } from '../../common/category.validations';
import { validatePhoto } from '../../common/user.validations';
import Icon from '../UI/Icon';
import Modal from '../UI/Modal';
import FormField from '../UI/FormField';
import InlineMessage from '../UI/InlineMessage';

export default function CreateCategory({ onCategoryCreated }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      validateCategoryForm(name.trim(), description.trim(), image);
      if (/[.#$[\]/]/.test(name))
        throw new Error('Use a name without dots, slashes, brackets, #, or $.');
      validatePhoto(image);
      const url = await uploadCategoryPhoto(image);
      await createCategory(name.trim(), description.trim(), url);
      onCategoryCreated?.();
      setOpen(false);
      setName('');
      setDescription('');
      setImage(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <button
        className='btn btn-ghost'
        onClick={() => {
          setError('');
          setOpen(true);
        }}
      >
        <Icon
          name='plus'
          size={16}
        />
        Category
      </button>
      <Modal
        open={open}
        onClose={() => !busy && setOpen(false)}
        title='A new way to move'
        description='Create a category for your community’s exercise library.'
      >
        <form
          className='form-stack'
          onSubmit={submit}
        >
          <FormField
            label='Category name'
            required
            minLength={5}
            maxLength={20}
            placeholder='e.g. Mobility flow'
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <FormField
            label='Short description'
            required
            maxLength={40}
            placeholder='A few words to inspire movement'
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <FormField
            label='Cover photo'
            type='file'
            accept='image/jpeg,image/png,image/webp,image/gif'
            required
            hint='Choose a landscape image. Maximum 5 MB.'
            onChange={(event) => setImage(event.target.files?.[0] || null)}
          />
          <InlineMessage>{error}</InlineMessage>
          <div className='dialog-actions'>
            <button
              type='button'
              className='btn btn-ghost'
              disabled={busy}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={busy}
            >
              {busy ? 'Creating…' : 'Create category'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
