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
  | 'finalStep';

export type StepManager = { step: Step; visited: boolean };

export type DisconnectedStatusWidgetConfig = {
  hideWhenNotLoggedIn?: boolean;
  loginSubtitle?: string;
  loginTitle?: string;
  showSubtitle?: boolean;
  showTitle?: boolean;
};
