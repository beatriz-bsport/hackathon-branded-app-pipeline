// @flow
import React from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import Collapse from '@material-ui/core/Collapse';
import { compose, withProps, withState } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import moment from 'moment-timezone';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import Task from './Task.component';
import TaskFormDialog from './TaskFormDialog.component';

import type { OptionCallback } from '../../../state/types.ts';
import type { TaskData } from '../types';

type Props = {
  taskList: Array<Task>,
  updateTaskStatus: (id: number, status: number) => void,
  openTaskForm: () => void,
  openEditForm: (Task) => void,
  loading?: boolean,

  showPending: (boolean) => void,
  toogleShowPending: boolean,
  showPast: boolean,
  toogleShowPast: (boolean) => void,
  showFuture: boolean,
  toogleShowFuture: (boolean) => void,

  taskModalOpen: boolean,
  closeTaskForm: () => void,

  editTaskFormData: (?Task) => void,
  createOrUpdateTask: (data: TaskData, options: OptionCallback) => void,

  staffList: Array<User>,

  t: TFunction,
  classes: Object,
};

type PropsSubList = {
  taskList: Array<Task>,
  classes: Object,
  t: TFunction,
  openTaskForm: () => void,
  openEditForm: (Task) => void,
  updateStatus: (id: number, status: number) => void,
  toogleShow: (boolean) => void,
  show: boolean,
  title: string,
};

const TaskSubList = (props: PropsSubList) => {
  if (props.taskList.length === 0) {
    return null;
  }
  return (
    <div>
      <div className={props.classes.sectionTitle}>
        <Typography variant="h5">{`${props.title} (${props.taskList.length})`}</Typography>
        <div className={props.classes.rowRight}>
          {props.openTaskForm ? (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => props.openTaskForm()}
            >
              <AlarmAddIcon className={props.classes.leftIcon} />
              {props.t('task.actions.addTask')}
            </Button>
          ) : null}
          <IconButton onClick={() => props.toogleShow(!props.show)}>
            {props.show ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
      </div>
      <Divider className={props.classes.divider} />
      <Collapse in={props.show}>
        {props.taskList.map((t) => (
          <div key={t.id} className={props.classes.taskContainer}>
            <Task
              task={t}
              onEdit={() => props.openEditForm(t)}
              updateStatus={(status) => props.updateStatus(t.id, status)}
            />
          </div>
        ))}
      </Collapse>
    </div>
  );
};

export const TaskList = (props: Props) => {
  if (props.loading) return <CircularProgress />;
  const futureTaskList = props.taskList.filter((t) =>
    moment(t.date_due).isAfter(moment(), 'day'),
  );
  const pendingTaskList = props.taskList
    .filter((t) => moment(t.date_due).isSameOrBefore(moment(), 'day'))
    .filter((t) => t.status === 0);
  const archivedTaskList = props.taskList
    .filter((t) => moment(t.date_due).isSameOrBefore(moment(), 'day'))
    .filter((t) => t.status !== 0);
  return (
    <div>
      <TaskSubList
        taskList={pendingTaskList}
        updateStatus={props.updateTaskStatus}
        toogleShow={props.toogleShowPending}
        show={props.showPending}
        title={props.t('task.sectionTitle.pending')}
        openTaskForm={props.openTaskForm}
        openEditForm={props.openEditForm}
        t={props.t}
        classes={props.classes}
      />
      <TaskSubList
        taskList={futureTaskList}
        updateStatus={props.updateTaskStatus}
        toogleShow={props.toogleShowFuture}
        show={props.showFuture}
        title={props.t('task.sectionTitle.future')}
        openEditForm={props.openEditForm}
        classes={props.classes}
        t={props.t}
      />
      <TaskSubList
        taskList={archivedTaskList}
        updateStatus={props.updateTaskStatus}
        toogleShow={props.toogleShowPast}
        show={props.showPast}
        title={props.t('task.sectionTitle.past')}
        openEditForm={props.openEditForm}
        classes={props.classes}
        t={props.t}
      />
      <div className={props.classes.taskButtonContainer}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => props.openTaskForm()}
        >
          <AlarmAddIcon className={props.classes.leftIcon} />
          {props.t('task.actions.addTask')}
        </Button>
      </div>
      {props.taskModalOpen ? (
        <TaskFormDialog
          open={props.taskModalOpen}
          staffList={props.staffList}
          initial={props.editTaskFormData}
          onSubmit={(data, options) => props.createOrUpdateTask(data, options)}
          onClose={props.closeTaskForm}
        />
      ) : null}
    </div>
  );
};

const styles = (theme) => ({
  sectionTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  taskContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  rowRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  taskButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withState('taskModalOpen', 'setTaskModalOpen', false),
  withState('showPast', 'toogleShowPast', false),
  withState('showFuture', 'toogleShowFuture', false),
  withState('showPending', 'toogleShowPending', true),
  withState('editTaskFormData', 'setEditTaskFormData', null),
  withProps(({ setTaskModalOpen, setEditTaskFormData, fetchRoles }) => ({
    openTaskForm: () => {
      setTaskModalOpen(true);
      fetchRoles();
    },
    closeTaskForm: () => {
      setTaskModalOpen(false);
      setEditTaskFormData(null);
    },
  })),
  withProps(({ updateTaskStatus, toogleShowPast }) => ({
    updateTaskStatus: (id, status) => {
      updateTaskStatus(id, status, { onSuccess: () => toogleShowPast(true) });
    },
  })),
  withProps(
    ({
      createOrUpdateTask,
      closeTaskForm,
      openTaskForm,
      setEditTaskFormData,
    }) => ({
      openEditForm: (task) => {
        setEditTaskFormData(task);
        openTaskForm();
      },
      createOrUpdateTask: (data, options) => {
        createOrUpdateTask(data, {
          onSuccess: (...args) => {
            options.onSuccess(...args);
            closeTaskForm();
          },
          onError: options.onError,
        });
      },
    }),
  ),
  withTranslation(['reminder']),
)(TaskList);
