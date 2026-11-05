import {
  AGE_MAX,
  AGE_MIN,
  HEIGHT_MAX,
  HEIGHT_MIN,
  WEIGHT_MAX,
  WEIGHT_MIN,
} from '../../../common/constants';

export default function MetricScalar({ form, updateForm }) {
  return (
    <div className='mt-2'>
      <div>
        <label htmlFor='weight'>Weight in kg:</label>
        <input
          type='number'
          min={WEIGHT_MIN}
          max={WEIGHT_MAX}
          name='weight'
          placeholder='Kilograms'
          value={form?.weight}
          onChange={updateForm('weight')}
          className='border-2 border-gray-500 rounded-sm p-2 m-2 bg-gray-200 shadow-xl text-black w-28'
        />
        <label htmlFor='height'>Height in cm:</label>
        <input
          type='number'
          min={HEIGHT_MIN}
          max={HEIGHT_MAX}
          name='height'
          placeholder='Centimeters'
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
