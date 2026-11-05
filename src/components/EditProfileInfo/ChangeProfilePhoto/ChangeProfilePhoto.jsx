import { useContext, useState } from 'react';
import { AppContext } from '../../../context/AppContext';
import {
  updateUserByUsername,
  uploadPhoto,
} from '../../../services/users.service';
import { FriendAvatar } from '../../Exercise/FriendAvatar';

export default function ChangeProfilePhoto({ setChangeProfilePhoto }) {
  const { userData } = useContext(AppContext);
  const [imageUpload, setImageUpload] = useState(null);

  const uploadNewProfilePhoto = async () => {
    if (!imageUpload) {
      setImageUpload(null);
      return alert('Error: Please select an image');
    }
    const url = await uploadPhoto(imageUpload);
    if (!url) {
      return alert('Error: Photo upload failed. Please try again.');
    }
    await updateUserByUsername(userData?.username, { avatar: url });

    setImageUpload(null);
    setChangeProfilePhoto(false);
  };

  return (
    <div className='flex flex-col text-center'>
      <div className='text-xl mb-4'>
        <p>
          Greetings, {userData?.username}! Ready to give your profile a
          makeover?
        </p>
        <p>Upload or change your profile photo here.</p>
      </div>
      <div className='border-2 border-gray-500 bg-base-300 rounded-sm p-4 shadow-lg flex flex-col items-center'>
        <div className='flex items-center'>
          <div className='avatar'>
            <div className='w-64 mr-12 rounded-full border-2 border-primary'>
              <FriendAvatar username={userData?.username} />
            </div>
          </div>

          <div className='text-center'>
            {imageUpload !== null && (
              <div>
                <h2 className='font-bold underline'>New Profile Photo: </h2>

                <div className='avatar'>
                  <div className='w-64 max-w-full rounded-full mt-2 border-2 border-primary'>
                    <img
                      src={URL.createObjectURL(imageUpload)}
                      alt='Profile Photo'
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='mt-5 flex flex-row'>
          <input
            type='file'
            accept='image/*'
            name='profilePhoto'
            id='profilePhoto'
            onChange={(e) => setImageUpload(e.target.files[0])}
            className='file-input file-input-primary w-full max-w-xs mr-2'
          />
          <button
            className='btn btn-primary mr-2'
            onClick={() => uploadNewProfilePhoto()}
          >
            Save Changes
          </button>
          <button
            className='btn btn-error'
            onClick={() => setChangeProfilePhoto(false)}
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
}
