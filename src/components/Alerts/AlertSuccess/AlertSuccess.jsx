const AlertSuccess = ({ message }) => {
  return (
    <div className='toast toast-end z-50'>
      <div className='alert alert-success'>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default AlertSuccess;
