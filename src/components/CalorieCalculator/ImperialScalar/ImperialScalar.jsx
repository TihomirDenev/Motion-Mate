import {
  AGE_MAX,
  AGE_MIN,
  HEIGHT_MAX_IN,
  HEIGHT_MIN_IN,
  WEIGHT_MAX_LBS,
  WEIGHT_MIN_LBS,
} from '../../../common/constants';

export default function ImperialScalar({ form, updateForm }) {
  return (
    <div className='mt-2'>
      <div>
        <label htmlFor='weight'>Weight in lbs:</label>
        <input
          type='number'
          min={WEIGHT_MIN_LBS}
          max={WEIGHT_MAX_LBS}
          name='weight'
          placeholder='Pounds'
          value={form?.weight}
          onChange={updateForm('weight')}
          className='border-2 border-gray-500 rounded-sm p-2 m-2 bg-gray-200 shadow-xl text-black w-28'
        />
        <label htmlFor='height'>Height in in:</label>
        <input
          type='number'
          min={HEIGHT_MIN_IN}
          max={HEIGHT_MAX_IN}
          name='height'
          placeholder='Inches'
          value={form?.height}
          onChange={updateForm('height')}
          className='border-2 border-gray-500 rounded-sm p-2 m-2 bg-gray-200 shadow-xl text-black w-32'
        />
        <label htmlFor='age'>Age:</label>
        <input
          type='number'
          name='age'
          placeholder='Age'
          min={AGE_MIN}
          max={AGE_MAX}
          value={form?.age}
          onChange={updateForm('age')}
          className='border-2 border-gray-500 rounded-sm p-2 m-2 bg-gray-200 shadow-xl text-black w-20'
        />
      </div>
      <div className='mt-4'>
        <label htmlFor='Gender'>Gender: </label>
        <select
          value={form?.gender}
          onChange={updateForm('gender')}
          className='border-2 border-gray-500 rounded-sm p-2 mr-4 ml-1 bg-gray-200 shadow-xl text-black w-44'
        >
          <option value='Male'>Male</option>
          <option value='Female'>Female</option>
        </select>
        <label htmlFor='activity-level'>Activity Level: </label>
        <select
          value={form?.activityLevel}
          onChange={updateForm('activityLevel')}
          className='border-2 border-gray-500 rounded-sm p-2 ml-1 bg-gray-200 shadow-xl text-black w-44'
        >
          <option value='Sedentary'>Sedentary</option>
          <option value='Lightly-Active'>Lightly Active</option>
          <option value='Moderately-Active'>Moderately Active</option>
          <option value='Very-Active'>Very Active</option>
        </select>
      </div>
    </div>
  );
}
