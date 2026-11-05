const CountdownPart = ({ value }) => (
  <span
    style={{ '--value': value, '--digits': 2 }}
    aria-live='polite'
    aria-label={value}
  >
    {value}
  </span>
);

export const Timer = ({ timeLeft }) => {
  const isRunning =
    timeLeft?.days + timeLeft?.hours + timeLeft?.minutes + timeLeft?.seconds >
    0;

  return (
    <div>
      <span className='countdown text-secondary font-mono text-2xl mb-4'>
        <CountdownPart value={isRunning ? timeLeft.hours : 0} />:
        <CountdownPart value={isRunning ? timeLeft.minutes : 0} />:
        <CountdownPart value={isRunning ? timeLeft.seconds : 0} />
      </span>
    </div>
  );
};
