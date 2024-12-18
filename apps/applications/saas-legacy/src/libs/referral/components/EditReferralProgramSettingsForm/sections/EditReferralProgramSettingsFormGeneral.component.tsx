import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@material-ui/lab';
import { makeStyles, Typography } from '@material-ui/core';
import classNames from 'classnames';
import { useFormikContext } from 'formik';
// @ts-expect-error
import { PriceField, IntegerField } from '#src/components/forms';
import FormSection from '#src/components/forms/FormSection';
import { FormikValues as EditReferralProgramFormikValues } from '../EditReferralProgramSettingsForm.component';

const EditReferralProgramSettingsFormGeneral: React.FC = () => {
  const { t } = useTranslation('referral');
  const classes = useStyles();
  const { errors } = useFormikContext<EditReferralProgramFormikValues>();
  return (
    <FormSection noDivider noPadding>
      <div className={classes.flexRow}>
        <div className={classNames(classes.flexColumn, classes.midWidth)}>
          <PriceField
            required
            id="minimum-basket-amount"
            label={t('form.minimumBasketAmount.label')}
            name="minimum_basket_amount"
          />
          <Typography color="textSecondary" variant="caption">
            {t('form.minimumBasketAmount.description')}
          </Typography>
        </div>
        <div className={classNames(classes.flexColumn, classes.midWidth)}>
          <IntegerField
            required
            id="maximum-referral-uses"
            label={t('form.maximumUses.label')}
            name="maximum_referral_uses"
          />
          {!!errors?.maximum_referral_uses && (
            <Alert severity="error">{t(errors?.maximum_referral_uses)}</Alert>
          )}
        </div>
      </div>
    </FormSection>
  );
};

const useStyles = makeStyles((theme) => ({
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    gap: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap',
    },
  },
  midWidth: {
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}));

export default React.memo(EditReferralProgramSettingsFormGeneral);
