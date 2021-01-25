import React from 'react';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import initStore from './store/store';

import App from './App';

const migrateOldProps = (props) => {
  const _props = { ...props };
  if (_props.widgetType === 'calendar' && !('config' in _props)) {
    _props.config = {
      calendar: {
        ..._props.defaultFilters,
        compactMode: _props.compactMode,
      },
    };
  }

  if (
    !['calendar', 'workshop', 'privateService', 'newsletter', 'vod'].includes(
      _props.widgetType,
    )
  ) {
    _props.widgetType = 'calendar';
  }

  return _props;
};

export default class extends React.Component {
  constructor(props) {
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
        <ConnectedRouter history={this.history}>
          <App {...this.childProps} store={this.store} />
        </ConnectedRouter>
      </Provider>
    );
  }
}
