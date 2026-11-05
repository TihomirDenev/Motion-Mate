import { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../config/firebase-config';

export function useDatabaseValue(path) {
  const [state, setState] = useState({ path: null, data: null, error: null });
  useEffect(() => {
    if (!path) return;
    return onValue(
      ref(db, path),
      (snapshot) => setState({ path, data: snapshot.val(), error: null }),
      (error) => setState({ path, data: null, error: error.message })
    );
  }, [path]);
  const current = state.path === path;
  return {
    data: current ? state.data : null,
    error: current ? state.error : null,
    loading: Boolean(path) && !current,
  };
}
