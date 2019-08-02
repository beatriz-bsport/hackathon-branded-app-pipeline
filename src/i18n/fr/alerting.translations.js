export default {
  list: {
    title: 'Notifications',
    emptyAlerting: 'Aucune nouvelle notification.',
  },
  alert_kind: {
    1: 'Facturation',
    2: 'Commande',
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
};
