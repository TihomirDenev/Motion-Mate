import userPhoto from '../assets/userPhoto.png';

export const handleAvatarError = (event) => {
  const image = event.currentTarget;
  if (image.dataset.fallback) return;
  image.dataset.fallback = 'true';
  image.src = userPhoto;
};
