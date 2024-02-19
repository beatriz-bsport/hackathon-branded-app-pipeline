import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  payment_method_available: Yup.array().of(Yup.number()).required(),
  payment_method_available_basket: Yup.array().of(Yup.number()).required(),
  payment_method_available_subscription: Yup.array()
    .of(Yup.number())
    .required()
    .min(1),
  payment_method_available_recurringly: Yup.array().of(Yup.number()).required(),
  cardBillingDetailsMandatory: Yup.boolean().required(),
  first_warning_payment_method_expiration_days: Yup.number()
    .max(100, 'paymentMethods.DaysBeforeNotificationInputs.errors.max')
    .min(1)
    .required(),
  second_warning_payment_method_expiration_days: Yup.number()
    .min(1)
    .required()
    .test({
      name: 'isSecondWarningDayBiggerThanFirst',
      test: function isSecondWarningDayBiggerThanFirst(value) {
        if (value) {
          const firstWarningDay =
            this.parent.first_warning_payment_method_expiration_days;
          if (value >= firstWarningDay) {
            return this.createError({
              message:
                'paymentMethods.DaysBeforeNotificationInputs.errors.secondWarningDayBiggerThanFirst',
            });
          }
        }
        return true;
      },
    }),
});
