import {
  TASK_STATUS_UNSTARTED,
  TASK_STATUS_FINISHED,
  TASK_STATUS_CANCELLED,
} from '@bsport/common/lib/master-data/tasks';

export default {
  task: {
    sectionTitle: {
      pending: 'Pending tasks',
      future: 'Planned tasks',
      past: 'Archived tasks',
    },
    status: {
      [TASK_STATUS_UNSTARTED]: 'Pending',
      [TASK_STATUS_FINISHED]: 'Finished',
      [TASK_STATUS_CANCELLED]: 'Cancelled',
    },
    owners: 'Attributed to',
    author: 'Author',
    actions: {
      addTask: 'Plan a task',
      finish: 'Finish',
      restart: 'Start over',
      cancel: 'Archive',
    },
    form: {
      title: 'Task',
      close: 'Cancel',
      submit: 'Submit',
      description: {
        label: 'Message',
      },
      name: {
        label: 'Title',
      },

      date_due: {
        label: 'Reminder date',
      },
      task_owner: {
        helperText: 'Staff to notify',
      },
    },
  },
};
