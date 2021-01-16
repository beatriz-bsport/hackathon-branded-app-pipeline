const TASK = require('@bsport/common/lib/master-data/tasks');

const {
  TASK_STATUS_UNSTARTED,
  TASK_STATUS_FINISHED,
  TASK_STATUS_CANCELLED,
} = TASK;

exports.default = {
  task: {
    sectionTitle: {
      pending: 'Tâches en cours',
      future: 'Tâches planifiées',
      past: 'Tâches archivés',
    },
    status: {
      [TASK_STATUS_UNSTARTED]: 'En cours',
      [TASK_STATUS_FINISHED]: 'Terminé',
      [TASK_STATUS_CANCELLED]: 'Annulé',
    },
    owners: 'Attribué à ',
    author: 'Auteur',
    actions: {
      addTask: 'Planifier une tâche',
      finish: 'Terminer',
      restart: 'Recommencer',
      cancel: 'Archiver',
    },
    form: {
      title: 'Tâche',
      close: 'Annuler',
      submit: 'Valider',
      description: {
        label: 'Message',
      },
      name: {
        label: 'Titre',
      },

      date_due: {
        label: 'Date de rappel',
      },
      task_owner: {
        helperText: 'Staff à notifier',
      },
    },
  },
};
