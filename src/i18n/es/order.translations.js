exports.default = {
  products: {
    nbProducts: 'articulos',
  },
  state: {
    0: 'Esperando el pago',
    700: 'Pagada',
    1100: 'Cancelada',
    1200: 'Recuperar en el local',
    9000: 'Enviada',
  },
  table: {
    name: 'Comprador',
    state: 'Estatuto',
    updated_at: 'Actualizado',
    qty: 'Candidad',
  },
  form: {
    delivery: {
      first_name: 'Apellido',
      last_name: 'Nombre',
    },
  },
  actions: {
    flagAsCancelled: 'Cancelada',
    flagAsOnSiteDelivery: 'Recuperar en el locale',
    flagAsSent: 'Enviada',
  },
  detail: {
    section: {
      title: 'Estatuto de la pedida :',
      deliveryInfo: 'Dirección de entrega',
      productDetail: 'Productos',
      invoice: 'Facturas',
      member: 'Comprador',
    },
  },
  deliveryFee: {
    name: 'Titulo',
    fee: 'Gastos de envío',
    free_threshold: 'Ofrecidos a partir de',
    offeredAboveAmount:
      'Ofrecidos los gastos de envío si hay más de {{ free_threshold, price }} de compras',
    modal: {
      delete: {
        title: 'Suprimir un gastos de envío',
        content:
          'Cuidado ! No se puede volver atrás. Las antiguas pedidas utilizando estos gastos de envío no serian cambidadas.',
        cancel: 'Cancelar',
        confirm: 'Suprimir',
      },
    },
    forms: {
      create: 'Añadir un gastos de envío',
      title: 'Formulario gastos de envío',
      feeLabel: 'Gastos de envío',
      nameLabel: 'Titulo',
      freeThresholdLabel: 'Ofrecidos a partir de',
      freeThresholdHelper:
        'Ofrecidos los gastos de envío si hay más de {{ free_threshold, price }} de compras ',
      onCancel: 'Cancelar',
      onSubmit: 'Guardar',
    },
  },
  configuration: {
    deliveryFee: 'Gastos de envío',
    forms: {
      onSubmit: 'Guardar',
    },
    noDefaultDeliveryFee: 'Sin gastos de envío',
    defaultDeliveryFee: 'Gastos de envío aplicados',
  },
};
