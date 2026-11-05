import { NavLink } from 'react-router';

export default function LoginBy({
  placeholder,
  type,
  form,
  updateForm,
  handleLogin,
}) {
  return (
    <>
      <div className='flex flex-col'>
        <label className='flex items-center select-none justify-between px-1 py-2'>
          <span className='text-sm'>
            {placeholder} <span className='text-red-600'>*</span>
          </span>
        </label>
        <input
          type={type}
          placeholder={placeholder}
          className='input w-full'
          value={form}
          onChange={updateForm(placeholder.toLowerCase())}
          required
        />
      </div>
      <div className='flex flex-col'>
        <label className='flex items-center select-none justify-between px-1 py-2'>
          <span className='text-sm'>
            Password <span className='text-red-600'>*</span>
          </span>
        </label>
        <input
          type='password'
          placeholder='password'
          className='input w-full'
          value={form.password}
          onChange={updateForm('password')}
          required
        />
        <label className='flex items-center select-none justify-between px-1 py-2'>
          <NavLink
            to='/contact-us'
            className='text-xs link link-hover'
          >
            Forgot password?
          </NavLink>
        </label>
      </div>
      <div className='flex flex-col mt-6'>
        <button
          type='button'
          className='btn btn-primary'
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </>
  );
}
