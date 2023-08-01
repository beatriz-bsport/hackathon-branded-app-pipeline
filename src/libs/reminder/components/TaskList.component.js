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
import { withTranslation, TFunction } from 'react-i18next';
import moment from 'moment-timezone';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import Task from './Task.component';
import TaskFormDialog from './TaskFormDialog.component';

import type { OptionCallback } from '../../../state/types';
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

  editTaskFormData: (task: ?Task) => void,
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
              color="primary"
              onClick={() => props.openTaskForm()}
              variant="outlined"
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
              onEdit={() => props.openEditForm(t)}
              task={t}
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
        classes={props.classes}
        openEditForm={props.openEditForm}
        openTaskForm={props.openTaskForm}
        show={props.showPending}
        t={props.t}
        taskList={pendingTaskList}
        title={props.t('task.sectionTitle.pending')}
        toogleShow={props.toogleShowPending}
        updateStatus={props.updateTaskStatus}
      />
      <TaskSubList
        classes={props.classes}
        openEditForm={props.openEditForm}
        show={props.showFuture}
        t={props.t}
        taskList={futureTaskList}
        title={props.t('task.sectionTitle.future')}
        toogleShow={props.toogleShowFuture}
        updateStatus={props.updateTaskStatus}
      />
      <TaskSubList
        classes={props.classes}
        openEditForm={props.openEditForm}
        show={props.showPast}
        t={props.t}
        taskList={archivedTaskList}
        title={props.t('task.sectionTitle.past')}
        toogleShow={props.toogleShowPast}
        updateStatus={props.updateTaskStatus}
      />
      <div className={props.classes.taskButtonContainer}>
        <Button
          color="primary"
          onClick={() => props.openTaskForm()}
          variant="outlined"
        >
          <AlarmAddIcon className={props.classes.leftIcon} />
          {props.t('task.actions.addTask')}
        </Button>
      </div>
      {props.taskModalOpen ? (
        <TaskFormDialog
          initial={props.editTaskFormData}
          onClose={props.closeTaskForm}
          onSubmit={(data, options) => props.createOrUpdateTask(data, options)}
          open={props.taskModalOpen}
          staffList={props.staffList}
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
  withProps(
    ({ setTaskModalOpen, setEditTaskFormData, fetchCompanyUserRoles }) => ({
      openTaskForm: () => {
        setTaskModalOpen(true);
        fetchCompanyUserRoles();
      },
      closeTaskForm: () => {
        setTaskModalOpen(false);
        setEditTaskFormData(null);
      },
    }),
  ),
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
