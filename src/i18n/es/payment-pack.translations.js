export default {
  details: {
    pleaseSelectAPack: 'Selectionar un abono para ver los detalles',
    invoiceTitle: 'Facturas',
    bookingsTitle: 'Reservas',
  },
  newMemberOnly: 'Disponible solo para los nuevos clientes',
  publicPacksTitle: 'Abonos disponible a la venta online',
  privatePacksTitle: 'Abonos no disponibles a la venta online',
  subscribeToOffer: 'Registrar',
  createOrUpdate: {
    success: 'Abonos registrados',
    fail: "Error cuando ha intendado grabarlo",
  },
  disabled: 'Desactivado',
  disableConsumer: 'Bloquear',
  enableConsumer: 'Desbloquear',
  maxNBookingsByWeek1: 'Max ',
  maxNBookingsByWeek2: 'reservas a la semana',
  validity: 'Valido :',
  consumer: {
    expiresOn: 'Caduca el ',
    bookingsThisWeek: 'reservas a la semana',
  },
  validForDuration: (days, months, years) =>
    `Valido : ${days ? `${days} dias ` : ''}${
      months ? `${months} mes ` : ''
    }${years ? `${years} años` : ''}`,
  validForNdays1: 'Valido ',
  validForNdays2: ' dias despues de la compra',
  validFrom: 'Valido desde ',
  validTo: ' hasta',
  bookingsLeftThisWeek: 'Reservas maximales a la semana',
  // eslint-disable-next-line
  addButton: "Crear un abono",
  noPaymentPackSubscribed: 'No abono',
  // eslint-disable-next-line
  validUntil: "Valido hasta",
  expirationDate: 'Expiro el',
  never: 'Nunco',
  unlimitedCredits: 'Ilimitado',
  credits: 'Creditos',
  specifications: {
    nbCredits: '{{credits}} creditos',
    unlimitedCredits: 'Ilimitado',
    price: '{{price, price}}',
  },
  availableOnFollowingSports: 'Deportes compatibles : ',
  availableOnFollowingEstablishments: 'Locales compatibles : ',
  anySport: 'Todos los deportes',
  availableOnFollowingActivities: 'Actividades compatibles : ',
  anyActivity: 'Todas las actividades',
  boughtConsumerPaymentPacks: 'Registrados',
  noRestrictionOnActivityType:
    'Todas las actividades',
  credit: {
    updated: 'Creditos actualizados',
  },
  noConsumerPack: 'No compras regristradas',
  reverted: 'Factura cancelada',
};
