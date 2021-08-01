import React from 'react';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import {
  StylesProvider,
  createGenerateClassName,
} from '@material-ui/core/styles';
import {
  PrivateServicePageTypeEnum,
  WidgetComponentsEnum,
} from 'bsport-saas/src/libs/marketplace/types';

import { DIALOG_MODE_TAB } from '@bsport/common/lib/master-data/widget-dialog-mode';
import initStore from './store/store';
import App from './App';

const generateClassName = createGenerateClassName({
  productionPrefix: 'widget-',
});

const migrateOldProps = (props: any) => {
  const _props = { ...props };

  /**
   * Migrate old calendar config to new config
   */
  if (
    _props.widgetType === WidgetComponentsEnum.calendar &&
    !('config' in _props)
  ) {
    _props.config = {
      calendar: {
        ..._props.defaultFilters,
        compactMode: _props.compactMode,
      },
    };
  }

  /**
   * Migrate to private service groups
   */
  if (_props.widgetType === WidgetComponentsEnum.privateService) {
    if (!_props.config.privateService) {
      _props.config.privateService = {};
    }

    let privateServiceType = _props.config.privateService.type;

    if (!privateServiceType) {
      if (typeof _props.config.privateService.serviceId === 'number') {
        privateServiceType = PrivateServicePageTypeEnum.detail;
      } else {
        privateServiceType = PrivateServicePageTypeEnum.list;
      }
    }

    _props.config.privateService.type = privateServiceType;
  }

  /**
   * Use a default config when the current config is wrong
   */
  if (
    ![
      'calendar',
      'workshop',
      'privateService',
      'newsletter',
      'vod',
      'playlist',
      'subscription',
      'pass',
      'shop',
    ].includes(_props.widgetType)
  ) {
    _props.widgetType = WidgetComponentsEnum.calendar;
  }

  if (_props.dialogMode === undefined) {
    _props.dialogMode = DIALOG_MODE_TAB;
  }

  return _props;
};

export default class extends React.Component {
  store: any;

  history: any;

  childProps: any;

  constructor(props: any) {
    super(props);

    this.store = initStore();
    this.history = createBrowserHistory();

    this.childProps = migrateOldProps(props.initialParams);

    if (this.childProps.config === undefined) {
      this.childProps.config = { [this.childProps.widgetType]: {} };
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <StylesProvider generateClassName={generateClassName}>
          <ConnectedRouter history={this.history}>
            <App {...this.childProps} store={this.store} />
          </ConnectedRouter>
        </StylesProvider>
      </Provider>
    );
  }
}
