import {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
  LTE_COMPARATOR,
  PAYMENT_PACK_DATE_CREDIT_FILTER_IDENTIFIER,
  EXPENSES_FILTER_IDENTIFIER,
  MEMBER_DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  BASKET_ABANDONMENT_FILTER_IDENTIFIER,
  BOOKINGS_NUMBER_FILTER_IDENTIFIER,
  BOOKINGS_FILTER_IDENTIFIER,
  GTE_COMPARATOR,
  LT_COMPARATOR,
  FIRST_BOOKING_FILTER_IDENTIFIER,
  GT_COMPARATOR,
  TAG_FILTER_IDENTIFIER,
  E_COMPARATOR,
  BETWEEN_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';

const MEMBER_INFO = 1;
const PAYMENT_PACK = 2;
const BOOKING = 3;
const BUY = 4;

const DATE_AFTER = 0;
const DATE_BEFORE = 1;
const DATE_BETWEEN = 2;
const DATE_EXACT = 3;

const DURATION_AFTER = 4;
const DURATION_BEFORE = 5;
const DURATION_EXACT = 6;
const DURATION_BETWEEN = 7;
const DURATION_AFTER_PAST = 8;
const DURATION_BEFORE_PAST = 9;
const DURATION_EXACT_PAST = 10;
const DURATION_BETWEEN_PAST = 11;

export default {
  duplicate: 'Dupliquer',
  mails: 'Mails',
  name: 'Nom de la liste',
  description: 'Description',
  multiSelector: {
    selectAll: 'Tout sélectionner',
    selectNothing: 'Tout désélectionner',
    paymentPacks: {
      helperText: 'selectionner des cartes de cours',
      helperSelectedText: 'cartes de cours sélectionnées',
      textFieldPlaceholder: 'Rechercher une carte de cours',
      helperAllSelectedText: 'toutes les cartes de cours',
      warning: 'Sélectionnez au moins une carte de cours',
    },

    metaActivities: {
      helperText: 'selectionner des activités',
      helperSelectedText: 'activités sélectionnées',
      textFieldPlaceholder: 'Rechercher une activité',
      helperAllSelectedText: 'toutes les activités',
      warning: 'Sélectionnez au moins une activité',
    },
    establishments: {
      helperText: 'selectionner des établissements',
      helperSelectedText: 'établissements sélectionnées',
      textFieldPlaceholder: 'Rechercher un établissement',
      helperAllSelectedText: 'tous les établissements',
      warning: 'Sélectionnez au moins un établissement',
    },
    coaches: {
      helperText: 'selectionner des professeurs',
      helperSelectedText: 'professeurs sélectionnées',
      textFieldPlaceholder: 'Rechercher un professeur',
      helperAllSelectedText: 'tous les professeurs',
      warning: 'Sélectionnez au moins un professeur',
    },
  },
  selectToShowPreview: 'Sélectionnez un template',
  exportList: 'Exporter la smartlist',
  membersInList: 'Membres dans la smartlist:',
  modal: {
    delete: {
      title: 'Suppression smartlist',
      content:
        'Êtes-vous sûr de vouloir supprimer cette smartlist ? Cette opération est définitive',
      cancel: 'Annuler',
      confirm: 'Supprimer',
    },
  },
  graphs: {
    bookings: 'Réservations',
    expensesSegments: {
      title: { first: 'Dépenses entre le', second: 'et le' },
      label: {
        0: 'Aucune dépense',
        1: 'Premier quartile',
        2: 'Moyenne',
        3: 'Dernier quartile',
      },
    },
    bookingsSegments: {
      title: 'Dernière réservation',
      label: {
        0: 'Dernier mois',
        1: 'Entre 1 et 12 mois',
        2: "Plus d'un an",
      },
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
    statTitle: 'Statistiques',
  },
  smart_list: {
    actions: {
      configure: 'Configurer',
    },
    card: {
      description: 'Description',
    },
    list: {
      title: 'Smartlists',
      detailTitle: 'Détail de la smartlist',
    },
    name: 'Nom',
    description: 'Description',
    submit: 'Enregistrer',
    cancel: 'Annuler',
    add: 'Ajouter une smartlist',
    detail: 'Détail de la smartlist',
    createTitle: 'Smartlist',
  },
  filterCategory: {
    [MEMBER_INFO]: 'Informations membre',
    [PAYMENT_PACK]: 'Cartes de cours',
    [BOOKING]: 'Réservations',
    [BUY]: 'Achats',
  },
  filters: {
    calendarPicker: {
      text: {
        [DATE_BEFORE]: { first: 'le ou avant le' },
        [DATE_AFTER]: { first: 'le ou après le' },
        [DATE_EXACT]: { first: 'le' },
        [DATE_BETWEEN]: { first: 'entre le', second: 'et le' },
        [DURATION_BEFORE_PAST]: {
          first: 'il y a plus de',
          second: 'jours',
        },
        [DURATION_AFTER_PAST]: {
          first: 'il y a moins de',
          second: 'jours',
        },
        [DURATION_EXACT_PAST]: { first: 'il y a ', second: 'jours' },
        [DURATION_EXACT]: { first: 'dans ', second: 'jours' },
        [DURATION_AFTER]: { first: 'dans plus de', second: 'jours' },
        [DURATION_BEFORE]: { first: 'dans moins de', second: 'jours' },

        [DURATION_BETWEEN_PAST]: {
          first: 'il y a plus de',
          second: 'jours et moins de',
          third: 'jours',
        },
        [DURATION_BETWEEN]: {
          first: 'dans plus de',
          second: 'jours et moins de',
          third: 'jours',
        },
      },
      select: {
        [DATE_BEFORE]: 'Le ou avant le',
        [DATE_AFTER]: 'Le ou après le',
        [DATE_EXACT]: 'Le',
        [DATE_BETWEEN]: 'Entre deux dates',
      },
      selectduration: {
        selector: {
          [DURATION_BEFORE_PAST]: 'Il y a plus de X jours',
          [DURATION_AFTER_PAST]: 'Il y a moins de X jours',
          [DURATION_EXACT_PAST]: 'Il y a X jours',
          [DURATION_BEFORE]: 'Dans moins de X jours',
          [DURATION_AFTER]: 'Dans plus de X jours',
          [DURATION_EXACT]: 'Dans X jours',
          [DURATION_BETWEEN]: 'Dans plus de X jours et moins de Y jours',
          [DURATION_BETWEEN_PAST]: 'Il y a plus de X jours et moins de Y jours',
        },
        [DURATION_BEFORE_PAST]: { first: 'Il y a plus de', second: 'jours' },
        [DURATION_AFTER_PAST]: {
          first: 'Il y a moins de',
          second: 'jours',
        },
        [DURATION_EXACT_PAST]: { first: 'Il y a ', second: 'jours' },
        [DURATION_BEFORE]: {
          first: 'Dans moins de',
          second: 'jours',
        },
        [DURATION_AFTER]: {
          first: 'Dans plus de',
          second: 'jours',
        },
        [DURATION_EXACT]: { first: 'Dans', second: 'jours' },
        [DURATION_BETWEEN]: {
          first: 'Dans plus de',
          second: 'jours',
          third: 'jours et moins de',
        },
        [DURATION_BETWEEN_PAST]: {
          first: 'Il y a plus de',
          second: 'jours',
          third: 'jours et moins de',
        },
      },
      duration: 'jours',
      durationTitle: 'Durée',
      dateTitle: 'Date',
    },
    booking_status: {
      canceled: 'annulé',
      booked: 'réservé',
    },
    all: 'Tous',
    active_filters: 'Filtres actifs sur la smartlist',
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
      [BETWEEN_COMPARATOR]: 'entre deux',
    },
    [CREDIT_ACCOUNT_FILTER_IDENTIFIER]: {
      name: 'Accompte',
      first: "L'accompte du client est",
      second: ' à   ',
      third: 'euros',
      explanation: 'A X euros sur son compte',
    },
    [LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER]: {
      name: 'Date dernière séance réservée',
      first: 'La dernière séance réservée a eu lieu il y a plus de',
      second: 'jours',
      explanation: 'A réservé sa dernière séance il y a...',
    },
    [MEMBER_DATE_JOINED_FILTER_IDENTIFIER]: {
      name: "Date d'inscription",
      first: 'A rejoint le club   ',
      explanation: 'A rejoint le club le...',
    },
    [GENDER_FILTER_IDENTIFIER]: {
      name: 'Sexe',
      first: 'Selectionner uniquement les',
      men: 'hommes',
      explanation: 'Est une femme/un homme',
      women: 'femmes',
    },
    [FIRST_BOOKING_FILTER_IDENTIFIER]: {
      name: 'Première réservation',
      explanation: 'A réservé sa première séance le...',
    },
    [PAYMENT_PACK_DATE_CREDIT_FILTER_IDENTIFIER]: {
      name: "Date d'achat et crédits par carte de cours",
      infoIcon:
        'Les cartes de cours illimités ne sont pas filtrées sur le crédit',
      first: 'A acheté la carte de cours',
      second: 'entre le',
      third: 'et le',
      fourth: 'et possède',
      fifth: 'crédits dessus',
    },
    [BASKET_ABANDONMENT_FILTER_IDENTIFIER]: {
      name: 'Paniers abandonnés',
      explanation: "A abandonné un panier d'un montant de...",
      first: "A abandonné un panier d'un montant",
      second: 'à',
      third: 'euros',
      date: { first: 'Panier abandonné', second: 'jours' },
    },
    [BOOKINGS_NUMBER_FILTER_IDENTIFIER]: {
      name: 'Numéro de réservation',
      explanation:
        "A réservé sa X ème séance de l'activité A, dans l'établissement B...",
      first: 'A réservé sa ',
      second_singular: 'ère séance',
      second_plural: 'ème séance',
      activity: {
        first: 'de',
      },
      establishment: {
        first: 'dans',
      },
      date: { first: 'la date de la séance est' },
    },
    [BOOKINGS_FILTER_IDENTIFIER]: {
      name: 'Nombre de réservations',
      explanation:
        "A réservé X séances de l'activité A, dans le lieu B, avec la carte de cours C...",
      first: 'A réservé',
      second: 'séances',
      activity: {
        first: 'des activités',
      },
      establishment: {
        first: 'dans les établissements',
      },
      payment_pack: {
        first: 'avec les cartes',
      },
      coach: {
        first: 'avec les professeurs',
      },
      date: { first: 'ayant lieu' },
    },
    [PAYMENT_PACK_FILTER_IDENTIFIER]: {
      explanation: 'A acheté la carte de cours A à Y date, avec X credits',
      name: 'Général',
      first: 'une des cartes de cours',
      has: 'Possède',
      has_not: 'Ne possède pas',
      second: 'et',
      third: 'à',
      credits: { first: 'Crédits:' },
      date_bought: { first: "Date d'achat" },
      expiration: { first_will_expire: 'Expire', first_has_expire: 'A expiré' },
      infoIcon: 'Les cartes de cours illimitées seront toujours incluses',
    },
    [HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER]: {
      name: 'Validité de la carte de cours',
      first: 'Possède une carte de cours',
      second: 'utilisable (avec des crédits ou illimité et non expiré)',
      explanation: 'Possède la carte de cours X utilisable',
    },
    [TAG_FILTER_IDENTIFIER]: {
      explanation: 'Possède les tags A et B',
      name: 'Tags',
      first: 'Filtrer sur les tags suivants',
    },
    [EXPENSES_FILTER_IDENTIFIER]: {
      explanation: 'A acheté les produits A et B',
      shop: 'Magasin',
      pack: 'Carte de cours',
      combo: 'Pack',
      private_pass: 'Cours particulier',
      workshop: 'Carte de cours spécial atelier',
      name: 'Dépenses',
      first: 'A dépensé',
      second: '€ entre le',
      third: 'et le',
      fourth: 'pour les produits',
      selector: 'Choisir les produits',
    },
  },
};
