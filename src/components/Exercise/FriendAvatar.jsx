import { useEffect, useState } from 'react';
import { getUserAvatar } from '../../services/users.service';
import userPhoto from '../../assets/userPhoto.png';
import { handleAvatarError } from '../../helper/avatar-fallback';

export const FriendAvatar = ({ username }) => {
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const fetchAndSetAvatar = async () => {
      const url = await getUserAvatar(username);
      setAvatarUrl(url);
    };

    fetchAndSetAvatar();
  }, [username]);

  return (
    <img
      src={avatarUrl || userPhoto}
      onError={handleAvatarError}
      alt={`${username}'s avatar`}
    />
  );
};
