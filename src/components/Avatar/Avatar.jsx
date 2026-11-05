import userPhoto from '../../assets/userPhoto.png';
import { handleAvatarError } from '../../helper/avatar-fallback';

export default function SizedAvatar({ user }) {
  return (
    <figure className='m-2 rounded-r-2xl'>
      {user?.avatar ? (
        <img
          src={user?.avatar}
          onError={handleAvatarError}
          title='Profile Photo'
          alt='userPhoto'
          className='w-60 h-60 rounded-2xl'
        />
      ) : (
        <img
          src={userPhoto}
          alt='userPhoto'
          title='Missing Profile Photo'
          className='w-80 h-80 rounded-2xl'
        />
      )}
    </figure>
  );
}
