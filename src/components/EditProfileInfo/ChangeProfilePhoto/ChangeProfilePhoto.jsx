import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import {
  updateUserByUsername,
  uploadPhoto,
} from '../../../services/users.service';
import { validatePhoto } from '../../../common/user.validations';
import PageHeader from '../../UI/PageHeader';
import Avatar from '../../UI/Avatar';
import Icon from '../../UI/Icon';
import FormField from '../../UI/FormField';
import InlineMessage from '../../UI/InlineMessage';
import { useTranslation } from '../../../i18n/useTranslation';

export default function ChangeProfilePhoto({ setChangeProfilePhoto }) {
  const { userData } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { t } = useTranslation();
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );
  const choose = (event) => {
    const image = event.target.files?.[0];
    if (!image) return;
    setError('');
    try {
      validatePhoto(image);
      setFile(image);
      setPreview(URL.createObjectURL(image));
    } catch (error) {
      setError(error.message);
      event.target.value = '';
    }
  };
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      validatePhoto(file);
      const url = await uploadPhoto(file);
      if (!url) throw new Error(t('photo.uploadFailed'));
      await updateUserByUsername(userData.username, { avatar: url });
      setChangeProfilePhoto(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className='photo-editor page-enter'>
      <PageHeader
        back={{ to: '/my-profile', label: t('nav.profile') }}
        eyebrow={t('photo.eyebrow')}
        title={t('photo.title')}
        description={t('photo.description')}
      />
      <form
        className='surface photo-editor-card'
        onSubmit={submit}
      >
        <div className='photo-preview-row'>
          <div>
            <Avatar
              user={userData}
              size='xl'
            />
            <span>{t('photo.current')}</span>
          </div>
          {preview && (
            <>
              <Icon
                name='arrow'
                size={24}
              />
              <div>
                <img
                  className='new-photo-preview'
                  src={preview}
                  alt={t('photo.previewAlt')}
                />
                <span>{t('photo.new')}</span>
              </div>
            </>
          )}
        </div>
        <div className='photo-upload-area'>
          <span className='icon-tile tone-mint'>
            <Icon
              name='camera'
              size={26}
            />
          </span>
          <h2>{t('photo.uploadTitle')}</h2>
          <p>{t('photo.uploadText')}</p>
          <FormField
            label={t('photo.choose')}
            type='file'
            accept='image/jpeg,image/png,image/webp,image/gif'
            hint={t('photo.hint')}
            onChange={choose}
          />
        </div>
        <InlineMessage>{error}</InlineMessage>
        <div className='dialog-actions'>
          <button
            className='btn btn-ghost'
            type='button'
            disabled={busy}
            onClick={() => setChangeProfilePhoto(false)}
          >
            {t('common.cancel')}
          </button>
          <button
            className='btn btn-primary'
            type='submit'
            disabled={!file || busy}
          >
            {t(busy ? 'photo.uploading' : 'photo.save')}
            <Icon
              name='check'
              size={16}
            />
          </button>
        </div>
      </form>
    </div>
  );
}
