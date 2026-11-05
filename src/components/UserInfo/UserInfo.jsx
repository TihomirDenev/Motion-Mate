import InfoBite from '../Exercise/InfoBite';

export default function UserInfo({ userData }) {
  const firstName = userData?.firstName || '';
  const lastName = userData?.lastName || '';

  const fullName = `${
    userData?.firstName || userData?.lastName
      ? `${firstName} ${lastName}`
      : 'N/A'
  }`;

  return (
    <>
      <div className='flex flex-col gap-2'>
        <InfoBite
          title={'Full Name'}
          content={fullName}
        />

        <InfoBite
          title={'Gender'}
          content={userData?.gender || 'N/A'}
        />

        <InfoBite
          title={'Email'}
          content={userData?.email || 'N/A'}
        />

        <InfoBite
          title={'Phone'}
          content={userData?.phoneNumber || 'N/A'}
        />

        <InfoBite
          title={'Age'}
          content={userData?.age || 'N/A'}
        />

        <InfoBite
          title={'Weight'}
          content={userData?.weight || 'N/A'}
        />

        <InfoBite
          title={'Height'}
          content={userData?.height || 'N/A'}
        />

        <InfoBite
          title={'Activity Level'}
          content={userData?.activityLevel || 'N/A'}
        />
      </div>
    </>
  );
}
