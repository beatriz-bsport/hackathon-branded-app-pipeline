import { useEffect, useRef } from "react";

import { BACKGROUND_TASK_STATUSES } from "@bsport/api-platform/background-task";
import {
  type ToastProps,
  dismissToast,
  toast,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import type { useBackgroundTaskQuery } from "./use-background-task-query";

export type UseBackgroundTaskToastNotificationsParams<
  BackgroundTaskValueSuccess = unknown,
  BackgroundTaskValueError = unknown,
> = {
  uuid?: string | null;
  queryResult: ReturnType<
    typeof useBackgroundTaskQuery<
      BackgroundTaskValueSuccess,
      BackgroundTaskValueError
    >
  >;
  // toasts translations
  processingToast?: Partial<ToastProps>;
  successToast?: Partial<ToastProps>;
  errorToast?: Partial<ToastProps>;
  timeoutToast?: Partial<ToastProps>;
  // callbacks
  onSuccess?: () => void;
  onError?: () => void;
  onTimeout?: () => void;
};

export function useBackgroundTaskToastNotifications<
  BackgroundTaskValueSuccess = unknown,
  BackgroundTaskValueError = unknown,
>({
  uuid,
  queryResult,
  // toasts translations
  processingToast = {},
  successToast = {},
  errorToast = {},
  timeoutToast = {},
  // callbacks
  onSuccess,
  onError,
  onTimeout,
}: UseBackgroundTaskToastNotificationsParams<
  BackgroundTaskValueSuccess,
  BackgroundTaskValueError
>) {
  const { t } = useTranslation("platform", { i18n: i18nInstance });

  // --- useRef to persist toastId across renders ---
  const processingUuid = useRef<string | null>(null); // To handle concurrent uuids
  const processingToastId = useRef<string | null>(null);
  const successToastId = useRef<string | null>(null);
  const errorToastId = useRef<string | null>(null);
  const timeoutToastId = useRef<string | null>(null);

  const { data: augmentedData, error, isError, isSuccess } = queryResult;
  const data = augmentedData?.task;
  const polling = augmentedData?.polling;

  // Display an infinite processing toast only when uuid appears, or cleanup
  useEffect(() => {
    // Reset the ref ids when uuid turns null or change
    if (!uuid || processingUuid.current !== uuid) {
      if (processingToastId.current) {
        // Ensure the infinite toast is dismissed
        dismissToast(processingToastId.current);
      }
      processingToastId.current = null;
      processingUuid.current = null;
      successToastId.current = null;
      errorToastId.current = null;
      timeoutToastId.current = null;
    }

    if (uuid && !processingToastId.current) {
      processingToastId.current = toast({
        status: "default",
        title: t("backgroundTaskToast.processing"),
        duration: 0,
        icon: "loading",
        buttonIcon: "x-close",
        ...processingToast,
      });
      processingUuid.current = uuid;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid, processingToast, i18nInstance.language]);

  // Base on the query results, close the processing toast, display an adequate one, and trigger callbacks

  // ----- Error case (task reported FAILED, or transport-level error after retries are exhausted) -----
  useEffect(() => {
    const isTaskFailed =
      isSuccess && data?.status === BACKGROUND_TASK_STATUSES.FAILED;
    const isTransportError = isError && error != null;

    if (uuid && (isTaskFailed || isTransportError) && !errorToastId.current) {
      errorToastId.current = toast({
        status: "critical",
        title: t("backgroundTaskToast.error"),
        icon: "alert-circle",
        buttonIcon: "x-close",
        ...errorToast,
      });

      if (processingToastId.current) {
        dismissToast(processingToastId.current);
        processingToastId.current = null;
      }

      onError?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    uuid,
    isSuccess,
    isError,
    error,
    data?.status,
    i18nInstance.language,
    errorToast,
    processingToastId,
  ]);

  // ----- Success case -----
  useEffect(() => {
    if (
      uuid &&
      isSuccess &&
      data?.status === BACKGROUND_TASK_STATUSES.SUCCEEDED &&
      !successToastId.current
    ) {
      successToastId.current = toast({
        status: "positive",
        title: t("backgroundTaskToast.success"),
        icon: "check-circle",
        buttonIcon: "x-close",
        ...successToast,
      });

      if (processingToastId.current) {
        dismissToast(processingToastId.current);
        processingToastId.current = null;
      }

      onSuccess?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    uuid,
    isSuccess,
    data?.status,
    i18nInstance.language,
    successToast,
    processingToastId,
  ]);

  // ----- Timeout case -----
  useEffect(() => {
    if (
      uuid &&
      isSuccess &&
      polling?.hasTimeout &&
      data?.status === BACKGROUND_TASK_STATUSES.PENDING &&
      !timeoutToastId.current
    ) {
      timeoutToastId.current = toast({
        status: "default",
        title: t("backgroundTaskToast.timeout"),
        icon: "alert-triangle",
        buttonIcon: "x-close",
        ...timeoutToast,
      });

      if (processingToastId.current) {
        dismissToast(processingToastId.current);
        processingToastId.current = null;
      }

      onTimeout?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    uuid,
    isSuccess,
    data?.status,
    i18nInstance.language,
    timeoutToast,
    processingToastId,
    polling?.hasTimeout,
  ]);
}
