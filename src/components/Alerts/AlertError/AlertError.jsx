const AlertError = ({ message }) => {
  return (
    <div className='toast toast-end z-50'>
      <div className='alert alert-error'>{message}</div>
    </div>
  );
};

export default AlertError;
