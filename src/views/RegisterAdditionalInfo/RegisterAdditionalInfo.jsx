import { useNavigate } from 'react-router';
import { usePageTitle } from '../../hooks/usePageTitle';
import EditProfileInfo from '../../components/EditProfileInfo/EditProfilePhoto/EditProfileInfo';

export default function RegisterAdditionalInfo() {
  usePageTitle('Motion Mate | Make yourself at home');
  const navigate = useNavigate();
  return (
    <EditProfileInfo
      onboarding
      setEditProfile={() => navigate('/', { replace: true })}
    />
  );
}
