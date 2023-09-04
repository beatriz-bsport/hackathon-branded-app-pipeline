import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
import { useFormikContext } from 'formik';
// @ts-expect-error
import { PriceField } from '#components/forms';
import FormSection from '#components/forms/FormSection';
import { FormikValues as EditReferralProgramFormikValues } from '../EditReferralProgramSettingsForm.component';

const EditReferralProgramSettingsFormReferringReward: React.FC = () => {
  const { t } = useTranslation('referral');
  const classes = useStyles();
  const { values } = useFormikContext<EditReferralProgramFormikValues>();
  return (
    <FormSection
      noDivider
      noPadding
      sectionTitle={t('form.rewardReferring.title')}
    >
      <div className={classes.flexColumn}>
        <PriceField
          fullWidth
          required
          className={classes.midWidth}
          id="amount-reward-referring"
          label={t('form.rewardReferring.label')}
          name="amount_reward_referring"
        />
        {values?.amount_reward_referring === 0 && (
          <Alert className={classes.alertWarning} severity="warning">
            {t('form.warnings.rewardReferring')}
          </Alert>
        )}
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
  midWidth: {
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  alertWarning: {
    marginTop: theme.spacing(1),
    width: '100%',
  },
}));

export default React.memo(EditReferralProgramSettingsFormReferringReward);
