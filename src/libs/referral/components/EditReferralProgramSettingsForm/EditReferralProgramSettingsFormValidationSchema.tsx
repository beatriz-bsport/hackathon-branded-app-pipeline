import * as Yup from 'yup';
import {
  ReferredVoucherTypeChoices,
  ReferralTimeLimitUnits,
} from '#libs/referral/constants';

const regexHTTP = /https?:\/\//;

const EditReferralProgramSettingsFormValidationSchema = Yup.object().shape({
  is_referral_program_activated: Yup.boolean().required(),

  minimum_basket_amount: Yup.number()
    // used min and not positive because the field can be 0
    .min(0, 'form.errors.minimumAmount')
    .required('form.errors.required'),

  maximum_referral_uses: Yup.number()
    .integer()
    .positive('form.errors.maximumUses')
    .required('referral::form.errors.required'),

  referred_voucher_type: Yup.string()
    .oneOf([
      ReferredVoucherTypeChoices.REFERRED_VOUCHER_TYPE_AMOUNT,
      ReferredVoucherTypeChoices.REFERRED_VOUCHER_TYPE_PERCENT,
    ])
    .required('form.errors.required'),

  amount_off_referred: Yup.number()
    // used min and not positive because the field can be 0
    .min(0, 'form.errors.referredAmount')
    .when('referred_voucher_type', {
      is: ReferredVoucherTypeChoices.REFERRED_VOUCHER_TYPE_AMOUNT,
      then: Yup.number().required('form.errors.required'),
    }),

  percent_off_referred: Yup.number()
    // used min and not positive because the field can be 0
    .min(0, 'form.errors.referredAmount')
    .when('referred_voucher_type', {
      is: ReferredVoucherTypeChoices.REFERRED_VOUCHER_TYPE_PERCENT,
      then: Yup.number().required('form.errors.required'),
    }),

  application_time_limit_intervals: Yup.number()
    .positive('form.errors.timeLimit')
    .required('form.errors.required'),

  application_time_limit_unit: Yup.string()
    .oneOf([
      ReferralTimeLimitUnits.DAYS,
      ReferralTimeLimitUnits.WEEKS,
      ReferralTimeLimitUnits.MONTHS,
    ])
    .required('form.errors.required'),

  amount_reward_referring: Yup.number()
    // used min and not positive because the field can be 0
    .min(0, 'form.errors.rewardReferring')
    .required('form.errors.required'),

  redirect_link: Yup.string()
    .nullable()
    .test('is-url-format', 'form.errors.url', (val) => {
      if (!val || regexHTTP.test(val)) {
        return true;
      }
      return false;
    }),
});

export default EditReferralProgramSettingsFormValidationSchema;
