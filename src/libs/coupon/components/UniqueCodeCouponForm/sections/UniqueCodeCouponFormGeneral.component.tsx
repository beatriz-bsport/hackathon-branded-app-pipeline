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
        id="unique-code-coupon-form-main-alert"
        severity="info"
        className={classes.alert}
      >
        {t('uniqueCodeCoupon.form.alertInfo')}
      </Alert>
      <TextFieldEnhancedLabelWithError
        id="unique-code-coupon-form-name-input"
        name="name"
        label={t('form.name.label')}
        fullWidth
        required
        disabled={isProcessing}
      />
      <TextFieldEnhancedLabelWithError
        id="unique-code-coupon-form-price-input"
        type="number"
        name="coupon_cost_for_company"
        label={t('uniqueCodeCoupon.form.couponCostForCompany.label')}
        helperText={t('uniqueCodeCoupon.form.couponCostForCompany.helperText')}
        fullWidth
        required
        disabled={isProcessing}
      />
    </FormSection>
  );
};

export default React.memo(UniqueCodeCouponFormGeneral);
