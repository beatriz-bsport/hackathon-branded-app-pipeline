import {
  type UseBackgroundTaskQueryParams,
  useBackgroundTaskQuery,
} from "./use-background-task-query";
import {
  type UseBackgroundTaskToastNotificationsParams,
  useBackgroundTaskToastNotifications,
} from "./use-background-task-toast-notifications";

export type UseBackgroundTaskParams<
  BackgroundTaskValueSuccess,
  BackgroundTaskValueError,
> = UseBackgroundTaskQueryParams &
  Omit<
    UseBackgroundTaskToastNotificationsParams<
      BackgroundTaskValueSuccess,
      BackgroundTaskValueError
    >,
    "queryResult"
  >;

/**
 * Hook that handles
 * - background task query (`useBackgroundTaskQuery`)
 * - toast notifications on processing, success, error (both task and server errors), timeout
 * Once UUID is defined, it will automatically handle the events.
 * You can customize the toasts if you want, by providing ToastProps
 * @description
 * ```tsx
 * import { fetch } from "#src/utils/fetch";
 * 
 * const MyComponent = () => {
 *   const { mutate: createSession, data: uuid } = useSomethingQueryOrMutation();
 * 
 *   const query = useBackgroundTask({
 *     fetch,
 *     uuid: uuid ?? null,
 *     processingToast: { label :"Creating session..." },
 *     successToast: { label :"Session created successfully!" },
 *     errorToast: { label :"Failed to create sessions" },
 *     onSuccess: () => {},
 *     ...
 *   });
 * 
 *   return <Button onClick={createSession}>Create Session</Button>;
 * };
```
 */
export function useBackgroundTask<
  BackgroundTaskValueSuccess = unknown,
  BackgroundTaskValueError = unknown,
>({
  fetch,
  uuid,
  maxRefetchDuration,
  ...toastNotificationsParams
}: UseBackgroundTaskParams<
  BackgroundTaskValueSuccess,
  BackgroundTaskValueError
>) {
  const queryResult = useBackgroundTaskQuery<
    BackgroundTaskValueSuccess,
    BackgroundTaskValueError
  >({
    fetch,
    uuid,
    maxRefetchDuration,
  });

  useBackgroundTaskToastNotifications<
    BackgroundTaskValueSuccess,
    BackgroundTaskValueError
  >({
    uuid: uuid,
    queryResult,
    ...toastNotificationsParams,
  });

  return queryResult;
}
