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
