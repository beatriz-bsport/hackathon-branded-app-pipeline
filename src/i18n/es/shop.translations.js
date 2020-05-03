exports.default = {
  select: {
    placeholder: 'Producto de la tienda',
  },
  dialog: {
    delete: {
      title: 'Suprimir {{shopitem.name}} de la tienda',
      cancel: 'Cancelar',
      confirm: 'Suprimir',
      explain:
        'Esta seguro de suprimirlo de la tienda. No se puede volver atrás',
    },
  },
  provision: {
    total_sales: 'Numero de productos vendidos :',
    current_stock: 'Existencias :',
    noProvisionHistory: 'No habia ventas',
    form: {
      title: 'Actulizar las existancias',
      quantityLabel: 'Unidades',
      quantityHelperText: 'Añadir o quitar de las existencias',
      cancel: 'Cancelar',
      submit: 'Guardar',
    },
    action: {
      update: 'Actualizar les existancias',
    },
  },
  shopitem: {
    noDescription: 'No hay descripción',
    detail: {
      title: 'Producto',
      provisionHistory: 'Cambios de las existancias',
      parameters: 'Parametros',
      supplier_price: 'Precio comprado',
      marketplace_enabled: 'Vender online si o no?',
      is_marketplace_enabled: 'Sí',
      is_marketplace_disabled: 'No',
    },
    action: {
      edit: 'Modificar',
      addToCard: 'Añadir a la cesta',
      delete: 'Suprimir',
    },
  },
};
