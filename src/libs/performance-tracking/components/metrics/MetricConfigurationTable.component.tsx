import React, { useState } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Button, Collapse, Paper, Typography } from '@material-ui/core';
import { Add, InsertChart, Warning } from '@material-ui/icons';

import { FieldArrayRenderProps } from 'formik';
import MetricList from './MetricList.component';
import {
  PerformanceTrackingMetric,
  PerformanceTrackingProgram,
} from '#libs/performance-tracking/types';
import MetricForm from './MetricForm.component';

type OwnProps = {
  metricList: Array<PerformanceTrackingMetric>;
  fieldArrayHelpers: FieldArrayRenderProps;
  values: PerformanceTrackingProgram<PerformanceTrackingMetric<number>>;
};
type Props = OwnProps & WithTranslation;
export const MetricConfigurationTable = (props: Props) => {
  const { t, metricList, values, fieldArrayHelpers } = props;

  const classes = useStyles();
  const [openCreationMetricForm, setOpenCreationMetricForm] =
    useState<boolean>(false);
  const [openCreationMetricFormDelay, setOpenCreationMetricFormDelay] =
    useState<boolean>(false);
  const [metricToEdit, setMetricToEdit] =
    useState<PerformanceTrackingMetric>(null);

  return (
    <div className={classes.column}>
      <div className={classes.textAndIcon}>
        <div className={classes.icon}>
          <InsertChart />
        </div>
        <Typography variant="h6" className={classes.subtitle}>
          {t('metric.title')}
        </Typography>
      </div>
      <Button
        variant="outlined"
        color="primary"
        className={classes.button}
        disabled={openCreationMetricForm}
        onClick={() => {
          setOpenCreationMetricForm(true);
          setTimeout(() => {
            setOpenCreationMetricFormDelay(true);
          }, 50);
        }}
      >
        <div className={classes.textAndIcon}>
          <Add />
          <Typography>{t('metric.form.addMetric')}</Typography>
        </div>
      </Button>

      {openCreationMetricForm && (
        <Collapse in={openCreationMetricFormDelay}>
          <MetricForm
            values={values}
            onCancel={() => {
              setOpenCreationMetricFormDelay(false);
              setTimeout(() => {
                setOpenCreationMetricForm(false);
              }, 300);
              setMetricToEdit(null);
            }}
            initial={metricToEdit}
            metricList={metricList}
            fieldArrayHelpers={fieldArrayHelpers}
          />
        </Collapse>
      )}

      {metricList && metricList.length !== 0 ? (
        <MetricList
          fieldArrayHelpers={fieldArrayHelpers}
          sortable
          metricList={metricList}
          onEdit={(metric) => {
            setMetricToEdit(metric);
            setOpenCreationMetricForm(true);
            setTimeout(() => {
              setOpenCreationMetricFormDelay(true);
            }, 50);
          }}
          onDelete={(metric) => {
            const index = values.metric_list.findIndex(
              (m) => m?.index === metric?.index,
            );
            fieldArrayHelpers.replace(index, {
              ...values.metric_list[index],
              is_disabled: true,
            });
          }}
        />
      ) : (
        <Paper className={classes.paper}>
          <div className={classes.textAndIcon}>
            <Warning className={classes.warning} />
            <Typography className={classes.noMetric}>
              {t('metric.form.noMetric')}
            </Typography>
          </div>
        </Paper>
      )}
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  subtitle: { fontWeight: 500 },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
  textAndIcon: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    color: '#868686',
  },
  button: {
    maxWidth: theme.spacing(34),
  },
  paper: {
    padding: theme.spacing(4),
    borderLeft: `3px solid ${theme.palette.error.main}`,
  },
  noMetric: {
    fontWeight: 500,
  },
  warning: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    color: theme.palette.error.main,
  },
}));
export default compose<any, OwnProps>(withTranslation('performanceTracking'))(
  MetricConfigurationTable,
);
