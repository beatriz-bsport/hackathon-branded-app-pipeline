export type StatusCode = {
  id: number;
  text: string;
};

export const SUCCEEDED: StatusCode = {
  id: 0,
  text: 'succeeded',
};

export const FAILED: StatusCode = {
  id: 1,
  text: 'failed',
};

export const PENDING: StatusCode = {
  id: 2,
  text: 'pending',
};

export const CANCELED: StatusCode = {
  id: 3,
  text: 'canceled',
};

export const PROCESSING: StatusCode = {
  id: 4,
  text: 'processing',
};

const PLANNED_INVOICE_STATUS: Array<StatusCode> = [
  SUCCEEDED,
  FAILED,
  PENDING,
  CANCELED,
  PROCESSING,
];

export default PLANNED_INVOICE_STATUS;
