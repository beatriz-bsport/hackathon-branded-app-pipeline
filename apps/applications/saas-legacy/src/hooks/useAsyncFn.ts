/**
 * Same interface than react-use/lib/useAsyncFn, but simpler.
 *
 * @see https://medium.com/@sergeyleschev/react-custom-hook-useasync-8fe13f4d4032
 */

import { DependencyList, useCallback, useState } from 'react';

export default function useAsyncFn<ArgsType extends any[], ReturnType>(
  callback: (...args: ArgsType) => Promise<ReturnType>,
  dependencies: DependencyList = [],
): [
  {
    loading: boolean;
    error: Error | undefined;
    value: ReturnType | undefined;
  },
  (...args: ArgsType) => Promise<ReturnType>,
] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [value, setValue] = useState<ReturnType>();

  const callbackMemoized = useCallback<
    (...args: ArgsType) => Promise<ReturnType>
  >(async (...args) => {
    setLoading(true);
    setError(undefined);
    setValue(undefined);
    try {
      const result = await callback(...args);
      setValue(result);
      return result;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  return [{ loading, error, value }, callbackMemoized];
}
