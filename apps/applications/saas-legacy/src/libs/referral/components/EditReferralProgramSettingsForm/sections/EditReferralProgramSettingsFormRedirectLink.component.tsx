import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@material-ui/lab';
import { makeStyles, Typography } from '@material-ui/core';
import { useFormikContext } from 'formik';
// @ts-expect-error
import { TextField } from '#src/components/forms';
import FormSection from '#src/components/forms/FormSection';
import { FormikValues as EditReferralProgramFormikValues } from '../EditReferralProgramSettingsForm.component';

const EditReferralProgramSettingsFormRedirectLink: React.FC = () => {
  const { t } = useTranslation('referral');
  const classes = useStyles();
  const { errors } = useFormikContext<EditReferralProgramFormikValues>();
  return (
    <FormSection
      noDivider
      noPadding
      sectionTitle={t('form.redirectLink.title')}
    >
      <Typography color="textSecondary" variant="caption">
        {t('form.redirectLink.description')}
      </Typography>
      <div className={classes.textField}>
        <TextField
          fullWidth
          id="redirect-link"
          name="redirect_link"
          placeholder={t('form.redirectLink.placeholder')}
          size="small"
          variant="outlined"
        />
        {!!errors?.redirect_link && (
          <Alert severity="error">{t(errors?.redirect_link)}</Alert>
        )}
      </div>
    </FormSection>
  );
};

const useStyles = makeStyles((theme) => ({
  textField: {
    marginTop: theme.spacing(1),
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}));

export default React.memo(EditReferralProgramSettingsFormRedirectLink);
