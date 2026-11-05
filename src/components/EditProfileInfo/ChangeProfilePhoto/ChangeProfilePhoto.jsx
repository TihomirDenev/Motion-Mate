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

export default function ChangeProfilePhoto({ setChangeProfilePhoto }) {
  const { userData } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
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
      if (!url)
        throw new Error('Your photo couldn’t be uploaded. Please try again.');
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
        back={{ to: '/my-profile', label: 'My profile' }}
        eyebrow='A FAMILIAR FACE'
        title='Make it look like you.'
        description='Give your Motion Mates a face to cheer on.'
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
            <span>Looking good already</span>
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
                  alt='Preview of your new profile photo'
                />
                <span>Your fresh look</span>
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
          <h2>A little more personality</h2>
          <p>Choose a clear photo you love. We’ll take care of the rest.</p>
          <FormField
            label='Choose your photo'
            type='file'
            accept='image/jpeg,image/png,image/webp,image/gif'
            hint='JPG, PNG, WebP or GIF · Up to 5 MB'
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
            Cancel
          </button>
          <button
            className='btn btn-primary'
            type='submit'
            disabled={!file || busy}
          >
            {busy ? 'Uploading…' : 'Save my photo'}
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
