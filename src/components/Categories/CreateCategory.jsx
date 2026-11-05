import { useState } from 'react';
import { createCategory } from '../../services/category.service';
import { uploadCategoryPhoto } from '../../services/users.service';
import { validateCategoryForm } from '../../common/category.validations';
import { validatePhoto } from '../../common/user.validations';
import Icon from '../UI/Icon';
import Modal from '../UI/Modal';
import FormField from '../UI/FormField';
import InlineMessage from '../UI/InlineMessage';
import { useTranslation } from '../../i18n/useTranslation';

export default function CreateCategory({ onCategoryCreated }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation();
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      validateCategoryForm(name.trim(), description.trim(), image);
      if (/[.#$[\]/]/.test(name))
        throw new Error(t('errors.categoryCharacters'));
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
        {t('category.button')}
      </button>
      <Modal
        open={open}
        onClose={() => !busy && setOpen(false)}
        title={t('category.title')}
        description={t('category.description')}
      >
        <form
          className='form-stack'
          onSubmit={submit}
        >
          <FormField
            label={t('category.name')}
            required
            minLength={5}
            maxLength={20}
            placeholder={t('category.namePlaceholder')}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <FormField
            label={t('category.shortDescription')}
            required
            maxLength={40}
            placeholder={t('category.descriptionPlaceholder')}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <FormField
            label={t('category.cover')}
            type='file'
            accept='image/jpeg,image/png,image/webp,image/gif'
            required
            hint={t('category.coverHint')}
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
              {t('common.cancel')}
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={busy}
            >
              {t(busy ? 'common.creating' : 'category.submit')}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
