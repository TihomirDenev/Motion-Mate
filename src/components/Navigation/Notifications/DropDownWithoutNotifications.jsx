import bellIcon from '../../../assets/bellIcon.png';

export default function DropDownNoNotifications() {
  return (
    <div>
      <div className='relative flex mr-2'>
        <img
          src={bellIcon}
          alt='bell'
          className='w-12'
        />
      </div>

      <ul
        tabIndex={0}
        className='text-center dropdown-content z-[1] menu p-2 shadow-sm bg-base-100 rounded-box w-80 border border-gray-400 absolute right-0'
      >
        <p>
          <strong>You don`t have notifications</strong>
        </p>
      </ul>
    </div>
  );
}
