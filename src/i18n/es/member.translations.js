exports.default = {
  // eslint-disable-next-line
  date_joined: 'Fecha de registro',
  invoiceTitle: 'Facturas',
  subscriptionTitle: 'Suscripción',
  offers_joined: 'Numeros de reservas',
  pass_owner: 'Abonnement valide', // no_translate
  bornIn: 'Nacido en ',
  memberSince: 'Registrado desde ',
  showNextBooking: 'Ver las reservas futuras',
  nextBooking: 'próxima : ',
  showPreviousBooking: 'Ver las reservas pasadas',
  pastBooking: 'última : ',
  engagement: 'Engagement', // no_translate
  addMember: 'Añadir un nuevo cliente',
  note: {
    noNoteSaved: 'No hay notas registradas',
    addNote: 'Añadir una nota',
    myNotes: 'Mis notas',
    healthNotes: 'Informaciones médicales',
    is_medical: 'Nota médica',
  },
  creditAccountBalance: 'Sueldo',
  showPaymentPack: 'Ver los abonos',
  showInvoices: 'Ver las facturas',
  showSubscriptions: 'Ver las subscripciones',
  menu: {
    info: 'General',
    bookings: 'Reservas',
    paymentPack: 'Abonos',
    invoices: 'Facturas y subscripciones',
    payment: 'Facturar',
  },
  row: {
    headers: {
      actions: 'Actions', // no_translate
    },
    update: 'Modificar',
  },
  merge: 'Fusionar',
  forms: {
    merge: {
      success: 'Miembros fusionado',
      error: 'No es possible fusionar los clientes',

      srcMember: 'Cliente que sera suprimido',
      dstMember: 'Cliente que sera conservado',
      title: 'Fusion de los clientes',
      explainCredit: 'El sueldo sera transfirido',
      explainBookingsAndPassAndInvoiceAndNotes:
        'Los abonos, reservas, facturas y notas serian transferidos.',
      explainTags: 'Los tags del cliente suprimido no serian transferidos',
      cancel: 'Cancelar',
      submit: 'Fusionar',
    },
    error: 'No es possible guardar el cliente',
    create: {
      title: 'Nueve cliente',
      success: 'Cliente creado con éxito',
    },
    update: {
      title: 'Editar las informaciones',
      success: 'Cliente modificado con éxito',
    },
  },
  user: {
    existsWithEmail: 'Un cliente con este correo electronico {{email}} existe.',
    existsWithPhone: 'Un cliente con este telefono {{phonenumber}} existe.',
  },
  member: {
    existsWithEmail: 'Un cliente con este correo electronico {{email}} existe.',
    existsWithPhone: 'Un cliente con este telefono {{phonenumber}} existe.',
  },
  exists: {
    goTo: 'Ir al cliente',
    linkUser: 'Añadir el cliente',
  },
  link: {
    success: 'Cliente añadido con éxito',
  },
  linkDialog: {
    title: 'Añadir un cliente que existe',
    content:
      'Añadando un cliente que existe, confirma que este le ha dado el permiso para hacerlo.',
    cancel: 'Cancelar',
    confirm: 'Lo confirmo y añado este cliente',
  },
};
