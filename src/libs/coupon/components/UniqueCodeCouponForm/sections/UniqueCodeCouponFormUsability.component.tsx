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
        className={classes.usabilityContainer}
        id="unique-code-coupon-form-usability-container"
      >
        <FormControlLabel
          control={
            <Switch
              checked={isUsagePerMemberLimited}
              disabled={isProcessing}
              id="unique-code-coupon-form-usage_per_member"
              onChange={toggleUsagePerMemberLimit}
            />
          }
          label={t('uniqueCodeCoupon.form.usage_per_member.label')}
        />
        {isUsagePerMemberLimited && (
          <TextFieldEnhancedLabelWithError
            fullWidth
            disabled={!isUsagePerMemberLimited || isProcessing}
            id="unique-code-coupon-form-usage-limit"
            label={t('uniqueCodeCoupon.form.usage_per_member.helperText')}
            name="usage_per_member"
            type="number"
            value={values.usage_per_member}
          />
        )}
        <FormControlLabel
          control={
            <Switch
              checked={values.only_on_first_checkout}
              disabled={isProcessing}
              id="unique-code-coupon-form-first-checkout"
              onChange={toggleFirstCheckoutLimit}
            />
          }
          label={t('uniqueCodeCoupon.form.only_on_first_checkout.label')}
        />
      </div>
    </FormSection>
  );
};

export default React.memo(UniqueCodeCouponFormUsability);
