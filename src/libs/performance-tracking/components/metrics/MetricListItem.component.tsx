import React, { useState } from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ButtonBase, ListItem, Paper, Typography } from '@material-ui/core';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import EditIcon from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import { PerformanceTrackingMetric } from '#libs/performance-tracking/types';
import MetricProgressBar from './MetricProgressBar.component';
import GenericMuiDialog from '#components/genericDialog/GenericMuiDIalog';

const DragHandle = SortableHandle(() => <DragHandleIcon color="action" />);

const SortableItem = SortableElement((props: any) => (
  <div style={{ display: 'flex', opacity: '1', zIndex: 99999, width: '100%' }}>
    {props.children}
  </div>
));

type OwnProps = {
  metric: PerformanceTrackingMetric;
  onDelete: (metric: PerformanceTrackingMetric) => void;
  onEdit: (metric: PerformanceTrackingMetric) => void;
  sortable?: boolean;
};
type Props = OwnProps & WithTranslation;
export const MetricListItem = (props: Props) => {
  const { t, metric, onEdit, onDelete, sortable } = props;
  const [isOpenGenericMuiDialog, setIsOpenGenericMuiDialog] = useState(false);
  const classes = useStyles({ color: metric?.color });
  if (sortable) {
    return (
      <>
        <SortableItem index={metric?.index} key={metric?.index}>
          <Paper square className={classes.paperItem}>
            <ListItem
              divider
              className={classes.listitem}
              key={`${metric?.id}`}
            >
              <div className={classes.icon}>
                <DragHandle />
              </div>
              <div className={classes.listItemLeft}>
                <div className={classes.nameAndSlider}>
                  <Typography
                    className={classes.metricName}
                    variant="subtitle2"
                  >
                    {metric?.name}
                  </Typography>
                  <div className={classes.row}>
                    <div className={classes.metricProgressBar}>
                      <MetricProgressBar metric={metric} />
                    </div>
                    {metric?.machine_id ? (
                      <Typography className={classes.machineId}>
                        {metric?.machine_id}
                      </Typography>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className={classes.listItemRight}>
                {onEdit ? (
                  <ButtonBase
                    onClick={(event: React.MouseEvent) => {
                      event.stopPropagation();
                      onEdit(metric);
                    }}
                  >
                    <EditIcon color="primary" />
                  </ButtonBase>
                ) : null}
                {onDelete ? (
                  <ButtonBase
                    onClick={(event: React.MouseEvent) => {
                      event.stopPropagation();
                      setIsOpenGenericMuiDialog(true);
                    }}
                  >
                    <Delete className={classes.delete} />
                  </ButtonBase>
                ) : null}
              </div>
            </ListItem>
          </Paper>
        </SortableItem>
        <GenericMuiDialog
          open={isOpenGenericMuiDialog}
          title={t('metric.deleteHeader')}
          content={t('metric.deleteContent')}
          onCancel={() => setIsOpenGenericMuiDialog(false)}
          onConfirm={() => {
            onDelete(metric);
            setIsOpenGenericMuiDialog(false);
          }}
        />
      </>
    );
  }

  return (
    <>
      <Paper square className={classes.paperItem}>
        <ListItem divider className={classes.listitem} key={`${metric?.id}`}>
          <div className={classes.icon} />
          <div className={classes.listItemLeft}>
            <div className={classes.nameAndSlider}>
              <Typography className={classes.metricName}>
                {metric?.name}
              </Typography>
              <div className={classes.row}>
                <div className={classes.metricProgressBar}>
                  <MetricProgressBar metric={metric} />
                </div>
                {metric?.machine_id ? (
                  <Typography className={classes.machineId}>
                    {metric?.machine_id}
                  </Typography>
                ) : null}
              </div>
            </div>
          </div>
          <div className={classes.listItemRight}>
            {onEdit ? (
              <ButtonBase
                onClick={(event: React.MouseEvent) => {
                  event.stopPropagation();
                  onEdit(metric);
                }}
              >
                <EditIcon color="primary" />
              </ButtonBase>
            ) : null}
            {onDelete ? (
              <ButtonBase
                onClick={(event: React.MouseEvent) => {
                  event.stopPropagation();
                  setIsOpenGenericMuiDialog(true);
                }}
              >
                <Delete className={classes.delete} />
              </ButtonBase>
            ) : null}
          </div>
        </ListItem>
      </Paper>
      <GenericMuiDialog
        open={isOpenGenericMuiDialog}
        title={t('metric.deleteHeader')}
        content={t('metric.deleteContent')}
        confirmText={t('form.delete')}
        onCancel={() => setIsOpenGenericMuiDialog(false)}
        onConfirm={() => {
          onDelete(metric);
          setIsOpenGenericMuiDialog(false);
        }}
      />
    </>
  );
};
const useStyles = makeStyles<Theme, { color: string }>((theme) => ({
  delete: {
    color: '#868686',
  },
  machineId: {
    color: '#868686DE',
  },
  listitem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemLeft: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
  },
  listItemRight: {
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  icon: {
    width: theme.spacing(3),
    marginRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paperItem: (props) => ({
    width: '100%',
    borderLeft: `3px solid`,
    borderColor: props.color,
  }),
  nameAndSlider: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  metricProgressBar: {
    display: 'flex',
    alignItems: 'center',
  },
  metricName: {
    fontWeight: 500,
  },
}));
export default compose<any, OwnProps>(withTranslation('performanceTracking'))(
  MetricListItem,
);
