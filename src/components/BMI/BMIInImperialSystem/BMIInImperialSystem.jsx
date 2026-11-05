import {
  HEIGHT_MAX_IN,
  HEIGHT_MIN_IN,
  WEIGHT_MAX_LBS,
  WEIGHT_MIN_LBS,
} from '../../../common/constants';

export default function BMIInImperialSystem({ form, updateForm }) {
  return (
    <div className='mt-2'>
      <label htmlFor='weight'>Weight in lbs: </label>
      <input
        type='number'
        min={WEIGHT_MIN_LBS}
        max={WEIGHT_MAX_LBS}
        name='weight'
        placeholder='Pounds'
        value={form?.weight}
        onChange={updateForm('weight')}
        className='border-2 border-gray-500 rounded-sm p-2 mr-6 bg-gray-200 shadow-xl text-black w-28'
      />
      <label htmlFor='height'>Height in in: </label>
      <input
        type='number'
        min={HEIGHT_MIN_IN}
        max={HEIGHT_MAX_IN}
        name='height'
        placeholder='Inches'
        value={form?.height}
        onChange={updateForm('height')}
        className='border-2 border-gray-500 rounded-sm p-2 m-2 bg-gray-200 shadow-xl text-black w-28'
      />
    </div>
  );
}
