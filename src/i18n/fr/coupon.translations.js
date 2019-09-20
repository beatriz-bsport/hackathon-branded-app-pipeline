export default {
  list: {
    isEmpty: 'Aucun code promotionnel enregistré',
    inactiveCoupons: 'Promotions désactivées ou expirées',
    activeCoupons: 'Promotions actives',
  },
  detail: {
    seeParameters: 'Voir les paramètres',
  },
  modal: {
    delete: {
      title: 'Suppression',
      content:
        "Êtes-vous sûr de vouloir supprimer ce code promotionnel ? Vous n'aurez plus accès à l'historique d'utilisation. Cette opération est définitive.",
      actions: {
        cancel: 'Annuler',
        submit: 'Supprimer',
      },
    },
  },
  message: {
    delete: {
      error: 'Impossible de supprimer cette promotion',
      success: 'Code promotionel supprimé',
    },
    update: {
      error: 'Impossible de modifier ce code',
      success: 'Code promotionnel modifié',
    },
    create: {
      error: 'Impossible de créer ce code',
      success: 'Code promotionnel enregistré',
    },
    attachToBasket: {
      error: 'Aucun code promo compatible trouvé',
    },
  },
  form: {
    section: {
      general: 'Général',
      availability: 'Disponibilité',
      usability: 'Utilisation',
      voucherConfig: 'Réduction',
      applies_to: 'Paramètres',
      advanced: 'Avancé',
    },
    name: {
      label: 'Nom',
    },
    code: {
      label: 'Code',
      helperText: 'Le code que vous transmettrez aux clients concernés',
    },
    voucher_type: {
      percent: 'En pourcentage',
      amount: 'En valeur',
    },
    percent_off: {
      label: 'Pourcentage de réduction',
    },
    amount_off: {
      label: 'Montant de la réduction',
    },
    is_active: {
      label: 'Actif',
      helperText: "Un code non-actif n'est pas utilisable par les clients",
    },
    with_expiration_date: {
      label: "Avec date d'expiration",
    },
    expiration_date: {
      clear_date: 'Aucune expiration',
      cancel: 'Annuler',
      label: "Date d'expiration",
    },
    usage_per_member: {
      label: "Limite d'utilisation par client",
    },
    usage_total: {
      label: "Limite d'utilisation tous membres confondus",
    },
    only_on_first_checkout: {
      label: 'Premier achat seulement',
    },
    combinable: {
      label: "Utilisable avec d'autres codes",
    },
    minimum_amount: {
      label: "Montant minimum d'achat",
    },
    applies_to: {
      choices: {
        pass: 'Abonnement',
        shop: 'Magasin',
        fee: 'Frais de livraison',
        all: 'Ensemble du panier',
      },
    },
    actions: {
      cancel: 'Annuler',
      submit: 'Valider',
    },
  },
  createCoupon: 'Ajouter un code',
  code: {
    addCoupon: {
      label: 'Code promo',
      placeholder: 'SPECIAL_RENTREE',
    },
  },
};
