import {
  EMAIL_RECIPIENT_DELIVERED,
  EMAIL_RECIPIENT_DEFERRED,
  EMAIL_RECIPIENT_DROPPED,
  EMAIL_RECIPIENT_PROCESSED,
  EMAIL_RECIPIENT_PENDING,
  EMAIL_RECIPIENT_BOUNCED,
} from '@bsport/common/lib/master-data/recipient-status';

export default {
  table: {
    columns: {
      member: 'Membre',
      title: 'Aperçu',
      date_created: 'Date',
      status: 'Status',
    },
  },
  mail: {
    title: 'Objet du mail',
    content: 'Contenu du mail',
    missing: 'Email absent',
    success: 'Mail Envoyé',
    error: 'Mail non envoyé',
    refreshText:
      "Veuillez recharger la page pour actualiser le changement d'email",
    noObject: "Pas d'objet",
  },
  recipients: 'Destinataires',
  common: {
    cancel: 'Annuler',
    submit: 'Envoyer',
    refresh: 'Actualiser',
  },
  dialogReceiverChoice: {
    reservation: 'Envoyer aux réservations',
    waitingList: "Envoyer à la liste d'attente",
    title: 'Sélection des destinataires',
  },
  campaign: {
    recipientCount: 'Destinataire: {{ total_recipients }}',
    sentAt: 'Envoyé le {{ date_created }}',
    readCount: 'Ouvertures',
    clickCount: 'Clics',
    showReport: 'Rapport',
    list: {
      showMore: 'Voir plus',
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
  },
  recipient: {
    readCount: 'Ouverture',
    clicksCount: 'Clic',
    showEmail: "Voir l'email",

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
