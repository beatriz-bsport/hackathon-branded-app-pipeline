export type StripeReader = {
  id: string;
  device_type: string;
  label: string;
  location: string;
  serial_number: string;
  status: string;
};

export type TerminalState = {
  reader: {
    byId: { [key: string]: StripeReader };
    allIds: [string];
    loading: boolean;
    error: Error;
  };
};

export type ConnectionToken = {
  objet: string;
  secret: string;
};

export type ProcessPaymentIntentPayload = {
  payment_intent_id: string;
};

export type ProcessSetupIntentPayload = {
  setup_intent_id: string;
};

export enum ReaderActionStatus {
  SUCCEEDED = 'succeeded',
  IN_PROGRESS = 'in_progress',
  FAILED = 'failed',
}

export type ReaderActionSumup = {
  reader_id: string;
  action_type: string;
  failure_code: string | null;
  failure_message: string | null;
  status: ReaderActionStatus;
  stripe_resource_id: string;
  stripe_timestamp_created: number;
};

export type CancelReaderActionErrorMessage = {
  title: string;
  content: string;
};

export enum TerminalPaymentSteps {
  SETTINGS = 'settings',
  PROCESSING = 'processing',
  ERROR = 'error',
  SUCCESS = 'success',
}
