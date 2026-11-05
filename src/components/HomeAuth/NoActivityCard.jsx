import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const NoActivityCard = ({ onClick, icon, title, content }) => {
  return (
    <div className='card w-96 bg-base-300 m-2 shadow-xl'>
      <div className='card-body p-4'>
        <div className='flex justify-between items-center'>
          <h2 className='card-title text-lg font-bold'>{title}</h2>
          <FontAwesomeIcon
            icon={icon}
            size='2x'
          />
        </div>
        <p className='mt-2'>{content}</p>
        <div className='card-actions justify-end mt-4'>
          <button
            onClick={onClick}
            className='btn btn-secondary'
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};
