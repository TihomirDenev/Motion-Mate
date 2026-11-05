import { WEIGHT_MAX, WEIGHT_MIN } from '../../../common/constants';

export default function MetricWaterIntake({ weight, setWeight }) {
  return (
    <>
      <label>Weight in kg:</label>
      <input
        type='number'
        value={weight}
        min={WEIGHT_MIN}
        max={WEIGHT_MAX}
        onChange={(e) => setWeight(e.target.value)}
        placeholder='Kilograms'
        className='border-2 border-gray-500 rounded-sm p-2 mr-6 ml-1 mt-2 bg-gray-200 shadow-xl text-black w-28'
      />
    </>
  );
}
