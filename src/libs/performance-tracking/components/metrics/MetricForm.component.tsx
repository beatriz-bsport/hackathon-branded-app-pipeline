import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Form, Formik, FormikProps } from 'formik';
import { Button, Grid, LinearProgress, Typography } from '@material-ui/core';
import * as Yup from 'yup';
import { useTheme } from '@material-ui/styles';
import {
  PerformanceTrackingMetric,
  PerformanceTrackingProgram,
} from '#libs/performance-tracking/types';
import {
  TextFieldEnhancedLabelWithError,
  ColorField,
  Submit,
} from '../../../../components/forms';

type OwnProps = {
  initial?: PerformanceTrackingMetric;
  metricList: Array<PerformanceTrackingMetric>;
  onCancel: () => void;
  formikProps: FormikProps<
    PerformanceTrackingProgram<PerformanceTrackingMetric>
  >;
};
type Props = OwnProps & WithTranslation;
export const MetricForm = (props: Props) => {
  const { t, initial, onCancel, metricList, formikProps } = props;
  const classes = useStyles();
  const theme: Theme = useTheme();
  const index_list = metricList ? metricList.map((metric) => metric.index) : [];
  const max_index =
    index_list && index_list.length !== 0 ? Math.max(...index_list) : -1;
  return (
    <div className={classes.formContainer}>
      <Formik
        enableReinitialize
        validationSchema={metricSchema}
        initialValues={
          initial
            ? { ...initial }
            : {
                id: null,
                name: '',
                color: theme.palette.primary.main,
                machine_id: '',
                min_value:
                  metricList?.length !== 0
                    ? metricList[metricList?.length - 1]?.min_value
                    : 0,
                max_value:
                  metricList?.length !== 0
                    ? metricList[metricList?.length - 1]?.max_value
                    : 99,
                default_value:
                  metricList?.length !== 0
                    ? metricList[metricList?.length - 1]?.default_value
                    : null,
                index: max_index + 1,
                is_disabled: false,
              }
        }
        onSubmit={(values, actions) => {
          if (initial) {
            const metric_list = formikProps.values.metric_list;
            const index = metric_list.findIndex(
              (metric) => metric.index === initial.index,
            );
            metric_list[index] = values;
            formikProps.setFieldValue('metric_list', metric_list);
          } else {
            const metric_list = formikProps.values.metric_list;
            metric_list.push(values);
            formikProps.setFieldValue('metric_list', metric_list);
          }
          actions.setSubmitting(false);
          onCancel();
        }}
      >
        {(metricFormikProps: FormikProps<PerformanceTrackingMetric>) => {
          return (
            <>
              <Form>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    <Typography className={classes.title}>
                      {t('metric.form.general')}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <TextFieldEnhancedLabelWithError
                      id="textfield_name"
                      fullWidth
                      name="name"
                      required
                      label={t('metric.form.name')}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextFieldEnhancedLabelWithError
                      id="machine_id"
                      fullWidth
                      name="machine_id"
                      label={t('metric.form.machine')}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <div className={classes.values}>
                      <TextFieldEnhancedLabelWithError
                        fullWidth
                        id="default_value"
                        key="default_value_id"
                        name="default_value"
                        type="number"
                        label={t('metric.form.default_value')}
                        helperText={t('metric.form.default_valueHelperText')}
                        inputProps={{ max: 99999 }}
                      />
                      <div className={classes.row}>
                        <div className={classes.midRow}>
                          <TextFieldEnhancedLabelWithError
                            fullWidth
                            id="min_value"
                            name="min_value"
                            type="number"
                            label={t('metric.form.minValue')}
                            helperText={t('metric.form.minValueHelperText')}
                            inputProps={{ max: 99999 }}
                          />
                        </div>
                        <div className={classes.midRow}>
                          <TextFieldEnhancedLabelWithError
                            fullWidth
                            id="max_value"
                            name="max_value"
                            type="number"
                            label={t('metric.form.maxValue')}
                            helperText={t('metric.form.maxValueHelperText')}
                            inputProps={{ max: 99999 }}
                          />
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <ColorField
                      label={t('metric.form.color')}
                      name="color"
                      defaultCompanyThemeColor
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <div className={classes.action}>
                    <Button onClick={onCancel} color="secondary">
                      {t('form.cancel')}
                    </Button>
                    <Submit>{t('form.validate')}</Submit>
                  </div>
                </Grid>
                {metricFormikProps.isSubmitting ? <LinearProgress /> : null}
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  title: {
    fontWeight: 500,
  },
  values: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    width: '100%',
  },
  midRow: {
    width: '50%',
  },
  row: {
    display: 'flex',
    gap: theme.spacing(4),
  },
  formContainer: {
    border: '1px solid black',
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1),
  },
  action: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
}));
export default compose<any, OwnProps>(withTranslation('performanceTracking'))(
  MetricForm,
);

const metricSchema = Yup.object().shape({
  name: Yup.string().required('performanceTracking:requiredField'),
  machine_id: Yup.string().nullable(),
  color: Yup.string(),
  min_value: Yup.number()
    .nullable()
    .required('performanceTracking:requiredField')
    .test(
      'minMax',
      'performanceTracking:metric.form.minMax',
      function testMinMax(item) {
        if (this.parent.max_value !== null && item !== null) {
          return item < this.parent.max_value;
        }
        return true;
      },
    ),

  max_value: Yup.number()
    .required('performanceTracking:requiredField')
    .nullable(),
  default_value: Yup.number()
    .nullable()
    .test(
      'defaultInRange',
      'performanceTracking:metric.form.range',
      function testDefaultInRange(item) {
        if (
          item !== null &&
          ((this.parent.max_value !== null && this.parent.max_value < item) ||
            (this.parent.min_value !== null && this.parent.min_value > item))
        ) {
          return false;
        }
        return true;
      },
    ),
});
