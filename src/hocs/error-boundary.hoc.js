// @flow

import * as Sentry from '@sentry/react';

import React from 'react';

import '../errors.scss';

/* eslint-disable */
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
        console.error(error);
      });
    }

    render() {
      if (this.state.error) {
        return (
          <div>
            <div className="error-screen-wrapper">
              <div className="error-screen-shadow" />
            </div>
            <div className="error-screen">
              <h1>:(</h1>
              <p>Quelque chose n'a pas fonctionné correctement</p>
              <p>
                {
                  "Nous venons d'en être averti. Nous revenons vers vous très vite."
                }
              </p>
              <div className="buttons">
                <a
                  onClick={() => {
                    window.location = '/?storeReload';
                  }}
                  className="btn btn-info"
                >
                  Recharger
                </a>
                <a
                  onClick={() => Sentry.showReportDialog()}
                  className="btn btn-error"
                >
                  Je donne mon feedback
                </a>
              </div>
            </div>
          </div>
        );
      }
      return <WrappedComponent {...this.props} />;
    }
  };
}
/* eslint-enable */
