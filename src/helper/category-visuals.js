const visuals = [
  {
    match: /yoga|stretch|pilates/i,
    image: '/images/yoga.jpg',
    icon: 'leaf',
    label: 'Find your balance',
    tone: 'lavender',
  },
  {
    match: /jog|run|cardio/i,
    image: '/images/runner.jpg',
    icon: 'activity',
    label: 'Go the extra mile',
    tone: 'mint',
  },
  {
    match: /muscle|strength|weight.*gain/i,
    image: '/images/strength.jpg',
    icon: 'dumbbell',
    label: 'Build your strength',
    tone: 'peach',
  },
  {
    match: /leg/i,
    image: '/images/training.jpg',
    icon: 'activity',
    label: 'Strong from the ground up',
    tone: 'blue',
  },
  {
    match: /ab|core/i,
    image: '/images/training.jpg',
    icon: 'target',
    label: 'Strength at your center',
    tone: 'lavender',
  },
  {
    match: /loss|hiit/i,
    image: '/images/strength.jpg',
    icon: 'flame',
    label: 'Bring the energy',
    tone: 'peach',
  },
];

export function getCategoryVisual(category = '') {
  return (
    visuals.find((visual) => visual.match.test(category)) || {
      image: '/images/training.jpg',
      icon: 'dumbbell',
      label: 'Make your next move',
      tone: 'mint',
    }
  );
}
