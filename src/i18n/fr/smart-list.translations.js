import {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER,
  DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER,
  SENIORITY_FILTER_IDENTIFIER,
  WENT_TO_ACTIVITY_FILTER_IDENTIFIER,
  HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
  LTE_COMPARATOR,
  BOOKING_ATTENDANCE_FILTER_IDENTIFIER,
  GTE_COMPARATOR,
  LT_COMPARATOR,
  GT_COMPARATOR,
  CREDIT_FILTER_IDENTIFIER,
  TAG_FILTER_IDENTIFIER,
  E_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';

const MEMBER_INFO = 1;
const PAYMENT_PACK = 2;
const BOOKING = 3;
const BUY = 4;

export default {
  selectToShowPreview: 'Sélectionnez un template',
  modal: {
    delete: {
      title: 'Suppression liste',
      content:
        'Êtes-vous sûr de vouloir supprimer cette liste ? Cette opération est définitive',
      cancel: 'Annuler',
      confirm: 'Supprimer',
    },
  },
  mail: {
    send: 'Envoyer',
    sendMailTitle: 'Envoyer un email',
    cancel: 'Annuler',
    sendMail: 'Envoyer un email',
    noMailAvailable: 'Pas de mail disponbile, pensez à en créer un',
    sendSuccess: "Mail en cours d'envoi",
    sendError: "Problème lors de l'envoi du mail",
  },
  detail: {
    tab: {
      member: 'Général',
      email: 'Emails',
    },
  },
  smart_list: {
    actions: {
      configure: 'Configurer',
    },
    card: {
      description: 'Description',
    },
    list: { title: 'Listes intelligentes', detailTitle: 'Détail de la liste' },
    name: 'Nom',
    description: 'Description',
    submit: 'Enregistrer',
    cancel: 'Annuler',
    add: 'Ajouter une liste',
    detail: 'Détail de la liste',
    createTitle: 'Liste intelligente',
  },
  filterCategory: {
    [MEMBER_INFO]: 'Informations membre',
    [PAYMENT_PACK]: 'Abonnements',
    [BOOKING]: 'Réservations',
    [BUY]: 'Achats',
  },
  filters: {
    active_filters: 'Filtre(s) actif(s) sur la liste',
    add_filter: 'Ajouter un filtre',
    add: 'Ajouter',
    before: 'avant',
    after: 'après',
    classic_comparators: {
      [GTE_COMPARATOR]: 'supérieur (⩾)',
      [LTE_COMPARATOR]: 'inférieur (⩽)',
      [E_COMPARATOR]: 'égal',
      [LT_COMPARATOR]: 'strictement inférieur',
      [GT_COMPARATOR]: 'strictement supérieur',
    },
    durations_comparators: {
      [LTE_COMPARATOR]: 'moins de (⩽)',
      [GTE_COMPARATOR]: 'plus de (⩾)',
      [E_COMPARATOR]: 'exactement',
    },
    [CREDIT_ACCOUNT_FILTER_IDENTIFIER]: {
      name: 'Credit',
      first: 'Le crédit est   ',
      second: ' à   ',
    },
    [LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER]: {
      name: 'Date dernière séance réservée',
      first: 'La dernière séance réservée a eu lieu il y a plus de',
      second: 'jours',
    },
    [DATE_JOINED_FILTER_IDENTIFIER]: {
      name: "Date d'inscription",
      first: 'A rejoint le club   ',
      second: ' le   ',
      before: 'avant',
      after: 'après',
    },
    [PAYMENT_PACK_FILTER_IDENTIFIER]: {
      name: 'Abonnement acheté',
      first: "Membres ayant déjà acheté l'abonnement ",
    },
    [GENDER_FILTER_IDENTIFIER]: {
      name: 'Sexe',
      first: 'Selectionner uniquement les',
      men: 'hommes',
      women: 'femmes',
    },
    [PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER]: {
      name: 'Crédits par abonnement',
      first: "Les crédits de l'abonnement",
      second: 'sont',
      third: 'à',
    },
    [HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER]: {
      name: "Validité de l'abonnement",
      first: 'Possède un abonnement',
      second: 'utilisable',
    },
    [WENT_TO_ACTIVITY_FILTER_IDENTIFIER]: {
      name: 'Par activité',
      first: 'A participé à une séance de',
      second: 'au cours des',
      third: 'derniers jours',
    },
    [BOOKING_ATTENDANCE_FILTER_IDENTIFIER]: {
      name: 'Nombre de cours suivis',
      first: 'A participé à ',
      second: 'cours',
      third: 'derniers jours',
    },
    [SENIORITY_FILTER_IDENTIFIER]: {
      name: 'Ancienneté',
      first: 'Membre depuis',
      second: 'jours',
    },
    [CREDIT_FILTER_IDENTIFIER]: {
      name: 'Maximum de crédits disponibles',
      first: 'Le nombre de crédits disponibles sur chacun des abonnements est',
      second: 'à',
    },
    [TAG_FILTER_IDENTIFIER]: {
      name: 'Tags',
      first: 'Filtrer sur les tags suivants',
    },
  },
};
