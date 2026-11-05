export function getGoalStatus(goal, now = Date.now()) {
  if (Number(goal?.progress) >= 100) return 'Completed';
  if (Number(goal?.timePeriod?.from) > now) return 'Upcoming';
  if (Number(goal?.timePeriod?.to) < now) return 'Archived';
  return 'In progress';
}

export function localDateValue(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
