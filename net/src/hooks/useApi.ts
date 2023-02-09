import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type UseApiHookValue<R, S = 'loading' | 'data' | 'error'> = {
  error: unknown;
  status: S;
  data?: R;
};

/**
 * Use API Hook
 *
 * Decompose a function that returns a promise and call it, returning a
 * UseApiHookValue object (data, status, and error variables). This makes API
 * service functions easier to work with in React.
 */

export const useApi = <R extends unknown, A extends unknown[]>(
  caller: (...args: A) => Promise<R>,
  ...args: A
): UseApiHookValue<R> => {
  const [status, setStatus] = useState<'loading' | 'data' | 'error'>('loading');
  const [data, setData] = useState<R>();
  const [error, setError] = useState<unknown>();
  const calledRef = useRef<boolean>(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    caller(...args)
      .then(result => {
        setData(result);
        setStatus('data');
      })
      .catch(err => {
        setStatus('error');
        setError(err);
      });
  }, [args, caller]);

  return {
    status,
    data,
    error,
  };
};

/**
 * Use API Primed Hook
 *
 * The same as useApi except it doesn't call the funciton immediately. Instead
 * this fn returns a tuple where the first index is the delayed trigger, and the
 * second index is UseApiHookValue.
 */

type UseApiPrimedValue<R extends unknown, A extends unknown[]> = [
  call: (...args: A) => void,
  out: UseApiHookValue<R, 'loading' | 'data' | 'error' | 'primed'>,
];

export const useApiPrimed = <R extends unknown, A extends unknown[]>(
  caller: (...args: A) => Promise<R>,
): UseApiPrimedValue<R, A> => {
  const [status, setStatus] = useState<'primed' | 'loading' | 'data' | 'error'>(
    'primed',
  );
  const [data, setData] = useState<R>();
  const [error, setError] = useState<unknown>();
  const calledRef = useRef<boolean>(false);

  const fn = useCallback(
    (...args: A) => {
      if (calledRef.current) return;
      calledRef.current = true;
      caller(...args)
        .then(result => {
          setData(result);
          setStatus('data');
        })
        .catch(err => {
          setStatus('error');
          setError(err);
        });
    },
    [caller],
  );

  const output = useMemo(
    () => ({
      data,
      status,
      error,
    }),
    [data, error, status],
  );

  return [fn, output];
};
