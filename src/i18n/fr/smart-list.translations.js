import {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER,
  DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  PAYMENT_PACK_CREDIT_FILTER_IDENTIFIER,
  SENIORITY_FILTER_IDENTIFIER,
  HAS_BOOKED_META_ACTIVITY_FILTER_IDENTIFIER,
  HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER,
  LTE_COMPARATOR,
  BOOKING_ATTENDANCE_FILTER_IDENTIFIER,
  GTE_COMPARATOR,
  LT_COMPARATOR,
  GT_COMPARATOR,
  E_COMPARATOR,
} from '@bsport/common/lib/master-data/smart-list';

export default {
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
  filters: {
    active_filters: 'Filtre(s) actif(s) sur la liste',
    add: 'Ajouter un nouveau filtre',
    before: 'avant',
    after: 'après',
    classic_comparators: {
      [GTE_COMPARATOR]: 'supérieur',
      [LTE_COMPARATOR]: 'inférieur',
      [E_COMPARATOR]: 'égal',
      [LT_COMPARATOR]: 'strictement inférieur',
      [GT_COMPARATOR]: 'strictement supérieur',
    },
    durations_comparators_inverted: {
      [GTE_COMPARATOR]: 'moins de',
      [LTE_COMPARATOR]: 'plus de',
      [E_COMPARATOR]: 'excatement',
    },
    durations_comparators: {
      [LTE_COMPARATOR]: 'moins de',
      [GTE_COMPARATOR]: 'plus de',
      [E_COMPARATOR]: 'excatement',
    },
    [CREDIT_ACCOUNT_FILTER_IDENTIFIER]: {
      name: 'Credit',
      first: 'Membres dont le crédit est   ',
      second: ' à   ',
    },
    [LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER]: {
      name: 'Dernière réservation',
      first: 'La dernière réservation a eu lieu il y a plus de',
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
      name: 'Abonnement',
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
      first: "Membres dont les crédits de l'abonnement",
      second: 'sont',
      third: 'à',
    },
    [HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER]: {
      name: "Validité de l'abonnement",
      first: 'Membres possèdant un abonnement',
      second: 'utilisable',
    },
    [HAS_BOOKED_META_ACTIVITY_FILTER_IDENTIFIER]: {
      name: 'Activité réservée',
      first: 'Membres ayant réservé une séance de',
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
      first: 'Membres depuis',
      second: 'jours',
    },
  },
};
