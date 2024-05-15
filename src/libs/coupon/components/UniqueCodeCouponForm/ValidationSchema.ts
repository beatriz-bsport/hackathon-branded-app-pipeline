import {
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';

import { CouponUniqueCodeEditModeOptions } from '@bsport/common/lib/master-data/coupon';
import { DateTime } from 'luxon';

import * as Yup from 'yup';
import { LUXON_ISO_SHORT_DATE } from '#src/utils/datetime';

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required('coupon:uniqueCodeCoupon.form.errors.required'),
  is_active: Yup.boolean().required(),
  only_on_first_checkout: Yup.boolean().required(
    'coupon:uniqueCodeCoupon.form.errors.required',
  ),
  usage_per_member: Yup.number()
    .positive('coupon:uniqueCodeCoupon.form.errors.positiveNumber')
    .nullable(),
  applies_to: Yup.number().oneOf(
    [
      BUYABLE_ITEM_PASS,
      BUYABLE_ITEM_SHOP_ITEM,
      BUYABLE_ITEM_PRIVATE_PASS,
      BUYABLE_ITEM_COMBO_ITEM,
    ],
    'coupon:uniqueCodeCoupon.form.errors.applies_to',
  ),
  only_on_objects: Yup.array()
    .of(
      Yup.number().positive(
        'coupon:uniqueCodeCoupon.form.errors.positiveNumber',
      ),
    )
    .required('coupon:uniqueCodeCoupon.form.errors.only_on_objects'),
  expiration_date: Yup.date()
    .nullable()
    .test({
      name: 'isExpirationDateBeforeNow',
      test: function isInvalidExpirationDate(value) {
        if (value) {
          const isExpirationDateBeforeNow =
            DateTime.fromISO(value) < DateTime.now();
          if (isExpirationDateBeforeNow) {
            return this.createError({
              message:
                'coupon:uniqueCodeCoupon.form.errors.expirationDate.dateBeforeNow',
            });
          }
        }
        return true;
      },
    })
    .test({
      name: 'isExpirationDateWrongFormat',
      test: function isExpirationDateWrongFormat(value) {
        if (value) {
          // replicate the format we implement inside the handle submit
          const formatedDate =
            DateTime.fromISO(value).toFormat(LUXON_ISO_SHORT_DATE);
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          const isValidDateFormat = dateRegex.test(formatedDate);
          if (!isValidDateFormat) {
            return this.createError({
              message:
                'coupon:uniqueCodeCoupon.form.errors.expirationDate.format',
            });
          }
        }
        return true;
      },
    }),
  coupon_cost_for_company: Yup.number()
    .typeError('coupon:uniqueCodeCoupon.form.errors.required')
    .positive('coupon:uniqueCodeCoupon.form.errors.positiveNumber')
    .required('coupon:uniqueCodeCoupon.form.errors.required')
    .test(
      'is-float-with-max-two-digits',
      'Must be a float with max two digits',
      (value) => {
        if (!value) return true;
        if (typeof value !== 'number') return false;
        const floatRegex = /^\d+(\.\d{1,2})?$/; // Regular expression to match float with max two digits
        return floatRegex.test(String(value));
      },
    ),
  codes: Yup.array()
    .of(Yup.string())
    .required('coupon:uniqueCodeCoupon.form.errors.required')
    .test(
      'is-codes-an-empty-array',
      'You must add at least one code',
      (value) => {
        return value.length > 0;
      },
    ),
});

export const ValidationSchemaOnUpdate = ValidationSchema.shape({
  update_mode: Yup.number()
    .nullable()
    .oneOf(
      [
        CouponUniqueCodeEditModeOptions.COUPON_UNIQUE_CODE_EDIT_MODE_APPEND,
        CouponUniqueCodeEditModeOptions.COUPON_UNIQUE_CODE_EDIT_MODE_REPLACE,
        null,
      ],
      'coupon:uniqueCodeCoupon.form.errors.update_mode',
    ),
  codes: Yup.array()
    .of(Yup.string())
    .nullable()
    .test(
      'is-codes-an-empty-array',
      'coupon:uniqueCodeCoupon.form.errors.codes.emptyArray',
      function isCodesAnEmptyArray(value) {
        if (this.parent.update_mode !== null)
          return !!value && value.length > 0;
        return true;
      },
    )
    .test(
      'is-uploading-codes-without-update-mode-selected',
      'coupon:uniqueCodeCoupon.form.errors.codes.updateMode',
      function isUpdateModeUnselectedWhenUploadingCodes(value) {
        if (value) {
          return this.parent.update_mode !== null && value.length > 0;
        }
        return true;
      },
    ),
});

export default ValidationSchema;
