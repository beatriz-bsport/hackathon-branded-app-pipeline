const SMARTLIST = require('@bsport/common/lib/master-data/smart-list');

const {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  FILTER_BOOKING_LAST,
  GENDER_FILTER_IDENTIFIER,
  HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
  USER_HAS_PASSWORD_FILTER,
  LTE_COMPARATOR,
  EXPENSES_FILTER_IDENTIFIER,
  MEMBER_DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  BASKET_ABANDONMENT_FILTER_IDENTIFIER,
  BOOKINGS_NUMBER_FILTER_IDENTIFIER,
  BOOKINGS_FILTER_IDENTIFIER,
  EXPENSES_COMPLETE_FILTER_IDENTIFIER,
  GTE_COMPARATOR,
  FIRST_BOOKING_FILTER_IDENTIFIER,
  TAG_FILTER_IDENTIFIER,
  E_COMPARATOR,
  BETWEEN_COMPARATOR,
  PRIVATE_PASS_FILTER_IDENTIFIER,
  PRIVATE_BOOKINGS_FILTER_IDENTIFIER,
} = SMARTLIST;

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

exports.default = {
  duplicate: 'Dupliquer',
  edit: 'Configurer',
  delete: 'Supprimer',
  mails: 'Mails',
  name: 'Nom de la liste',
  search: 'Chercher une smartlist',
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
    privatePass: {
      helperText: 'selectionner des cartes RDV',
      helperSelectedText: 'cartes de RDV sélectionnées',
      textFieldPlaceholder: 'Rechercher une carte RDV',
      helperAllSelectedText: 'toutes les cartes RDV',
      warning: 'Sélectionnez au moins une carte RDV',
    },
    buyables: {
      helperText: 'selectionner des catégories',
      helperSelectedText: 'catégories sélectionnées',
      textFieldPlaceholder: 'Rechercher une catégorie de produit',
      helperAllSelectedText: 'tous les produits',
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
  noSmartLists:
    'Utilisez les smartlists afin de filtrer, analyser, et mieux connaitre vos membres.',
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
    sendMailTitle: 'Envoyer une communication',
    cancel: 'Annuler',
    sendMail: 'Envoyer une communication',
    noMailAvailable: 'Pas de mail disponbile, pensez à en créer un',
    sendSuccess: "Mail en cours d'envoi",
    sendError: "Problème lors de l'envoi du mail",
  },
  detail: {
    tab: {
      member: 'Général',
      campaign: 'Campagnes',
      statistic: 'Statistique',
    },
    statTitle: 'Statistiques',
  },
  smart_list: {
    actions: {
      configure: 'Configurer',
      campaign: 'Campagnes',
    },
    list: {
      title: 'Smartlists',
      detailTitle: 'Détail de la smartlist',
    },
    name: 'Nom',
    description: {
      label: 'Description',
      isEmpty: 'Aucune description',
    },
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
    isEmpty:
      "Aucun filtre n'est configuré, cette smartliste représente donc l'ensemble de la base membre",
    attendanceTrue: 'présent',
    attendanceFalse: 'absent',
    attendanceWarning: 'Sélectionnez un statut',
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
          [DURATION_EXACT_PAST]: 'Il y a X jours',
          [DURATION_AFTER]: 'Dans plus de X jours',
          [DURATION_EXACT]: 'Dans X jours',
          [DURATION_BETWEEN]: 'Dans plus de X jours et moins de Y jours',
          [DURATION_BETWEEN_PAST]: 'Il y a plus de X jours et moins de Y jours',
        },
        [DURATION_BEFORE_PAST]: { first: 'Il y a plus de', second: 'jours' },
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
    comparators: {
      [GTE_COMPARATOR]: 'supérieur (⩾)',
      [LTE_COMPARATOR]: 'inférieur (⩽)',
      [E_COMPARATOR]: 'égal',
      [BETWEEN_COMPARATOR]: 'entre deux',
    },
    durations_comparators: {
      [LTE_COMPARATOR]: 'moins de (⩽)',
      [GTE_COMPARATOR]: 'plus de (⩾)',
      [E_COMPARATOR]: 'exactement',
      [BETWEEN_COMPARATOR]: 'entre deux',
    },
    [CREDIT_ACCOUNT_FILTER_IDENTIFIER]: {
      name: 'Dette',
      first: 'Le solde du client, soustrait des factures impayées, est',
      second: ' à   ',
      third: 'euros',
      explanation: 'A X euros sur son compte',
      between: 'et',
    },
    [FILTER_BOOKING_LAST]: {
      name: 'Date dernière séance réservée',
      first: 'La dernière séance réservée a eu lieu il y a plus de',
      second: "jours, et n'a aucun réservation prévue dans le futur.",
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
    [EXPENSES_COMPLETE_FILTER_IDENTIFIER]: {
      explanation: 'A acheté les produits A et B',
      shop: 'Magasin',
      pack: 'Carte de cours',
      combo: 'Pack',
      between: 'et',

      private_pass: 'Cours particulier',
      workshop: 'Carte de cours spécial atelier',
      name: 'Dépenses',
      first: 'A dépensé',
      second: '€ pour les produits',
      date: { first: 'achats effectués' },
    },
    [BASKET_ABANDONMENT_FILTER_IDENTIFIER]: {
      name: 'Paniers abandonnés',
      explanation: "A abandonné un panier d'un montant de...",
      first: "A abandonné un panier d'un montant",
      second: 'à',
      third: 'euros',
      between: 'et',
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
      payment_pack: {
        first: 'avec les cartes',
      },
      coach: {
        first: 'avec les professeurs',
      },
      date: { first: 'la date de la séance est' },
      hour: {
        first: "l'heure de début la séance est comprise entre",
        second: 'heures et',
        third: 'heures',
      },
      attendance: 'avec le statut',
    },
    [BOOKINGS_FILTER_IDENTIFIER]: {
      name: 'Nombre de réservations',
      explanation:
        "A réservé X séances de l'activité A, dans le lieu B, avec la carte de cours C...",
      first: 'A réservé',
      second: 'séances',
      between: 'et',

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
      hour: {
        first: 'débutant entre',
        second: 'heures et',
        third: 'heures',
      },
      attendance: 'avec le statut',
    },
    [PRIVATE_BOOKINGS_FILTER_IDENTIFIER]: {
      name: 'Nombre de rendez-vous',
      explanation:
        'A réservé X rendez-vous avec le professeur A, dans le lieu B, avec la carte RDV C...',
      first: 'A réservé',
      second: 'rendez-vous',
      between: 'et',
      establishment: {
        first: 'dans les établissements',
        second: 'ou',
        third: 'à domicile',
      },
      private_pass: {
        first: 'avec les cartes RDV',
      },
      coach: {
        first: 'avec les professeurs',
      },
      date: { first: 'ayant lieu' },
      hour: {
        first: 'débutant entre',
        second: 'heures et',
        third: 'heures',
      },
    },
    [PAYMENT_PACK_FILTER_IDENTIFIER]: {
      explanation: 'A acheté la carte de cours A à Y date, avec X credits',
      name: 'Général',
      first: 'une des cartes de cours',
      has: 'Possède',
      has_not: 'Ne possède pas',
      second: 'et',
      third: 'à',
      credits: { first: 'crédits:', second: 'et' },
      date_bought: { first: "date d'achat" },
      expiration: { first_will_expire: 'expire', first_has_expire: 'a expiré' },
      infoIcon: 'Les cartes de cours illimitées seront toujours incluses',
    },
    [PRIVATE_PASS_FILTER_IDENTIFIER]: {
      explanation: 'A acheté la carte RDV A à Y date, avec X credits',
      name: 'Cartes RDV',
      first: 'une des cartes de RDV',
      has: 'Possède',
      has_not: 'Ne possède pas',
      second: 'et',
      third: 'à',
      credits: { first: 'crédits:', second: 'et' },
      date_bought: { first: "date d'achat" },
      expiration: { first_will_expire: 'expire', first_has_expire: 'a expiré' },
    },
    [USER_HAS_PASSWORD_FILTER]: {
      explain: 'possède un mot de passe sur bsport',
      name: 'Mot de passe',
      explanation: 'Possède un mot de passe sur bsport',
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
