import type {
  ApiCallActions,
  WidgetApiMessageType,
} from '@bsport/saas-legacy/src/libs/widget/types';
import type { OptionCallback } from '@bsport/saas-legacy/src/state/types';
import type { Dispatch } from 'react';
import { BridgeAPIActionsRegistry } from '@bsport/saas-legacy/src/libs/widget/actionsRegistry';
import type { ActionOptions, QueryClientParams } from './types';
import { defaultActionOptions } from './constants';

class BridgeApiCallHandler {
  #timeBetweenRefetchs: number;

  #maxCallAttempts: number;

  #actionsRegistry: BridgeAPIActionsRegistry<ApiCallActions>;

  #requestStatusStore: Partial<
    // @ts-expect-error due to prettier trailing comma
    Record<WidgetApiMessageType, 'pending' | 'fulfilled'>,
  >;

  #retryOnError: boolean;

  #apiCallbackRegistry: Partial<
    Record<
      WidgetApiMessageType,
      {
        onSuccess?: (data: any) => void,
        onError?: (error: Error) => void,
        successExtractFn: (data: unknown) => unknown,
        // @ts-expect-error due to prettier trailing comma
      },
      // @ts-expect-error due to prettier trailing comma
    >,
  > = {};

  constructor(params: QueryClientParams) {
    this.#timeBetweenRefetchs = params.timeBetweenRefetchs;
    this.#maxCallAttempts = params.maxCallAttempts;
    this.#requestStatusStore = {};
    this.#retryOnError = params.retryOnError;
    this.#actionsRegistry = new BridgeAPIActionsRegistry('widget');
  }

  bindActions(
    type: WidgetApiMessageType,
    actions: ApiCallActions,
    options?: ActionOptions,
  ) {
    const optionsWithDefaults = { ...defaultActionOptions, ...options };
    this.#actionsRegistry.register(type, actions);
    this.#apiCallbackRegistry[type] = {
      successExtractFn: optionsWithDefaults.successCallbackExtractFn,
    };
  }

  sendRequest<A, T>({
    payload,
    type,
    dispatch,
  }: {
    type: WidgetApiMessageType,
    payload: { args: A, options?: OptionCallback<T> },
    dispatch: Dispatch<any>,
  }) {
    const actions = this.#actionsRegistry.get(type);

    const isLoadingAction =
      'isLoading' in actions ? actions.isLoading : actions.loading;

    const iframe = document.getElementById('@bsport-bridge-iframe');

    if (!iframe || !(iframe instanceof HTMLIFrameElement)) {
      return;
    }

    /**
     * If set of actions doesnt contains the classic error/loading/success
     * we can verify for specific action names such as "set" or "reset" etc
     */
    if ('reset' in actions || 'set' in actions) {
      if (actions.reset) dispatch(actions.reset(payload.args));
      if (actions.set) dispatch(actions.set(payload.args));
      return;
    }

    this.#requestStatusStore[type] = 'pending';

    if (payload.options?.onSuccess) {
      this.#apiCallbackRegistry[type].onSuccess = payload.options.onSuccess;
    }

    if (payload.options?.onError) {
      this.#apiCallbackRegistry[type].onError = payload.options.onError;
    }

    const attemptRefetch = (attempt = 0) => {
      if (this.#requestStatusStore[type] === 'fulfilled') return;

      if (attempt >= this.#maxCallAttempts) {
        dispatch(actions.error?.(new Error('Max call attempts reached')));
        dispatch(isLoadingAction?.(false));
        return;
      }

      dispatch(isLoadingAction?.(true));
      dispatch(actions.error?.(null));
      try {
        iframe.contentWindow?.postMessage({ type, args: payload.args }, '*');
      } catch (err) {
        dispatch(actions.error?.(err));
        dispatch(isLoadingAction?.(false));
        console.error(err);
      }
      setTimeout(() => {
        attemptRefetch(attempt + 1);
      }, this.#timeBetweenRefetchs);
    };

    attemptRefetch(0);
  }

  handleResponse({
    dispatch,
    response,
    type,
  }: {
    type: WidgetApiMessageType,
    response: { data: unknown, error?: Error },
    dispatch: Dispatch<any>,
  }) {
    const actions = this.#actionsRegistry.get(type);
    const isLoadingAction =
      'isLoading' in actions ? actions.isLoading : actions.loading;

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
      dispatch(actions.success(response.data));
      if (this.#apiCallbackRegistry[type]?.onSuccess) {
        const extractFn = this.#apiCallbackRegistry[type].successExtractFn;
        this.#apiCallbackRegistry[type].onSuccess(extractFn(response.data));
      }
    }
    dispatch(isLoadingAction(false));
  }
}
/**
 * The bridge query client. Use it to handle the communication between the widget and the bsport DOM.
 *
 * To make a call using the handler, you need to:
 * - Create your actions (success, loading, error) and bind them to their corresponding identifier.
 * - Then pass to your widget the correct action using `createFreeBridgeAction` or `createAuthenticatedBridgeAction`
 * (depending on the authentication status of the user). And that's all!
 *
 * @method bindActions - Method to bind actions to the bridge API.
 * @method sendRequest - Method to send a request to the bridge API.
 * @method handleResponse -  You won't need to call this method. It handles the response from the bridge API.
 * @param {number} timeBetweenRefetchs - The time the client waits for a response before sending another request (in milliseconds).
 * @param {number} maxCallAttempts - The maximum amount of requests the client sends to bsport DOM. This includes unfulfilled requests and error refetches.
 * @param {boolean} retryOnError - If set to true, if the client receives a response with an error, it will keep the call in pending state and send another request after [timeBetweenRefetchs].
 */

export const apiCallHandler = new BridgeApiCallHandler({
  timeBetweenRefetchs: 3000,
  maxCallAttempts: 2,
  retryOnError: false,
});
