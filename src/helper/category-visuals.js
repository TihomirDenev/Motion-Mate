const visuals = [
  {
    match: /yoga|stretch|pilates/i,
    image: '/images/yoga.jpg',
    icon: 'leaf',
    tagline: 'balance',
    tone: 'lavender',
  },
  {
    match: /jog|run|cardio/i,
    image: '/images/runner.jpg',
    icon: 'activity',
    tagline: 'distance',
    tone: 'mint',
  },
  {
    match: /muscle|strength|weight.*gain/i,
    image: '/images/strength.jpg',
    icon: 'dumbbell',
    tagline: 'strength',
    tone: 'peach',
  },
  {
    match: /leg/i,
    image: '/images/training.jpg',
    icon: 'activity',
    tagline: 'legs',
    tone: 'blue',
  },
  {
    match: /ab|core/i,
    image: '/images/training.jpg',
    icon: 'target',
    tagline: 'core',
    tone: 'lavender',
  },
  {
    match: /loss|hiit/i,
    image: '/images/strength.jpg',
    icon: 'flame',
    tagline: 'energy',
    tone: 'peach',
  },
];

export function getCategoryVisual(category = '') {
  return (
    visuals.find((visual) => visual.match.test(category)) || {
      image: '/images/training.jpg',
      icon: 'dumbbell',
      tagline: 'default',
      tone: 'mint',
    }
  );
}

export function optimizedImage(url) {
  if (!url) return '';
  return url.includes('res.cloudinary.com/') && url.includes('/upload/')
    ? url.replace('/upload/', '/upload/f_auto,q_auto,c_fill,w_720,h_900/')
    : url;
}
