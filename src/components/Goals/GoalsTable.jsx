import Goal from './Goal';

const GoalsTable = ({ goals, myGoals = false }) => {
  return (
    <div className='flex flex-col w-full gap-2 overflow-x-auto'>
      {goals?.length > 0 ? (
        <table className='table'>
          {/* head */}
          <thead>
            <tr>
              <th>Goals</th>
              <th>Name</th>
              <th>Time left</th>
              <th>Type</th>
              <th>Progress</th>
            </tr>
          </thead>
          {/* row */}
          <tbody>
            {goals.map((goal, idx) => (
              <tr
                key={goal?.id}
                className={`${idx % 2 === 0 && 'bg-base-200 '}`}
              >
                <Goal
                  id={goal?.id}
                  owner={goal?.owner}
                  name={goal?.name}
                  from={goal?.timePeriod?.from}
                  type={goal?.type}
                  to={goal?.timePeriod?.to}
                  progress={goal?.progress}
                />
              </tr>
            ))}
          </tbody>
          {/* foot */}
          <tfoot>
            <tr>
              <th>Goals</th>
              <th>Name</th>
              <th>Time left</th>
              <th>Type</th>
              <th>Progress</th>
            </tr>
          </tfoot>
        </table>
      ) : (
        <div className='mx-auto my-2'>
          <h2 className='flex justify-center mb-2 text-lg'>No Goals found.</h2>
          {myGoals && <p>Create the first goal with the button above.</p>}
        </div>
      )}
    </div>
  );
};

export default GoalsTable;
