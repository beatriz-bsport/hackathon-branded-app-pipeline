const {
  UNEVEN_INVOICE_ALERT,
  NEW_ORDER_ALERT,
  REMINDER_NOTE_ALERT_KIND,
  PRIVATE_BOOKING_INCOMPLETE_ALERT,
  COMPANY_ONBOARDING_ALERT,
} = require('@bsport/common/lib/master-data/alerting_kind');

exports.default = {
  list: {
    title: 'Notifications',
    emptyAlerting: 'Aucune nouvelle notification.',
  },
  alert_kind: {
    [UNEVEN_INVOICE_ALERT.alert_kind]: 'Facturation',
    [NEW_ORDER_ALERT.alert_kind]: 'Commande',
    [REMINDER_NOTE_ALERT_KIND.alert_kind]: 'Tâche',
    [PRIVATE_BOOKING_INCOMPLETE_ALERT.alert_kind]: 'RDV à compléter',
    [COMPANY_ONBOARDING_ALERT.alert_kind]: 'Informations légales',
  },
  showMore: 'Voir davantage',
  unevenInvoice: {
    title: 'Facture non-équilibrée',
    explainUneven: "La facture <1>n°{{uuid, uuid}}</1> n'est pas équilibrée.",
    priceDue: 'Somme dûe : {{ price_due }}.',
    pricePayed: 'Somme encaissée : {{ price_payed }}.',
  },
  newOrder: {
    title: 'Commande en attente',
    explain: 'Payé par <1>{{name}}</1> sur le magasin.',
    price: 'Montant: {{ price }}.',
  },
  privateBookingIncomplete: {
    explain: "Le RDV de <1>{{name}}</1> n'a pas de professeur désigné.",
    date: 'Date : {{ date_start }}',
    name: 'Membre : {{ user_name }}',
  },
  task: {
    name: '{{ name }}',
  },
  companyOnboarding: {
    verification: {
      title: 'Gestion de mon entreprise',
      content:
        "Plusieurs documents sont en attente, vous avez jusqu'au <1>{{ date }}</1> pour vérifier votre compte.",
      warning:
        "Les paiements en ligne risquent d'être <1>désactivés</1> passée cette date !",
    },
    payout: {
      title: 'Information bancaire manquantes',
      content:
        'Nous ne pouvons pas effectuer les versements sur votre compte bancaire car celui-ci est inexistant ou mal configuré.',
    },
    creation: {
      title: 'Paiement en ligne désactivés',
      content:
        'Pour pouvoir encaisser des paiements CB et SEPA, veuillez vérifier vos informations vos informations légales',
    },
  },
};
