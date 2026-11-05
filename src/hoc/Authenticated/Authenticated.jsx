import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AppContext } from '../../context/AppContext.js';

/**
 *
 * @param {{children: any }} props
 * @returns
 */
export default function Authenticated({ children }) {
  const { user } = useContext(AppContext);
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        replace
        to='/login'
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
}
