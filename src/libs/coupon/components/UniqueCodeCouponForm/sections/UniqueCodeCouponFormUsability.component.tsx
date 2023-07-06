import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControlLabel, Switch, makeStyles } from '@material-ui/core';
import { useFormikContext } from 'formik';
import FormSection from '#components/forms/FormSection';
// @ts-expect-error
import { TextFieldEnhancedLabelWithError } from '../../../../../components/forms';
import { UniqueCodeCouponCreationPayload } from '#libs/coupon/types';

type Props = {
  isProcessing: boolean;
  isUsagePerMemberLimited: boolean;
  setIsUsagePerMemberLimited: React.Dispatch<React.SetStateAction<boolean>>;
};

const useStyles = makeStyles(() => ({
  usabilityContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const UniqueCodeCouponFormUsability: React.FC<Props> = ({
  isProcessing,
  isUsagePerMemberLimited,
  setIsUsagePerMemberLimited,
}) => {
  const { t } = useTranslation('coupon');

  const classes = useStyles();

  const { values, setFieldValue } =
    useFormikContext<UniqueCodeCouponCreationPayload>();

  const toggleUsagePerMemberLimit = useCallback(() => {
    setIsUsagePerMemberLimited(
      (previousIsUsagePerMemberLimited) => !previousIsUsagePerMemberLimited,
    );
  }, [setIsUsagePerMemberLimited]);

  const toggleFirstCheckoutLimit = useCallback(() => {
    setFieldValue('only_on_first_checkout', !values?.only_on_first_checkout);
  }, [setFieldValue, values?.only_on_first_checkout]);

  return (
    <FormSection
      id="unique-code-coupon-form-usability"
      sectionTitle={t('form.section.usability')}
    >
      <div
        id="unique-code-coupon-form-usability-container"
        className={classes.usabilityContainer}
      >
        <FormControlLabel
          control={
            <Switch
              id="unique-code-coupon-form-usage_per_member"
              checked={isUsagePerMemberLimited}
              onChange={toggleUsagePerMemberLimit}
              disabled={isProcessing}
            />
          }
          label={t('uniqueCodeCoupon.form.usage_per_member.label')}
        />
        {isUsagePerMemberLimited && (
          <TextFieldEnhancedLabelWithError
            id="unique-code-coupon-form-usage-limit"
            name="usage_per_member"
            label={t('uniqueCodeCoupon.form.usage_per_member.helperText')}
            fullWidth
            type="number"
            disabled={!isUsagePerMemberLimited || isProcessing}
            value={values.usage_per_member}
          />
        )}
        <FormControlLabel
          control={
            <Switch
              id="unique-code-coupon-form-first-checkout"
              checked={values.only_on_first_checkout}
              onChange={toggleFirstCheckoutLimit}
              disabled={isProcessing}
            />
          }
          label={t('uniqueCodeCoupon.form.only_on_first_checkout.label')}
        />
      </div>
    </FormSection>
  );
};

export default React.memo(UniqueCodeCouponFormUsability);
