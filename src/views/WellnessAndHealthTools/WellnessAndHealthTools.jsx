import { APP_NAME } from '../../common/constants';
import ActivityLevelWaterIntake from '../../components/ActivityLevelWaterIntake/ActivityLevelWaterIntake/ActivityLevelWaterIntake';
import BodyMassIndex from '../../components/BMI/BodyMassIndex/BodyMassIndex';
import CalorieCalculator from '../../components/CalorieCalculator/CalorieCalculator/CalorieCalculator';

export default function WellnessHealthTools() {
  document.querySelector('title').textContent =
    `${APP_NAME} | Wellness & Health Tools`;
  return (
    <div>
      <ActivityLevelWaterIntake />
      <BodyMassIndex />
      <CalorieCalculator />
    </div>
  );
}
