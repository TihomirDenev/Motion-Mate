import { useNavigate } from 'react-router';
import { usePageTitle } from '../../hooks/usePageTitle';
import EditProfileInfo from '../../components/EditProfileInfo/EditProfilePhoto/EditProfileInfo';
import { useTranslation } from '../../i18n/useTranslation';

export default function RegisterAdditionalInfo() {
  const { t } = useTranslation();
  usePageTitle(`Motion Mate | ${t('titles.onboarding')}`);
  const navigate = useNavigate();
  return (
    <EditProfileInfo
      onboarding
      setEditProfile={() => navigate('/', { replace: true })}
    />
  );
}
