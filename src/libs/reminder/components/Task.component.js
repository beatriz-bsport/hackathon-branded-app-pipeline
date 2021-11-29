// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import classnames from 'classnames';

import { withTranslation, TFunction } from 'react-i18next';
import moment from 'moment-timezone';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import RefreshIcon from '@material-ui/icons/Refresh';
import CancelIcon from '@material-ui/icons/Cancel';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';

import {
  TASK_STATUS_UNSTARTED,
  TASK_STATUS_FINISHED,
  TASK_STATUS_CANCELLED,
} from '@bsport/common/lib/master-data/tasks';

import TypographyMultiline from '../../../components/TypographyMultiline.component';
import RedButton from '../../../components/button/RedButton.component';

import type { Task as TaskType } from '../types';

type Props = {
  task: TaskType,
  t: TFunction,
  classes: Object,
  onEdit?: () => void,
  onDelete?: () => void,
  updateStatus: (status: number) => void,
};

const formatStaffUser = (user) =>
  `${user.first_name} ${user.last_name} (${user.email})`;

const TaskStatus = (props: {
  t: TFunction,
  classes: Object,
  status: number,
  date_due: string,
}) => {
  let color = 'default';
  if (props.status === TASK_STATUS_FINISHED) {
    color = 'primary';
  }
  if (props.status === TASK_STATUS_CANCELLED) {
    color = 'error';
  }
  const momentDue = moment(props.date_due);
  return (
    <div className={props.classes.statusContainer}>
      <div
        className={classnames(
          props.classes.statusBase,
          props.classes[`status_${props.status}`],
        )}
      >
        <Typography color={color} variant="subtitle2">
          {props.t(`task.status.${props.status}`)}
        </Typography>
      </div>
      <Typography
        className={props.classes.dateDue}
        color={momentDue.isBefore(moment(), 'day') ? 'error' : 'default'}
        variant="caption"
      >
        {momentDue.format('LL')}
      </Typography>
    </div>
  );
};

export const Task = (props: Props) => {
  const { task, t, classes } = props;
  return (
    <div>
      <Paper className={classes.container}>
        <div className={classes.header}>
          <div className={classes.rowLeft}>
            <Typography variant="h5">{task.name}</Typography>
            {props.onEdit ? (
              <IconButton onClick={props.onEdit}>
                <EditIcon />
              </IconButton>
            ) : null}
          </div>
          <TaskStatus
            t={props.t}
            classes={props.classes}
            status={task.status}
            date_due={task.date_due}
          />
        </div>
        <Typography variant="caption">
          {`${t('task.owners')}: ${task.task_owners
            .map((u) => formatStaffUser(u))
            .join(', ')}`}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {`${t('task.author')}: ${formatStaffUser(task.author)}`}
        </Typography>
        <TypographyMultiline>{task.description}</TypographyMultiline>
      </Paper>
      <div className={classes.footer}>
        <div className={classes.rowLeft}>
          {props.onDelete ? (
            <IconButton variant="outlined">
              <DeleteIcon />
            </IconButton>
          ) : (
            <div />
          )}
        </div>
        <div className={classes.rowRight}>
          {task.status !== TASK_STATUS_FINISHED &&
          task.status !== TASK_STATUS_CANCELLED ? (
            <RedButton
              variant="outlined"
              className={classes.statusButton}
              onClick={() => props.updateStatus(TASK_STATUS_CANCELLED)}
            >
              <CancelIcon className={classes.iconLeft} />
              {props.t('task.actions.cancel')}
            </RedButton>
          ) : null}
          {task.status !== TASK_STATUS_UNSTARTED ? (
            <Button
              variant="contained"
              className={classes.statusButton}
              onClick={() => props.updateStatus(TASK_STATUS_UNSTARTED)}
            >
              <RefreshIcon className={classes.iconLeft} />
              {props.t('task.actions.restart')}
            </Button>
          ) : null}
          {task.status !== TASK_STATUS_FINISHED &&
          task.status !== TASK_STATUS_CANCELLED ? (
            <Button
              color="primary"
              variant="contained"
              className={classes.statusButton}
              onClick={() => props.updateStatus(TASK_STATUS_FINISHED)}
            >
              <CheckIcon className={classes.iconLeft} />
              {props.t('task.actions.finish')}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const styles = (theme) => ({
  container: {
    padding: theme.spacing(1),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: theme.spacing(1),
  },
  rowLeft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rowRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  statusBase: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    border: '1px solid black',
    borderRadius: theme.spacing(1),
  },
  status_0: {
    border: '1px solid ',
  },
  status_10: {
    border: `1px solid ${theme.palette.primary.main}`,
  },
  status_20: {
    border: '1px solid red',
  },
  statusButton: {
    marginLeft: theme.spacing(1),
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  dateDue: {
    marginTop: theme.spacing(1),
  },
});

export default compose(withTranslation(['reminder']), withStyles(styles))(Task);
