import React from 'react';
import * as Sentry from '@sentry/browser';

export default () => {
  try {
    const a = {};
    const aaa = a.b.r;
    console.error(aaa);
  } catch (error) {
    Sentry.captureException(error);
  }
  return <div />;
};
