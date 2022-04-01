const {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
} = require('@bsport/common/lib/master-data/communication-kind');

const RECIPIENT_STATUS = require('@bsport/common/lib/master-data/recipient-status');

const {
  EMAIL_RECIPIENT_DELIVERED,
  EMAIL_RECIPIENT_DEFERRED,
  EMAIL_RECIPIENT_DROPPED,
  EMAIL_RECIPIENT_PROCESSED,
  EMAIL_RECIPIENT_PENDING,
  EMAIL_RECIPIENT_BOUNCED,
} = RECIPIENT_STATUS;

exports.default = {
  table: {
    columns: {
      member: 'Membre',
      title: 'Aperçu',
      date_created: 'Date',
      status: 'Status',
    },
  },
  mail: {
    dialogTitle: 'Communication',
    title: 'Objet du mail',
    writeMail: 'Ecrire un mail',
    selectTemplate: 'Sélectionner un template',
    content: 'Contenu du mail',
    contentSms: 'Contenu du sms',
    numberSms: 'sms',
    mailMissing: 'Email absent',
    phoneMissing: 'Téléphone absent',

    success: 'Communication envoyée',
    error: 'Communication non envoyé, veuillez réessayer un peu plus tard',
    noMailAvailable: 'Aucun mail disponible, pensez à en créer un',
    selectToShowPreview: 'Sélectionnez un mail pour avoir son apperçu',
    mailSelection: 'Choisir un mail',

    showMail: 'Voir le mail',
    count: 'caractères',
    hideMail: 'Cacher le mail',
    sendSms: 'Envoyer un sms',
    refreshText:
      "Veuillez recharger la page pour actualiser le changement d'email",
    refreshTextPhone:
      'Veuillez recharger la page pour actualiser le changement de téléphone',
    noObject: "Pas d'objet",

    sendNotification: 'Notification push',
    titleNotification: 'Titre',
    contentNotification: 'Contenu',
  },
  recipients: 'Destinataires',
  common: {
    cancel: 'Annuler',
    submit: 'Envoyer',
    refresh: 'Actualiser',
  },
  send: {
    success: "Email en cours d'envoi...",
    error: "Erreur lors de l'envoi",
  },
  dialogReceiverChoice: {
    reservation: 'Envoyer aux réservations',
    canceledReservation: 'Envoyer aux réservations annulées',
    waitingList: "Envoyer à la liste d'attente",
    title: 'Sélection des destinataires',
  },
  campaign: {
    recipientCount: 'Destinataire: {{ total_recipients }}',
    showMail: "Voir l'email",
    unavailableMail: 'Preview non disponible',
    sentAt: 'Envoyé le {{ date_created }}',
    readCount: 'Ouvertures',
    clickCount: 'Clics',
    showReport: 'Rapport',
    list: {
      showMore: 'Voir plus',
      isEmpty: 'Aucun email envoyé pour le moment',
    },
    report: {
      totalRead: 'Ouvertures',
      totalClick: 'Clics',
      deliveryRate: 'Envois réussis',
      lastOpen: 'Dernière ouverture',
      dateCreated: "Date d'envoi",
      topLinks: 'Liens les plus cliqués',
      recipientList: 'Détail par destinataire',
      noTopLink: 'Aucun clic',
    },
    kind: {
      [COMMUNICATION_KIND_EMAIL]: 'Email',
      [COMMUNICATION_KIND_SMS]: 'SMS',
    },
  },
  recipient: {
    readCount: 'Ouverture',
    clicksCount: 'Clic',
    showEmail: "Voir l'email",
    showSms: 'Voir le SMS',

    status: {
      [EMAIL_RECIPIENT_DELIVERED]: 'Reçu',
      [EMAIL_RECIPIENT_DEFERRED]: 'Attente',
      [EMAIL_RECIPIENT_DROPPED]: 'Refusé',
      [EMAIL_RECIPIENT_PROCESSED]: 'En cours',
      [EMAIL_RECIPIENT_PENDING]: 'En cours',
      [EMAIL_RECIPIENT_BOUNCED]: 'Erreur',
    },
    table: {
      columns: {
        email: 'Email',
        readCount: 'Ouvertures',
        lastRead: 'Dernière ouverture',
        clicked: 'Clics',
        status: 'Status',
      },
    },
  },
};
