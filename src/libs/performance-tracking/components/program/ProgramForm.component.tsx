import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { useTheme } from '@material-ui/styles';
import {
  Button,
  Divider,
  Grid,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import { Info } from '@material-ui/icons';
import { MAX_LENGTH_FOR_LONG_ANSWER } from '@bsport/common/lib/master-data/custom-form';

import { OptionCallback } from '../../../../state/types';
import {
  TextFieldEnhancedLabelWithError,
  ColorField,
  IconField,
} from '../../../../components/forms';
import {
  PerformanceTrackingMetric,
  PerformanceTrackingProgram,
} from '#libs/performance-tracking/types';
import { CheckboxField } from '#libs/custom-form/components/GenericFormik.input';
import MetricConfigurationTable from '../metrics/MetricConfigurationTable.component';

type OwnProps = {
  submit: (
    program: PerformanceTrackingProgram,
    options?: OptionCallback<PerformanceTrackingProgram>,
  ) => void;
  initial?: PerformanceTrackingProgram<PerformanceTrackingMetric>;
  closeDialog?: () => void;
  resetInitial?: () => void;
};
type Props = OwnProps & WithTranslation;

export const ProgramForm = (props: Props) => {
  const { t, initial, closeDialog, resetInitial, submit } = props;

  const classes = useStyles();
  const theme: Theme = useTheme();
  return (
    <div>
      <Formik
        enableReinitialize
        validationSchema={programSchema}
        initialValues={
          initial?.id
            ? {
                ...initial,
                metric_list: initial?.metric_list
                  ? [...initial?.metric_list]
                  : [],
              }
            : {
                name: '',
                description: '',
                color: theme.palette.primary.main,
                is_disabled: false,
                icon: '',
                is_default: false,
                metric_list: [],
              }
        }
        onSubmit={(values, actions) => {
          submit(values, {
            onSuccess: () => {
              actions.setSubmitting(false);
              closeDialog && closeDialog();
              resetInitial && resetInitial();
            },
            onError: () => {
              actions.setSubmitting(false);
              closeDialog && closeDialog();
              resetInitial && resetInitial();
            },
          });
        }}
      >
        {(
          formikProps: FormikProps<
            PerformanceTrackingProgram<PerformanceTrackingMetric>
          >,
        ) => {
          return (
            <form onSubmit={formikProps.handleSubmit}>
              <div className={classes.container}>
                <div className={classes.padding}>
                  <Grid container spacing={4}>
                    <Grid item xs={12}>
                      <Typography className={classes.title} variant="h4">
                        {t('program.form.create')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.row}>
                        <div className={classes.icon}>
                          <Info />
                        </div>
                        <Typography variant="h5">
                          {t('program.form.generalInfo')}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <TextFieldEnhancedLabelWithError
                        id="name"
                        fullWidth
                        name="name"
                        required
                        label={t('program.form.name')}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextFieldEnhancedLabelWithError
                        name="description"
                        variant="outlined"
                        label={t('program.form.description')}
                        fullWidth
                        multiline
                        rows={4}
                        inputProps={{ maxlength: MAX_LENGTH_FOR_LONG_ANSWER }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <ColorField
                        label={t('program.form.color')}
                        name="color"
                        defaultCompanyThemeColor
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <IconField name="icon" />
                    </Grid>
                    <Grid item xs={12}>
                      <div className={classes.checkbox}>
                        <CheckboxField name="is_default" />
                        <Typography>{t('program.form.default')}</Typography>
                      </div>
                    </Grid>
                  </Grid>
                </div>
                <Divider />
                <div className={classes.padding}>
                  <MetricConfigurationTable
                    metricList={formikProps.values.metric_list.filter(
                      (metric) => !metric?.is_disabled,
                    )}
                    formikProps={formikProps}
                  />
                </div>

                <Divider />

                <div className={classes.action}>
                  <Button
                    color="secondary"
                    onClick={() => {
                      closeDialog && closeDialog();
                      resetInitial && resetInitial();
                    }}
                  >
                    {t('form.cancel')}
                  </Button>
                  <Button color="primary" type="submit" variant="outlined">
                    {t('form.save')}
                  </Button>
                </div>
              </div>
              {formikProps.isSubmitting ? <LinearProgress /> : null}
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

const useStyles = makeStyles<Theme>((theme) => ({
  icon: {
    display: 'flex',
    alignItems: 'center',
    color: '#868686',
  },
  title: {
    fontWeight: 500,
  },
  row: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  checkbox: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  padding: {
    padding: theme.spacing(4),
  },
  action: {
    padding: theme.spacing(4),
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
}));
export default compose<any, OwnProps>(withTranslation('performanceTracking'))(
  ProgramForm,
);
const programSchema = Yup.object().shape({
  name: Yup.string().required('performanceTracking:requiredField'),
  description: Yup.string(),
  icon: Yup.string(),
  is_default: Yup.boolean(),
});
