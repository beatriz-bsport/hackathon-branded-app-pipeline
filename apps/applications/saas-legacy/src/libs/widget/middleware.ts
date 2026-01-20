import type { MiddlewareAPI, Dispatch, Action } from 'redux';
import { authActionTypes } from '#src/actions/constants';
import type { RootState } from '#src/reducers';
import WidgetUtils from './WidgetUtils';

export function widgetMiddleware(_: MiddlewareAPI<Dispatch, RootState>) {
  return (next: Dispatch<any>) => (action: Action) => {
    const result = next(action);

    if (!WidgetUtils.isWidget()) return result;

    if (action.type === authActionTypes.LOGIN_SUCCESSFUL) {
      WidgetUtils.sendBridgeLoginSuccess();
    }

    if (action.type === authActionTypes.DISCONNECT) {
      WidgetUtils.sendBridgeLogout();
    }

    return result;
  };
}
