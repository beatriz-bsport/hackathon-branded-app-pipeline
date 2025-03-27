import { withScope } from "@sentry/react";

import { uuid } from "@bsport/random-utils";

let transactionId: string | undefined;

export const getTransactionId = () => {
  if (!transactionId) {
    transactionId = uuid();
  }
  return transactionId;
};

export const setTransactionId = () => {
  const _transactionId = getTransactionId();
  try {
    withScope((scope) => {
      scope.setTag("transaction_id", _transactionId);
    });
  } catch (err) {
    console.error(err);
    return "";
  }
  return _transactionId;
};
