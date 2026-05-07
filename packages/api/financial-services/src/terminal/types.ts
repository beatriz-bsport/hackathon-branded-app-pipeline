export type StripeReader = {
  id: string;
  device_type: string;
  label: string;
  location: string;
  serial_number: string;
  status: string;
};

type WrappedStripeReadersResponse = {
  data?: StripeReader[];
};

export type FetchStripeReadersResponse =
  | StripeReader[]
  | WrappedStripeReadersResponse;

export enum ReaderActionStatus {
  SUCCEEDED = "succeeded",
  IN_PROGRESS = "in_progress",
  FAILED = "failed",
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

export type ProcessPaymentIntentPayload = {
  payment_intent_id: string;
  save_for_later: boolean;
};
