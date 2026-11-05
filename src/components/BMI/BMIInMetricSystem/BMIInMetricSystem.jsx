import {
  HEIGHT_MAX,
  HEIGHT_MIN,
  WEIGHT_MAX,
  WEIGHT_MIN,
} from '../../../common/constants';

export default function BMIInMetricSystem({ form, updateForm }) {
  return (
    <div className='mt-2'>
      <label htmlFor='weight'>Weight in kg: </label>
      <input
        type='number'
        min={WEIGHT_MIN}
        max={WEIGHT_MAX}
        name='weight'
        placeholder='Kilograms'
        value={form?.weight}
        onChange={updateForm('weight')}
        className='border-2 border-gray-500 rounded-sm p-2 mr-6 bg-gray-200 shadow-xl text-black w-28'
      />
      <label htmlFor='height'>Height in cm: </label>
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
    </div>
  );
}
