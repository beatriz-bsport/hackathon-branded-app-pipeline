import { type DependencyList, useCallback, useState } from "react";
import { Result } from "typescript-result";

// Extracts the success value from Result
type ResultType<T extends Promise<Result<unknown, unknown>>> =
  T extends Promise<Result<infer U, unknown>> ? U : unknown;

// Extracts the error type from Result
type ErrorType<T extends Promise<Result<unknown, unknown>>> =
  T extends Promise<Result<unknown, infer E>> ? E : Error;

/**
 * Hook to manage async functions with loading, error, and data state.
 * Allows passing extra arguments to success/failure callbacks.
 * @param asyncFn [Required] Async function that return a typescript-result promise (cf store-base)
 * @param onSuccess [Optional] Callback when the asyncFn succedded.
 * @param onFailure [Optional] Callback when the asyncFn failed.
 * @param dependencies [Optional] Provide memoized dependencies to memoize the build function
 * @returns Two list elements
 * - { isLoading, error, data } containing the 3 states
 * - the built and memoized function using asyncFn and callbacks
 */
export function useAsync<
  AsyncFn extends (...args: never[]) => Promise<Result<unknown, unknown>>,
  SuccessReturn = void | undefined,
  FailureReturn = void | undefined,
>({
  asyncFn,
  onSuccess,
  onFailure,
  dependencies,
}: {
  asyncFn: AsyncFn;
  onSuccess?: ({
    value,
    args,
  }: {
    value: ResultType<ReturnType<AsyncFn>>;
    args: Parameters<AsyncFn>;
  }) => SuccessReturn;
  onFailure?: ({
    error,
    args,
  }: {
    error: ErrorType<ReturnType<AsyncFn>>;
    args: Parameters<AsyncFn>;
  }) => FailureReturn;
  dependencies?: DependencyList;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<
    ErrorType<ReturnType<AsyncFn>> | undefined
  >();
  const [data, setData] = useState<
    ResultType<ReturnType<AsyncFn>> | undefined
  >();

  const callbackMemoized = useCallback(
    async (...args: Parameters<AsyncFn>) => {
      setIsLoading(true);
      setError(undefined);
      setData(undefined);

      try {
        const result = await asyncFn(...args);

        return result.fold(
          (value) => {
            setData(value as ResultType<ReturnType<AsyncFn>>);

            return onSuccess?.({
              value: value as ResultType<ReturnType<AsyncFn>>,
              args,
            }) as SuccessReturn;
          },
          (err) => {
            setError(err as ErrorType<ReturnType<AsyncFn>>);
            return onFailure?.({
              error: err as ErrorType<ReturnType<AsyncFn>>,
              args,
            }) as FailureReturn;
          },
        );
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    dependencies ?? [],
  );

  return [{ isLoading, error, data }, callbackMemoized] as const;
}
