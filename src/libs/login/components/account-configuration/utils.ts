import { StepManager } from '#libs/login/types';

export const buildSteps = ({
  has_no_need_for_stripe_configuration,
  has_visited_stripe_configuration,
  has_no_need_for_bank_account_configuration,
  has_visited_bank_account_configuration,
  has_no_need_for_payment_method_configuration,
  has_visited_payment_method_configuration,
  no_last_step,
  has_visited_last_step,
}: {
  has_no_need_for_stripe_configuration: boolean;
  has_visited_stripe_configuration: boolean;
  has_no_need_for_bank_account_configuration: boolean;
  has_visited_bank_account_configuration: boolean;
  has_no_need_for_payment_method_configuration: boolean;
  has_visited_payment_method_configuration: boolean;
  no_last_step: boolean;
  has_visited_last_step: boolean;
}) => {
  const res = [] as Array<StepManager>;
  if (!has_no_need_for_stripe_configuration) {
    res.push({ step: 'stripeStep', visited: has_visited_stripe_configuration });
  }
  if (
    !has_no_need_for_bank_account_configuration &&
    !has_no_need_for_stripe_configuration
  ) {
    res.push({
      step: 'bankAccountStep',
      visited: has_visited_bank_account_configuration,
    });
  }

  if (!has_no_need_for_payment_method_configuration) {
    res.push({
      step: 'paymentMethodStep',
      visited: has_visited_payment_method_configuration,
    });
  }
  if (!no_last_step) {
    res.push({
      step: 'finalStep',
      visited: has_visited_last_step,
    });
  }
  return res;
};
