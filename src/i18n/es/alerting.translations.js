export default {
  list: {
    title: 'Notificación',
    emptyAlerting: 'No hay nuevas notificaciones.',
  },
  alert_kind: {
    1: 'Facturación',
    2: 'Pedida',
  },
  showMore: 'Ver más',
  unevenInvoice: {
    title: 'Factura desequilibrada',
    explainUneven: "La factura <1>n°{{uuid, uuid}}</1> es desequilibrada.",
    priceDue: 'Importe adeudado : {{ price_due, price }}.',
    pricePayed: 'Importe pagado : {{price_payed, price}}.',
  },
  newOrder: {
    title: 'Nueva pedida',
    explain: 'Pagada por <1>{{name}}</1> en la tienda online.',
    price: 'Importe: {{ price, price }}.',
  },
};
