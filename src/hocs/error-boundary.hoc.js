// @flow

import * as Sentry from '@sentry/browser';
import React from 'react';

export default function(WrappedComponent) {
  return class extends React.Component {
    state = { error: null };

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      Sentry.withScope((scope) => {
        Object.keys(errorInfo).forEach((key) => {
          scope.setExtra(key, errorInfo[key]);
        });
        Sentry.captureException(error);
      });
    }

    render() {
      if (this.state.error) {
        return <a onClick={() => Sentry.showReportDialog()}>Report feedback</a>;
      }
      return <WrappedComponent />;
    }
  };
}
