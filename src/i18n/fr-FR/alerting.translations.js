const {
  UNEVEN_INVOICE_ALERT,
  NEW_ORDER_ALERT,
  REMINDER_NOTE_ALERT_KIND,
  PRIVATE_BOOKING_INCOMPLETE_ALERT,
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
  },
  showMore: 'Voir davantage',
  unevenInvoice: {
    title: 'Facture non-équilibrée',
    explainUneven: "La facture <1>n°{{uuid, uuid}}</1> n'est pas équilibrée.",
    priceDue: 'Somme dûe : {{ price_due, price }}.',
    pricePayed: 'Somme encaissée : {{price_payed, price}}.',
  },
  newOrder: {
    title: 'Commande en attente',
    explain: 'Payé par <1>{{name}}</1> sur le magasin.',
    price: 'Montant: {{ price, price }}.',
  },
  privateBookingIncomplete: {
    explain: "Le RDV de <1>{{name}}</1> n'a pas de professeur désigné.",
    date: 'Date : {{ date_start }}',
    name: 'Membre : {{ user_name }}',
  },
  task: {
    name: '{{ name }}',
  },
};
