import React from 'react';
import * as Sentry from '@sentry/browser';

class SentryTestError extends Error {
  constructor(message) {
    super(message);
    this.value = 'CustomSentryError';
  }
}

export default () => {
  try {
    throw new SentryTestError('If you see this, sentry is working');
  } catch (error) {
    Sentry.captureException(error);
  }
  return <div>Test sentry</div>;
};
