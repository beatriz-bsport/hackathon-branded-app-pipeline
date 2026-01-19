import type { MiddlewareAPI, Dispatch, Action } from 'redux';
import { authActionTypes } from '#src/actions/constants';
import type { RootState } from '#src/reducers';
import WidgetUtils from './WidgetUtils';
import { parseQueryString } from '#src/http/utils';

const getHasNextPage = () => {
  if (!window || !window.location) return false;
  const pageQueryParams = parseQueryString(window.location.search);

  return !!pageQueryParams?.next;
};

export function widgetMiddleware(_: MiddlewareAPI<Dispatch, RootState>) {
  return (next: Dispatch<any>) => (action: Action) => {
    const result = next(action);

    if (action.type === authActionTypes.LOGIN_SUCCESSFUL) {
      WidgetUtils.sendBridgeLoginSuccess(getHasNextPage());
    }

    if (action.type === authActionTypes.DISCONNECT) {
      WidgetUtils.sendBridgeLogout();
    }

    return result;
  };
}
