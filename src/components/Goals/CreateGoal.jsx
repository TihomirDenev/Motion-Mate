import { useContext, useState } from 'react';
import { createGoal } from '../../services/goal.service';
import { AppContext } from '../../context/AppContext';
import { validateGoalForm } from '../../common/goal.validations';
import {
  GOAL_MAX_CALORIES,
  GOAL_MAX_EXERCISES,
  GOAL_MAX_PROGRESS,
  GOAL_MIN_CALORIES,
  GOAL_MIN_EXERCISES,
  GOAL_MIN_PROGRESS,
} from '../../common/constants';
import AlertSuccess from '../Alerts/AlertSuccess/AlertSuccess';
import AlertError from '../Alerts/AlertError/AlertError';
import { alertHelper } from '../../helper/alert-helper';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function CreateGoal() {
  const { userData } = useContext(AppContext);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setAlertMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setForm({
      ...form,
      from: start,
      to: end,
    });
  };

  const [form, setForm] = useState({
    name: '',
    from: '',
    to: '',
    type: 'manual',
    exercises: GOAL_MIN_EXERCISES,
    calories: GOAL_MIN_CALORIES,
    progress: GOAL_MIN_PROGRESS,
  });

  const formClearObject = {
    name: '',
    from: '',
    to: '',
    type: 'manual',
    exercises: GOAL_MIN_EXERCISES,
    calories: GOAL_MIN_CALORIES,
    progress: GOAL_MIN_PROGRESS,
  };

  const updateForm = (props) => (e) => {
    setForm((form) => ({
      ...form,
      [props]: e.target.value,
    }));
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      validateGoalForm(
        form.name,
        userData?.username,
        new Date(form.from).getTime(),
        new Date(form.to).getTime()
      );

      await createGoal(
        form.name,
        userData.username,
        new Date(form.from).getTime(),
        new Date(form.to).getTime(),
        form.type,
        Number(form.exercises),
        Number(form.progress),
        Number(form.calories)
      );
      setForm(formClearObject);
      setStartDate(null);
      setEndDate(null);

      document.getElementById('my_modal_3').close();
      alertHelper(setAlertMessage, setShowSuccess, 'Goal Created!');
    } catch (error) {
      alertHelper(setAlertMessage, setShowError, error.message);
    }
  };

  const handleCloseModal = (e) => {
    e.preventDefault();
    setForm(formClearObject);
    setStartDate(null);
    setEndDate(null);
    document.getElementById('my_modal_3').close();
  };

  return (
    <>
      <button
        className='btn btn-primary self-center w-1/2'
        onClick={() => document.getElementById('my_modal_3').showModal()}
      >
        Create Goal
      </button>
      <dialog
        id='my_modal_3'
        className='modal'
      >
        <div className='modal-box'>
          <div
            method='dialog'
            className='flex place-content-end relative right-0 top-0 w-full h-7'
          >
            <button
              type='button'
              className='btn btn-sm btn-circle btn-outline'
              onClick={(e) => {
                handleCloseModal(e);
              }}
            >
              ✕
            </button>
          </div>
          <h2 className='text-center text-2xl font-bold text-primary'>
            Create Goal
          </h2>
          <label className='flex items-center select-none justify-between px-1 py-2 flex-col self-center text-justify font-semibold text-primary'>
            Your progress will be calculated based on the goal type you select
            below and the time frame you set.
            <span className='text-secondary'>
              You can not change the goal type after creating the goal.
            </span>
          </label>
          <div className='flex flex-col gap-1'>
            <label className='input flex items-center gap-2 shadow-xl text-primary w-full'>
              Name
              <input
                type='text'
                className='grow'
                placeholder='Goal Name'
                value={form.name}
                onChange={updateForm('name')}
              />
            </label>
            <label className='flex items-center select-none justify-between px-1 py-2 self-center text-justify font-semibold text-primary'>
              Select Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={onChange}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              inline
            />

            <label className='flex items-center select-none justify-between px-1 py-2 self-center text-justify font-semibold text-primary'>
              Select your goal type
            </label>
            <div className='flex w-full'>
              <div className='grid h-20 grow card bg-base-300 rounded-box place-items-center shadow-2xl'>
                <div className='flex flex-col'>
                  <label className='flex items-center select-none justify-between px-1 py-2 cursor-pointer gap-1'>
                    <span className='text-sm'>Exercises</span>
                    <input
                      type='radio'
                      name='radio-10'
                      className='radio checked:bg-blue-500'
                      onChange={() => setForm({ ...form, type: 'exercises' })}
                      checked={form.type === 'exercises' ? true : false}
                    />
                  </label>
                </div>
              </div>
              <div className='divider divider-horizontal'>OR</div>
              <div className='grid h-20 grow card bg-base-300 rounded-box place-items-center shadow-2xl'>
                <div className='flex flex-col'>
                  <label className='flex items-center select-none justify-between px-1 py-2 cursor-pointer gap-1'>
                    <span className='text-sm'>Manual progress</span>
                    <input
                      type='radio'
                      name='radio-10'
                      className='radio checked:bg-blue-500'
                      onChange={() => setForm({ ...form, type: 'manual' })}
                      checked={form.type === 'manual' ? true : false}
                    />
                  </label>
                </div>
              </div>
              <div className='divider divider-horizontal'>OR</div>
              <div className='grid h-20 grow card bg-base-300 rounded-box place-items-center shadow-2xl'>
                <div className='flex flex-col'>
                  <label className='flex items-center select-none justify-between px-1 py-2 cursor-pointer gap-1'>
                    <span className='text-sm'>Calories</span>
                    <input
                      type='radio'
                      name='radio-10'
                      className='radio checked:bg-blue-500'
                      onChange={() => setForm({ ...form, type: 'calories' })}
                      checked={form.type === 'calories' ? true : false}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className='mt-4 mb-3 justify-center shadow-xl'>
              {form.type === 'exercises' && (
                <label className='input flex items-center gap-2 w-full'>
                  Exercises
                  <input
                    type='number'
                    className='grow'
                    placeholder='Exercises'
                    value={form.exercises}
                    min={GOAL_MIN_EXERCISES}
                    max={GOAL_MAX_EXERCISES}
                    onChange={updateForm('exercises')}
                    checked={form.type === 'exercises' ? true : false}
                  />
                </label>
              )}
              {form.type === 'manual' && (
                <label className='input flex items-center gap-2 w-full'>
                  Progress {form.progress}%
                  <input
                    type='range'
                    className='grow'
                    placeholder='Progress'
                    min={GOAL_MIN_PROGRESS}
                    max={GOAL_MAX_PROGRESS}
                    value={form.progress}
                    onChange={updateForm('progress')}
                    checked={form.type === 'manual' ? true : false}
                  />
                </label>
              )}
              {form.type === 'calories' && (
                <label className='input flex items-center gap-2 w-full'>
                  Calories
                  <input
                    type='number'
                    className='grow'
                    placeholder='Calories'
                    min={GOAL_MIN_CALORIES}
                    max={GOAL_MAX_CALORIES}
                    value={form.calories}
                    onChange={updateForm('calories')}
                    checked={form.type === 'calories' ? true : false}
                  />
                </label>
              )}
            </div>
          </div>
          <div
            method='dialog'
            className='flex gap-2 place-content-end relative right-0 top-0 w-full h-7'
          >
            <button
              type='button'
              className='btn btn-sm btn-primary'
              onClick={handleCreateGoal}
            >
              Create
            </button>
            |
            <button
              type='button'
              className='btn btn-sm btn-warning'
              onClick={(e) => {
                handleCloseModal(e);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
        {showError && <AlertError message={`${errorMessage}!`} />}
      </dialog>
      {showSuccess && <AlertSuccess message='Goal Created!' />}
    </>
  );
}
