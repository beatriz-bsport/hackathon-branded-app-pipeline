import type { WidgetApiMessageType } from 'bsport-saas/src/libs/widget/types';
import type { OptionCallback } from 'bsport-saas/src/state/types';
import type { Dispatch } from 'react';
import type { Action } from 'redux';
import type { ActionFunctionAny } from 'redux-actions';

type QueryClientParams = {
  timeBetweenRefetchs: number,
  maxCallAttempts: number,
  retryOnError: boolean,
};

class BridgeApiCallHandler {
  #timeBetweenRefetchs: number;

  #maxCallAttempts: number;

  #requestStatusStore: Partial<
    // @ts-expect-error due to prettier trailing comma
    Record<WidgetApiMessageType, 'pending' | 'fulfilled'>,
  >;

  #retryOnError: boolean;

  #apiCallbackRegistry: Partial<
    Record<
      WidgetApiMessageType,
      // @ts-expect-error due to prettier trailing comma
      { onSuccess?: (data: any) => void, onError?: (error: Error) => void },
      // @ts-expect-error due to prettier trailing comma
    >,
  > = {};

  /**
   * @param timeBetweenRefetchs: the time the client waits for a response between sending another request. Unit: ms
   * @param maxCallAttempts: the maximum amount of requests the client sends to bsport DOM. This includes unfulfilled requests and error refetchs
   * @param retryOnError: if set to true, if the client receives a response with an error, it will keep the call in pending state and send another request after [timeBetweenRefetchs]
   */

  constructor(params: QueryClientParams) {
    this.#timeBetweenRefetchs = params.timeBetweenRefetchs;
    this.#maxCallAttempts = params.maxCallAttempts;
    this.#requestStatusStore = {};
    this.#retryOnError = params.retryOnError;
  }

  sendRequest<A, T>({
    action,
    dispatch,
    payload,
    type,
  }: {
    type: WidgetApiMessageType,
    dispatch: Dispatch<any>,
    action: Record<
      'success' | 'isLoading' | 'error',
      // @ts-expect-error due to prettier trailing comma
      ActionFunctionAny<Action<any>>,
    >,
    payload: { args: A, options?: OptionCallback<T> },
  }) {
    const iframe = document.getElementById('@bsport-bridge-iframe');

    if (!iframe || !(iframe instanceof HTMLIFrameElement)) {
      return;
    }

    this.#requestStatusStore[type] = 'pending';

    if (payload.options?.onSuccess) {
      if (!this.#apiCallbackRegistry[type]) {
        this.#apiCallbackRegistry[type] = {};
      }
      this.#apiCallbackRegistry[type].onSuccess = payload.options.onSuccess;
    }

    if (payload.options?.onError) {
      if (!this.#apiCallbackRegistry[type]) {
        this.#apiCallbackRegistry[type] = {};
      }
      this.#apiCallbackRegistry[type].onError = payload.options.onError;
    }

    const attemptRefetch = (attempt = 0) => {
      if (this.#requestStatusStore[type] === 'fulfilled') return;

      if (attempt >= this.#maxCallAttempts) {
        dispatch(action.error(new Error('Max call attempts reached')));
        dispatch(action.isLoading(false));
        return;
      }

      dispatch(action.isLoading(true));
      dispatch(action.error(null));
      try {
        iframe.contentWindow?.postMessage({ type, args: payload.args }, '*');
      } catch (err) {
        dispatch(action.error(err));
        dispatch(action.isLoading(false));
        console.error(err);
      }
      setTimeout(() => {
        attemptRefetch(attempt + 1);
      }, this.#timeBetweenRefetchs);
    };

    attemptRefetch(0);
  }

  handleResponse({
    actions,
    dispatch,
    response,
    type,
  }: {
    type: WidgetApiMessageType,
    response: { data: unknown, error?: Error },
    dispatch: Dispatch<any>,
    actions: {
      success: ActionFunctionAny<Action<any>>,
      isLoading: ActionFunctionAny<Action<any>>,
      error: ActionFunctionAny<Action<any>>,
    },
  }) {
    if (response.error) {
      if (this.#retryOnError && this.#requestStatusStore[type] === 'pending') {
        return;
      }
      this.#requestStatusStore[type] = 'fulfilled';
      if (this.#apiCallbackRegistry[type]?.onError) {
        this.#apiCallbackRegistry[type].onError(response.error);
      }
      dispatch(actions.error(response.error));
    } else {
      this.#requestStatusStore[type] = 'fulfilled';
      if (this.#apiCallbackRegistry[type]?.onSuccess) {
        this.#apiCallbackRegistry[type].onSuccess(response.data);
      }
      dispatch(actions.success(response.data));
    }
    dispatch(actions.isLoading(false));
  }
}

export const apiCallHandler = new BridgeApiCallHandler({
  timeBetweenRefetchs: 3000,
  maxCallAttempts: 2,
  retryOnError: false,
});
