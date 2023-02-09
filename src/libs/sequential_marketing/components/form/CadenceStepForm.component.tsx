import React from 'react';

import { useTranslation } from 'react-i18next';

import * as Yup from 'yup';
import { withFormik, FormikProps, useFormikContext, Form } from 'formik';

import type { Theme } from '@material-ui/core/styles';

import makeStyles from '@material-ui/styles/makeStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { Submit, TextField } from '#components/forms';

import type { CadenceStep } from '#libs/sequential_marketing/types';
import type { OptionCallback } from '../../../../state/types';

export type ComponentProps = {
  step: CadenceStep;
  onSubmit: (data: { name: string }, options?: OptionCallback) => void;
};

export type FormProps = {
  initial?: CadenceStep;
  onSubmit: (data: Values, options: OptionCallback) => void;
};

export type Values = {
  name: string;
};

type FormikValues = FormikProps<Values>;

export const CadenceStepForm: React.FC = () => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();

  const { isSubmitting, isValid }: FormikValues = useFormikContext();

  return (
    <div className={classes.fullWidth}>
      <Typography variant="h6" className={classes.paddingBottom3}>
        {t('cadence.form.cadenceStep')}
      </Typography>
      <Divider />
      <div className={classes.paddingTop3}>
        <Form>
          <TextField
            name="name"
            label={t('cadence.form.cadenceStepNameLabel')}
            fullWidth
            required
          />
          <div className={classes.actions}>
            <Submit disabled={isSubmitting || !isValid} color="primary">
              {isSubmitting ? <CircularProgress /> : t('cadence.form.edit')}
            </Submit>
          </div>
        </Form>
      </div>
    </div>
  );
};

const CadenceStepUpdateSchema = Yup.object().shape({
  name: Yup.string().required(),
});

const formikFormWrapper = withFormik<ComponentProps & FormProps, Values>({
  mapPropsToValues: ({ step }: ComponentProps & FormProps) => {
    if (step) {
      return {
        id: step.id,
        name: step.name,
      };
    }
    return {
      id: null,
      name: '',
    };
  },
  enableReinitialize: true,
  validationSchema: CadenceStepUpdateSchema,
  handleSubmit: (values, { props: { onSubmit }, setSubmitting, resetForm }) => {
    onSubmit(values, {
      onSuccess: () => {
        setSubmitting(false);
        resetForm();
      },
      onError: () => setSubmitting(false),
    });
  },
});

const useStyles = makeStyles((theme: Theme) => ({
  fullWidth: {
    width: '100%',
  },
  paddingBottom3: {
    paddingBottom: theme.spacing(3),
  },
  paddingTop3: {
    paddingTop: theme.spacing(3),
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}));

export default formikFormWrapper(CadenceStepForm);
