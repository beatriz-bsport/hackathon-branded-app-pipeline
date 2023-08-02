import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
// @ts-expect-error
import { TextFieldEnhancedLabelWithError } from '../../../../../components/forms';
import FormSection from '#components/forms/FormSection';

type Props = {
  isProcessing: boolean;
};

const useStyles = makeStyles(() => ({
  alert: {
    alignItems: 'center',
  },
}));

const UniqueCodeCouponFormGeneral: React.FC<Props> = ({ isProcessing }) => {
  const { t } = useTranslation('coupon');
  const classes = useStyles();
  return (
    <FormSection
      id="unique-code-coupon-form-general"
      sectionTitle={t('form.section.general')}
    >
      <Alert
        className={classes.alert}
        id="unique-code-coupon-form-main-alert"
        severity="info"
      >
        {t('uniqueCodeCoupon.form.alertInfo')}
      </Alert>
      <TextFieldEnhancedLabelWithError
        fullWidth
        required
        disabled={isProcessing}
        id="unique-code-coupon-form-name-input"
        label={t('form.name.label')}
        name="name"
      />
      <TextFieldEnhancedLabelWithError
        fullWidth
        required
        disabled={isProcessing}
        helperText={t('uniqueCodeCoupon.form.couponCostForCompany.helperText')}
        id="unique-code-coupon-form-price-input"
        label={t('uniqueCodeCoupon.form.couponCostForCompany.label')}
        name="coupon_cost_for_company"
        type="number"
      />
    </FormSection>
  );
};

export default React.memo(UniqueCodeCouponFormGeneral);
