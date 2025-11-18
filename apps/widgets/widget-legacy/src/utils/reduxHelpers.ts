import { RootState as SaasRootState } from '@bsport/saas-legacy/src/reducers';
import { RootState as WidgetRootState } from '../reducers';

export const extractPaginatedResponseDataResults = (data: any) => data?.results;

/**
 * Adapts a selector function from SaaS Redux state to widget Redux state.
 *
 * This function is currently utilized for typing purposes, as the structure
 * of the widget resembles Partial & bridgeState. It acts as an interface
 * between the SaaS state and the bridge state.
 *
 * @param {Function} selector - A selector function that operates on the SaaS Redux state.
 * @returns {Function} A selector function that operates on the widget Redux state.
 */
// eslint-disable-next-line
export const adaptSelector =
  <T extends unknown[], R>(selector: (state: SaasRootState, ...args: T) => R) =>
  (bridgeState: WidgetRootState, ...args: T): R => {
    const castedState = bridgeState as unknown as SaasRootState;
    return selector(castedState, ...args);
  };
