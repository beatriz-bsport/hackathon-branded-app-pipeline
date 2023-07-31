import { createAction } from 'redux-actions';
import { Dispatch } from 'redux';

export const pluginActions = {
  isPluginActivated: createAction('PLUGIN/IS_PLUGIN_ACTIVATED'),
};

const checkPluginActivated = () => {
  return localStorage.getItem('isBsportPluginInstalled') === 'true';
};

export function checkBsportPluginActivated() {
  return async (dispatch: Dispatch) => {
    const e = new Image();
    const id = localStorage.getItem('BsportPluginId');
    e.src = `chrome-extension://${id}/images/bsport128.png`;
    e.onload = () =>
      dispatch(pluginActions.isPluginActivated(checkPluginActivated()));
    e.onerror = () => dispatch(pluginActions.isPluginActivated(false));
  };
}
