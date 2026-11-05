import { FriendAvatar } from './FriendAvatar';
import InfoBite from './InfoBite';
import { handleAvatarError } from '../../helper/avatar-fallback';

export const ExerciseCard = ({ exercise, userData }) => {
  return (
    <>
      <div className='mb-2'>
        <div className='avatar flex items-center mb-3'>
          <div className='w-12 mr-3 rounded-full border-2 border-primary'>
            {exercise?.createdBy !== userData?.username ? (
              <FriendAvatar username={exercise?.createdBy} />
            ) : (
              <img
                src={userData.avatar}
                onError={handleAvatarError}
                alt='user avatar'
              />
            )}
          </div>

          <div className='username aspect-auto!'>
            <small className='block text-xs'>Created By</small>
            <strong>{exercise.createdBy}</strong>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div>
            <small className='block text-xs'>Exercise</small>
            <h3 className='card-title text-lg font-bold '>{exercise.title}</h3>
          </div>

          <div>
            <small className='block text-xs'>Duration</small>

            <strong className='text-primary'>{`${exercise.duration?.hours}h : ${exercise.duration?.minutes}m : ${exercise.duration?.seconds}s`}</strong>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2 '>
        <InfoBite
          isBlock
          title={'Content'}
          content={exercise.content}
        />

        <InfoBite
          isBlock
          title={'Calories'}
          content={exercise.calories + ' kcal'}
        />

        <InfoBite
          title={'Level'}
          content={exercise.level}
        />
      </div>
    </>
  );
};
