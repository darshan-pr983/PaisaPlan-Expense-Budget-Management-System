import { useState, useEffect, useCallback } from 'react';
export default function useFetch(fn, deps) {
  const [data, setData] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState('');
  const load = useCallback(() => { setLoading(true); fn().then(d => { setData(d); setError(''); }).catch(e => setError(e.response?.data?.message || e.message)).finally(() => setLoading(false)); }, deps); // eslint-disable-line
  useEffect(load, [load]);
  return { data, loading, error, reload: load };
}
