// @flow

import * as Sentry from '@sentry/react';

import React from 'react';
import { getVerticalOwnerByPageUrl } from '#src/sentry/utils';
import { SENTRY_FRONTEND_MODULE_TAG_NAME } from '#src/sentry/types';
import '../errors.scss';

/* eslint-disable */
export default function (WrappedComponent) {
  return class extends React.Component {
    state = { error: null };

    componentDidCatch(error, errorInfo) {
      const currentUrl = window?.location?.pathname || '';
      const attributedVertical = getVerticalOwnerByPageUrl(currentUrl);

      this.setState({ error });
      Sentry.withScope((scope) => {
        Object.keys(errorInfo).forEach((key) => {
          scope.setExtra(key, errorInfo[key]);
        });
        Sentry.setTag(SENTRY_FRONTEND_MODULE_TAG_NAME, attributedVertical);
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
              <p>Something in the platform misbehaved</p>
              <p>
                {
                  'We have just received an alert, and are probably already working on it.'
                }
              </p>
              <div className="buttons">
                <a
                  onClick={() => {
                    window.location = '/?storeReload';
                  }}
                  className="btn btn-info"
                >
                  Reload
                </a>
                <a
                  onClick={() => Sentry.showReportDialog()}
                  className="btn btn-error"
                >
                  I give my feedback
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
