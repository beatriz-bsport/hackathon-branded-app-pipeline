import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFormikContext, Form, withFormik, type FormikProps } from 'formik';
import { BUYABLE_ITEM_PASS } from '@bsport/common/lib/master-data/buyable-items.js';
import { Theme, makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import { DateTime } from 'luxon';
import type {
  Coupon,
  UniqueCodeCouponUpdatePayload,
} from '#src/libs/coupon/types';

import { CouponErrorCodes } from '#src/libs/coupon/constants';
import type { OptionCallBackWithKeyedCallbacks } from '../../../../state/types';
import UniqueCodeCouponFormSkeleton from './UniqueCodeCouponFormSkeleton.component';
import UniqueCodeCouponFormGeneral from './sections/UniqueCodeCouponFormGeneral.component';
import ValidationSchema, { ValidationSchemaOnUpdate } from './ValidationSchema';
import UniqueCodeCouponFormSettings from './sections/UniqueCodeCouponFormSettings.component';
import UniqueCodeCouponFormAvailability from './sections/UniqueCodeCouponFormAvailability.component';
import UniqueCodeCouponFormUsability from './sections/UniqueCodeCouponFormUsability.component';
import UniqueCodeCouponFormUpload from './sections/UniqueCodeCouponFormUpload.component';

type ComponentProps = {
  uniqueCodeCoupon?: Coupon;
  onCancel: () => void;
  isLoading: boolean;
  isProcessing: boolean;
  withExpirationDate: boolean;
  setWithExpirationDate: React.Dispatch<React.SetStateAction<boolean>>;
  isUsagePerMemberLimited: boolean;
  setIsUsagePerMemberLimited: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessages: { [errorCode: number]: string };
  displayNewWebshop: boolean;
};

type UniqueCodeCouponPayload = UniqueCodeCouponUpdatePayload;

type FormProps = {
  onSubmit: (
    data: UniqueCodeCouponPayload,
    options?: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
  ) => void;
};

type Props = ComponentProps & FormikProps<UniqueCodeCouponPayload>;

const useStyles = makeStyles((theme: Theme) => ({
  buttonsContainer: {
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

export const UniqueCodeCouponForm: React.FC<Props> = React.memo(
  ({
    onCancel,
    isLoading,
    isProcessing,
    withExpirationDate,
    setWithExpirationDate,
    isUsagePerMemberLimited,
    setIsUsagePerMemberLimited,
    uniqueCodeCoupon,
    displayNewWebshop,
  }) => {
    const { t } = useTranslation('coupon');

    const classes = useStyles();

    const { handleSubmit, isValid, isSubmitting } =
      useFormikContext<UniqueCodeCouponPayload>();

    if (isLoading && !isSubmitting) {
      return (
        <div data-testid="unique-code-coupon-form">
          <UniqueCodeCouponFormSkeleton />
        </div>
      );
    }
    return (
      <Form
        noValidate
        data-testid="unique-code-coupon-form"
        onSubmit={handleSubmit}
      >
        <UniqueCodeCouponFormGeneral isProcessing={isProcessing} />

        <UniqueCodeCouponFormSettings
          displayNewWebshop={displayNewWebshop}
          isProcessing={isProcessing}
        />

        <UniqueCodeCouponFormAvailability
          isProcessing={isProcessing}
          setWithExpirationDate={setWithExpirationDate}
          withExpirationDate={withExpirationDate}
        />

        <UniqueCodeCouponFormUsability
          isProcessing={isProcessing}
          isUsagePerMemberLimited={isUsagePerMemberLimited}
          setIsUsagePerMemberLimited={setIsUsagePerMemberLimited}
        />

        <UniqueCodeCouponFormUpload
          isProcessing={isProcessing}
          uniqueCodeCoupon={uniqueCodeCoupon}
        />

        <div
          className={classes.buttonsContainer}
          id="unique-code-coupon-form-actions"
        >
          <Button onClick={onCancel}>{t('form.actions.cancel')}</Button>
          <Button
            color="primary"
            disabled={isProcessing || !isValid}
            type="submit"
            variant="contained"
          >
            {t('form.actions.submit')}
          </Button>
        </div>
      </Form>
    );
  },
);

const formikFormWrapper = withFormik<
  ComponentProps & FormProps,
  UniqueCodeCouponPayload
>({
  mapPropsToValues: ({ uniqueCodeCoupon }) => {
    if (uniqueCodeCoupon) {
      return {
        name: uniqueCodeCoupon.name,
        is_active: uniqueCodeCoupon.is_active,
        only_on_first_checkout: uniqueCodeCoupon.only_on_first_checkout,
        usage_per_member: uniqueCodeCoupon.usage_per_member,
        applies_to: uniqueCodeCoupon.applies_to,
        only_on_objects: uniqueCodeCoupon.only_on_objects,
        expiration_date: uniqueCodeCoupon.expiration_date
          ? DateTime.fromISO(uniqueCodeCoupon.expiration_date)
          : null,
        coupon_cost_for_company: uniqueCodeCoupon.coupon_cost_for_company,
        codes: null,
        update_mode: null,
      };
    }
    const initialExpirationDate = DateTime.now().plus({ month: 1 });
    return {
      name: '',
      is_active: false,
      only_on_first_checkout: false,
      usage_per_member: 1,
      applies_to: BUYABLE_ITEM_PASS,
      only_on_objects: [],
      expiration_date: initialExpirationDate,
      coupon_cost_for_company: null,
      codes: [],
    };
  },
  handleSubmit: (
    values,
    {
      props: {
        onSubmit,
        withExpirationDate,
        isUsagePerMemberLimited,
        errorMessages,
      },
      setSubmitting,
      setFieldError,
    },
  ) => {
    const {
      name,
      is_active,
      only_on_first_checkout,
      usage_per_member,
      applies_to,
      only_on_objects,
      expiration_date,
      coupon_cost_for_company,
      codes,
      update_mode,
    } = values;

    const formatedDate =
      withExpirationDate &&
      expiration_date &&
      typeof expiration_date !== 'string'
        ? expiration_date.toISODate()
        : null;

    const uniqueCodeCoupon = {
      name,
      is_active,
      only_on_first_checkout,
      usage_per_member: isUsagePerMemberLimited ? usage_per_member : null,
      applies_to,
      only_on_objects,
      expiration_date: formatedDate,
      coupon_cost_for_company,
      codes,
      update_mode,
    };

    onSubmit(uniqueCodeCoupon, {
      onSuccess: () => setSubmitting(false),
      onError: () => setSubmitting(false),
      [CouponErrorCodes.COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS]: () =>
        setFieldError(
          'codes',
          errorMessages[
            CouponErrorCodes.COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS
          ],
        ),
      [CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT]: () =>
        setFieldError(
          'codes',
          errorMessages[
            CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT
          ],
        ),
      [CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT]: () =>
        setFieldError(
          'codes',
          errorMessages[
            CouponErrorCodes.UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT
          ],
        ),
    });
  },
  validationSchema: (props: ComponentProps) =>
    props.uniqueCodeCoupon ? ValidationSchemaOnUpdate : ValidationSchema,
});

export default formikFormWrapper(UniqueCodeCouponForm);
