import React from 'react';
import { useTranslation } from 'react-i18next';
import { withFormik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core';

import { OptionCallback } from '../../../state/types';
// @ts-expect-error
import { SwitchField } from '#components/forms';

interface FormikValues {
  is_two_way_email_activated: boolean;
}
type Props = {
  is_two_way_email_activated: boolean;
  updateCommunicationProviderSettingsAction: (
    kind: string,
    data: FormikValues,
    options: OptionCallback,
  ) => void;
  fetchCompanyTheme: (companyID: number) => void;
  processing: boolean;
  companyId: number;
};

const CommunicationPersonalizeForm: React.FC<FormikProps<FormikValues>> = ({
  isSubmitting,
  isValid,
  handleSubmit,
}) => {
  const { t } = useTranslation('communication');
  const classes = useStyles();

  return (
    <Form onSubmit={handleSubmit}>
      <div className={classes.main}>
        <div className={classes.section}>
          <Typography className={classes.namesHeader}>
            {t('forms.title')}
          </Typography>
          <SwitchField
            label={t('forms.twoWayEmail.title')}
            name="is_two_way_email_activated"
          />
          <Typography color="textSecondary" variant="caption">
            {t('forms.twoWayEmail.description')}
          </Typography>
        </div>
      </div>
      <Button
        className={classes.confirm}
        color="primary"
        disabled={isSubmitting || !isValid}
        type="submit"
        variant="contained"
      >
        {t('forms.submit')}
      </Button>
    </Form>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  namesHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: 0,
    marginLeft: 0,
  },
  confirm: {
    marginTop: theme.spacing(2),
  },
}));

const CommunicationPersonalizeFormSchema = Yup.object().shape({
  is_two_way_email_activated: Yup.boolean().required(),
});

const CommunicationPersonalizeFormFormikHOC = withFormik<Props, FormikValues>({
  mapPropsToValues: ({ is_two_way_email_activated }) => {
    return {
      is_two_way_email_activated,
    };
  },
  validationSchema: CommunicationPersonalizeFormSchema,
  handleSubmit: (
    values,
    {
      props: {
        updateCommunicationProviderSettingsAction,
        fetchCompanyTheme,
        companyId,
      },
      setSubmitting,
    },
  ) => {
    updateCommunicationProviderSettingsAction('email', values, {
      onSuccess: () => {
        setSubmitting(false);
        fetchCompanyTheme(companyId);
      },
      onError: () => setSubmitting(false),
    });
  },
});

export default CommunicationPersonalizeFormFormikHOC(
  CommunicationPersonalizeForm,
);
