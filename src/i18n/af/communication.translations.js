const {
  COMMUNICATION_KIND_EMAIL,
  COMMUNICATION_KIND_SMS,
  COMMUNICATION_KIND_PUSH_NOTIFICATION,
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

const COMMUNICATION_FILTERS = require('@bsport/common/lib/master-data/communication-filters');

const {
  COMMUNICATION_CHANNEL_MESSAGE_DIRECT,
  COMMUNICATION_CHANNEL_NOTIFICATION,
  COMMUNICATION_CHANNEL_SESSION,
  COMMUNICATION_CHANNEL_SMARTLIST,
  COMMUNICATION_RECIPIENT_BOOKINGS,
  COMMUNICATION_RECIPIENT_BOOKINGS_CANCELLED,
  COMMUNICATION_RECIPIENT_WAITING_LIST,
  COMMUNICATION_SEND_PARAMETER_AUTO,
  COMMUNICATION_SEND_PARAMETER_MANUAL,
} = COMMUNICATION_FILTERS;

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
    titleInterpolated:
      "Les variables contenues dans l'objet du mail et le corp du mail sont mises à jour en fonction du destinataire",
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
    selectToShowPreview: 'Sélectionnez un mail pour avoir son aperçu',
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
    warningConsent1:
      'Attention ! Ce membre a désactivé la possibilité de lui envoyer des emails promotionnels. Les emails directs permettent de discuter avec vos membres de manière simple et rapide. Ils ne doivent pas servir à des fins publicitaires ou promotionnelles.',
    warningConsent2:
      "Ne pas respecter cette décision de votre membre serait illégal. Bsport se détache de toutes responsabilités en cas d'utilisation abusive des emails directs.",
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
      [COMMUNICATION_KIND_PUSH_NOTIFICATION]: 'Notification push',
    },
  },
  recipient: {
    readCount: 'Ouverture',
    clicksCount: 'Clic',
    showEmail: "Voir l'email",
    showSms: 'Voir le SMS',
    showNotification: 'Voir la notification',

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
  sms: {
    warningConsent1:
      'Attention ! Ce membre a désactivé la possibilité de lui envoyer des sms promotionnels. Les sms directs permettent de discuter avec vos membres de manière simple et rapide. Ils ne doivent pas servir à des fins publicitaires ou promotionnelles.',
    warningConsent2:
      "Ne pas respecter cette décision de votre membre serait illégal. Bsport se détache de toutes responsabilités en cas d'utilisation abusive des sms directs.",
  },
  filter: {
    applyFilter: 'Appliquer',
    filterAction: 'Filtrer',
    dateFilter: {
      title: "Date d'envoi",
      period: 'Période',
      dateStart: 'Date de début',
      dateEnd: 'Date de fin',
    },
    numberFilter: {
      severalFilters: 'filtres appliqués',
      oneFilter: '1 filtre appliqué',
    },
    kind: {
      title: "Type d'envoi",
      placeholder: "Sélectionnez un type d'envoi",
    },
    channel: {
      title: 'Channels',
      placeholder: 'Sélectionnez un type de channel',
    },
    recipient: {
      title: 'Destinataires',
      placeholder: 'Sélectionnez un type de destinataire',
    },
    sendParameter: {
      title: "Paramètre d'envoi",
      placeholder: "Sélectionnez un paramètre d'envoi",
    },
    choicesLabels: {
      [COMMUNICATION_KIND_EMAIL]: 'Email',
      [COMMUNICATION_KIND_SMS]: 'SMS',
      [COMMUNICATION_KIND_PUSH_NOTIFICATION]: 'Notification push',
      [COMMUNICATION_RECIPIENT_BOOKINGS]: 'Réservations',
      [COMMUNICATION_RECIPIENT_BOOKINGS_CANCELLED]: 'Réservations annulées',
      [COMMUNICATION_RECIPIENT_WAITING_LIST]: "Liste d'attente",
      [COMMUNICATION_CHANNEL_SESSION]: 'Session',
      [COMMUNICATION_CHANNEL_NOTIFICATION]: 'Notification',
      [COMMUNICATION_CHANNEL_SMARTLIST]: 'Smartlist',
      [COMMUNICATION_CHANNEL_MESSAGE_DIRECT]: 'Message direct',
      [COMMUNICATION_SEND_PARAMETER_AUTO]: 'Automatique',
      [COMMUNICATION_SEND_PARAMETER_MANUAL]: 'Manuel',
    },
  },
};
