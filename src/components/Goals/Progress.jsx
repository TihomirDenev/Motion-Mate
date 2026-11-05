const Progress = ({ progress }) => {
  return (
    <div
      className={`radial-progress 
  ${
    progress < 25
      ? 'bg-red-500/45'
      : progress >= 25 && progress < 50
        ? 'bg-yellow-400/45'
        : progress >= 50 && progress < 75
          ? 'bg-yellow-500/45'
          : progress >= 75 && progress < 100
            ? 'bg-green-300/45'
            : 'bg-green-400/45'
  }`}
      style={{ '--value': progress }}
      role='progressbar'
    >
      {progress}
    </div>
  );
};

export default Progress;
