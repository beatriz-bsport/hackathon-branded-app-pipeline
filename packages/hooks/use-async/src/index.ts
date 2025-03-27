import { useCallback, useState, type DependencyList } from "react";
import { Result } from "typescript-result";

// Utility type to extract the type of the value inside the Result from the async function
type ResultType<T extends Promise<Result<unknown, Error>>> =
  T extends Promise<Result<infer U, Error>> ? U : unknown;

/**
 * Hook to define isLoading, error and data state relative to an async function.
 * @param asyncFn [Required] Async function that return a typescript-result promise (cf store-base)
 * @param onSuccess [Optional] Callback when the asyncFn succedded.
 * @param onFailure [Optional] Callback when the asyncFn failed.
 * @param dependencies [Optional] Provide memoized dependencies to memoize the build function
 * @returns Two list elements
 * - { isLoading, error, data } containing the 3 states
 * - the built and memoized function using asyncFn and callbacks
 */
export function useAsync<
  AsyncFn extends (...args: never[]) => Promise<Result<unknown, Error>>,
>({
  asyncFn,
  onSuccess,
  onFailure,
  dependencies,
}: {
  asyncFn: AsyncFn;
  onSuccess?: (value: ResultType<ReturnType<AsyncFn>>) => void;
  onFailure?: (error: Error) => void;
  dependencies?: DependencyList;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const [data, setData] = useState<
    ResultType<ReturnType<AsyncFn>> | undefined
  >();

  const callbackMemoized = useCallback(async (...args: Parameters<AsyncFn>) => {
    setIsLoading(true);
    setError(undefined);
    setData(undefined);
    try {
      const result = await asyncFn(...args);
      result.fold(
        (value) => {
          setData(value as ResultType<ReturnType<AsyncFn>>);
          onSuccess?.(value as ResultType<ReturnType<AsyncFn>>);
        },
        (err) => {
          setError(err);
          onFailure?.(err);
        },
      );
    } finally {
      setIsLoading(false);
    }
  }, dependencies ?? []);

  return [{ isLoading, error, data }, callbackMemoized] as const;
}
