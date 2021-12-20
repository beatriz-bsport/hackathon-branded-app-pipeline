import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { SortableContainer } from 'react-sortable-hoc';
import { FormikProps } from 'formik';
import { Paper, Typography } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import Skeleton from '@material-ui/lab/Skeleton';
import {
  PerformanceTrackingMetric,
  PerformanceTrackingProgram,
} from '#libs/performance-tracking/types';
import MetricListItem from './MetricListItem.component';
import { organize_index } from '#libs/performance-tracking/utils';

const Container = SortableContainer((props: any) => {
  return <div>{props.children}</div>;
});

type OwnProps = {
  metricList: Array<PerformanceTrackingMetric>;
  formikProps?: FormikProps<
    PerformanceTrackingProgram<PerformanceTrackingMetric>
  >;
  onEdit?: (metric: PerformanceTrackingMetric) => void;
  onDelete?: (metric: PerformanceTrackingMetric) => void;
  sortable?: boolean;
  loading?: boolean;
};
type Props = OwnProps & WithTranslation;
export const MetricList = (props: Props) => {
  const classes = useStyles();
  const { metricList, onEdit, formikProps, onDelete, sortable, t, loading } =
    props;
  if (loading) {
    return (
      <div className={classes.content}>
        {[0, 0, 0].map(() => (
          <Skeleton animation="wave" width="100%" variant="rect" height={51} />
        ))}
      </div>
    );
  }
  if (sortable) {
    return (
      <>
        <Container
          useDragHandle
          transitionDuration={500}
          hideSortableGhost={false}
          onSortEnd={(e) => {
            const oldIndex = e.oldIndex;
            const newIndex = e.newIndex;
            formikProps.setFieldValue(
              'metric_list',
              organize_index(oldIndex, newIndex, metricList),
            );
          }}
        >
          {metricList.map((metric) => (
            <MetricListItem
              metric={metric}
              onDelete={onDelete}
              onEdit={onEdit}
              sortable
            />
          ))}
        </Container>
      </>
    );
  }

  return (
    <>
      {metricList && metricList.length !== 0 ? (
        metricList?.map((metric) => (
          <MetricListItem metric={metric} onDelete={onDelete} onEdit={onEdit} />
        ))
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
    </>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  textAndIcon: {
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
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
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}));
export default compose<any, OwnProps>(withTranslation('performanceTracking'))(
  MetricList,
);
