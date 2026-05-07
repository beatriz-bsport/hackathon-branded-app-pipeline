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
