const TASK = require('@bsport/common/lib/master-data/tasks');

const { TASK_STATUS_UNSTARTED, TASK_STATUS_FINISHED, TASK_STATUS_CANCELLED } =
  TASK;

exports.default = {
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
    owners: 'Assigned to ',
    author: 'Author',
    actions: {
      addTask: 'Add a task',
      finish: 'Finish',
      restart: 'Restart',
      cancel: 'Archive',
    },
    form: {
      title: 'Task',
      close: 'Cancel',
      submit: 'Confirm',
      description: { label: 'Message' },
      name: { label: 'Title' },
      date_due: { label: 'Reminder date' },
      task_owner: { helperText: "Staff that'll be notified" },
    },
  },
};
