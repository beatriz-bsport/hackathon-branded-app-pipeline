// @flow

import * as Sentry from '@sentry/react';
import React from 'react';
import { useTranslation } from 'react-i18next'; // or your i18n library
import { getVerticalOwnerByPageUrl } from '#src/sentry/utils';
import { SENTRY_FRONTEND_MODULE_TAG_NAME } from '#src/sentry/types';
import '../errors.scss';

/* eslint-disable */

// Inner component that uses hooks for translations
const ErrorBoundaryContent = ({ error, onReload, onSubmitReport }) => {
  const { t } = useTranslation('settings'); // namespace for error boundary translations

  if (!error) return null;

  return (
    <div>
      <div className="error-screen-wrapper">
        <div className="error-screen-shadow" />
      </div>
      <div className="error-screen">
        <p>{t('errorBoundary.unexpectedError')}</p>
        <p>{t('errorBoundary.errorDescription')}</p>
        <div className="buttons">
          <a onClick={onSubmitReport} className="btn btn-error">
            {t('errorBoundary.submitCrashReport')}
          </a>
          <a onClick={onReload} className="btn btn-info">
            {t('errorBoundary.reload')}
          </a>
        </div>
      </div>
    </div>
  );
};

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

    handleReload = () => {
      window.location = '/?storeReload';
    };

    handleSubmitReport = () => {
      Sentry.showReportDialog();
    };

    render() {
      if (this.state.error) {
        return (
          <ErrorBoundaryContent
            error={this.state.error}
            onReload={this.handleReload}
            onSubmitReport={this.handleSubmitReport}
          />
        );
      }
      return <WrappedComponent {...this.props} />;
    }
  };
}
/* eslint-enable */
