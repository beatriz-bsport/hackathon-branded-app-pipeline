export type TempPasswordState = {
  password?: string;
  expiration_date?: string;
  error?: Error;
  loading: boolean;
};

export type LoginState = {
  tempPassword: TempPasswordState;
};

type Step =
  | 'welcome'
  | 'stripeStep'
  | 'bankAccountStep'
  | 'paymentMethodStep'
  | 'invoiceNumberingStep'
  | 'finalStep';

export type StepManager = { step: Step; visited: boolean };

export type DisconnectedStatusWidgetConfig = {
  loginSubtitle?: string;
  loginTitle?: string;
  showSubtitle?: boolean;
  showTitle?: boolean;
};
