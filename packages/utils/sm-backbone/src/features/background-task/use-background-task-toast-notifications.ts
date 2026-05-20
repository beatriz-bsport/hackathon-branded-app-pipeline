import { useEffect } from "react";

import { BACKGROUND_TASK_STATUSES } from "@bsport/api-platform/background-task";
import { type ToastProps, toast } from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

import {
  dismissProcessingToast,
  getTaskToastState,
} from "./task-toast-registry";
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
  const { t } = useTranslation("backbone", { i18n: i18nInstance });

  const { data: augmentedData, error, isError, isSuccess } = queryResult;
  const data = augmentedData?.task;
  const polling = augmentedData?.polling;

  // ----- Processing toast (open once per uuid) -----
  useEffect(() => {
    if (!uuid) {
      return;
    }

    const state = getTaskToastState(uuid);
    if (state.processingToastId) {
      return;
    }

    state.processingToastId = toast({
      status: "default",
      title: t("backgroundTaskToast.processing"),
      duration: 0,
      icon: "loading",
      buttonIcon: "x-close",
      ...processingToast,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid, processingToast, i18nInstance.language]);

  // ----- Error case (task FAILED, or transport-level error after retries) -----
  useEffect(() => {
    if (!uuid) {
      return;
    }

    const isTaskFailed =
      isSuccess && data?.status === BACKGROUND_TASK_STATUSES.FAILED;
    const isTransportError = isError && error != null;
    if (!isTaskFailed && !isTransportError) {
      return;
    }

    const state = getTaskToastState(uuid);
    if (state.errorToastId) {
      return;
    }

    state.errorToastId = toast({
      status: "critical",
      title: t("backgroundTaskToast.error"),
      icon: "alert-circle",
      buttonIcon: "x-close",
      ...errorToast,
    });
    dismissProcessingToast(state);

    onError?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    uuid,
    isSuccess,
    isError,
    error,
    data?.status,
    errorToast,
    i18nInstance.language,
  ]);

  // ----- Success case -----
  useEffect(() => {
    if (!uuid) {
      return;
    }

    if (!isSuccess || data?.status !== BACKGROUND_TASK_STATUSES.SUCCEEDED) {
      return;
    }

    const state = getTaskToastState(uuid);
    if (state.successToastId) {
      return;
    }

    state.successToastId = toast({
      status: "positive",
      title: t("backgroundTaskToast.success"),
      icon: "check-circle",
      buttonIcon: "x-close",
      ...successToast,
    });
    dismissProcessingToast(state);

    onSuccess?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid, isSuccess, data?.status, successToast, i18nInstance.language]);

  // ----- Timeout case -----
  useEffect(() => {
    if (!uuid) {
      return;
    }
    if (
      !isSuccess ||
      !polling?.hasTimeout ||
      data?.status !== BACKGROUND_TASK_STATUSES.PENDING
    ) {
      return;
    }

    const state = getTaskToastState(uuid);
    if (state.timeoutToastId) {
      return;
    }

    state.timeoutToastId = toast({
      status: "default",
      title: t("backgroundTaskToast.timeout"),
      icon: "alert-triangle",
      buttonIcon: "x-close",
      ...timeoutToast,
    });
    dismissProcessingToast(state);

    onTimeout?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    uuid,
    isSuccess,
    polling?.hasTimeout,
    data?.status,
    timeoutToast,
    i18nInstance.language,
  ]);
}
