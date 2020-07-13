import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/browser';

export const getTransactionId = () => uuidv4();

export const setTransactionId = () => {
  const transactionId = getTransactionId();
  try {
    Sentry.configureScope((scope) => {
      scope.setTag('transaction_id', transactionId);
    });
  } catch (err) {
    console.error(err);
    return '';
  }
  return transactionId;
};
