import { useContext, useEffect, useState } from 'react';
import { getUserByUsername } from '../../services/users.service';
import GoalButton from './GoalButton';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router';
import AlertError from '../Alerts/AlertError/AlertError';
import { alertHelper } from '../../helper/alert-helper';
import TimeLeft from './TimeLeft';
import Progress from './Progress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import AlertSuccess from '../Alerts/AlertSuccess/AlertSuccess';
import { deleteGoal } from '../../services/goal.service';
import { handleAvatarError } from '../../helper/avatar-fallback';

export default function Goal({ id, owner, name, from, to, progress, type }) {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const [showError, setShowError] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  const [ownerObj, setOwnerObj] = useState({
    avatar: '',
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleDetailsClick = () => {
    navigate(`/goals/${id}`);
  };

  const handleDeleteClick = async (user) => {
    try {
      await deleteGoal(user, id);
      alertHelper(setShowMessage, setShowDeleted, 'Goal deleted successfully!');
    } catch (error) {
      alertHelper(setShowMessage, setShowError, error.message);
    }
  };

  useEffect(() => {
    const goalOwner = async () => {
      try {
        const res = await getUserByUsername(owner);
        setOwnerObj(res.val());
      } catch (error) {
        alertHelper(setShowMessage, setShowError, error.message);
      }
    };

    goalOwner();
  }, [owner]);

  return (
    <>
      <th>
        <div className={'flex items-center gap-3'}>
          <div className='avatar'>
            <div className='mask mask-squircle w-12 h-12'>
              <img
                src={ownerObj?.avatar}
                onError={handleAvatarError}
                alt={`Avatar of ${ownerObj?.firstName} ${ownerObj?.lastName}`}
              />
            </div>
          </div>
          <div>
            <div className='font-bold'>
              {ownerObj?.firstName} {ownerObj?.lastName}
            </div>
            <div className='text-sm opacity-50'>{ownerObj?.email}</div>
          </div>
        </div>
      </th>
      <td>{name}</td>
      <td>
        <TimeLeft goal={{ name, owner, progress, timePeriod: { from, to } }} />
      </td>
      <td className='first-letter:uppercase'>{type}</td>
      {type && (
        <td>
          <Progress progress={progress} />
        </td>
      )}
      <td className='flex items-center h-28'>
        {userData?.username === owner && (
          <GoalButton
            primary={false}
            title={'Details'}
            styles='btn-primary mx-2'
            onClick={handleDetailsClick}
          />
        )}
        {(userData?.username === owner || userData?.userRole === 'admin') && (
          <GoalButton
            primary={false}
            styles='btn-warning '
            onClick={() => handleDeleteClick(owner)}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </GoalButton>
        )}
        {showDeleted && <AlertSuccess message={showMessage} />}
        {showError && <AlertError message={showMessage} />}
      </td>
    </>
  );
}
