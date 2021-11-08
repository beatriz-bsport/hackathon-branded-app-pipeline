const BUYABLE_ITEM = require('@bsport/common/lib/master-data/buyable-items');

const {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_FEE,
  BUYABLE_ITEM_PRIVATE_PASS,
} = BUYABLE_ITEM;

const {
  COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE,
  COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE,
  COUPON_SUBSCRIPTION_MODE_ALL_INVOICES,
  COUPON_SUBSCRIPTION_MODE_NONE,
} = require('@bsport/common/lib/master-data/coupon-subscription-mode');

exports.default = {
  list: {
    isEmpty: 'Aucun code promotionnel enregistré',
    inactiveCoupons: 'Promotions désactivées ou expirées',
    activeCoupons: 'Promotions actives',
  },
  detail: {
    seeParameters: 'Voir les paramètres',
  },
  card: {
    allowedFor: 'Autorisé pour',
    unallowedFor: 'Non-Autorisé pour',
    first_buy: 'Utilisable sur le premier achat seulement',
    expiration: "Date d'expiration",
    no_expiration: "Pas de date d'expiration",
    validity: 'Validité:',
    cumulable: 'Cumulable',
    no_cumulable: 'Non cumulable',
    uses: 'Utilisations',
    member_uses: 'utilisations par membre',
    member_use: 'utilisation par membre',
    limitation: 'Limité à',
    whitelist_tags:
      'Disponible uniquement pour les membres ayant certains tags',
    blacklist_tags: 'Indisponible pour les membres ayant certains tags',
  },
  noDiscount: 'Aucun achat effectué avec le code',
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
  form: {
    selectorPlaceholder: {
      privatePass:
        "Sélectionner des cartes de rendez-vous (valables sur toutes les cartes si aucune n'est sélectionnée)",
      paymentPack:
        "Sélectionner des cartes de cours (valable sur toutes les cartes de cours si aucune n'est sélectionnée)",
      shopitem:
        "Sélectionner des produits du magasin (valable sur tous les produits si aucun n'est sélectionné)",
    },
    section: {
      subscription: 'Souscription (contrat)',
      general: 'Général',
      availability: 'Disponibilité',
      usability: 'Utilisation',
      voucherConfig: 'Réduction',
      applies_to: 'Paramètres',
      advanced: 'Avancé',
      tags: 'Tags',
      tagInfo:
        'Utilisez les tags pour rendre le coupon utilisable uniquement par un groupe de membre souhaité sur la marketplace, le widget et l’application. Vous pouvez sélectionner des tags pour rendre le coupon utilisable seulement par les membres possédants un des tags choisis. Ou bien vous pouvez sélectionner des tags pour rendre le coupon inutilisable seulement par les membres possédants un des tags sélectionnés. ',
      whitelist_tags: 'Autorisé',
      blacklist_tags: 'Non - Autorisé',
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
    subscription_mode: {
      [COUPON_SUBSCRIPTION_MODE_NONE]: 'Non utilisable',
      [COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE]: 'Toutes les facturations',
      [COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE]: 'Uniquement premier mois',
      [COUPON_SUBSCRIPTION_MODE_ALL_INVOICES]:
        'Uniquement premier cycle de facturation (avant renouvellement)',
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
        [BUYABLE_ITEM_PASS]: 'Carte de cours',
        [BUYABLE_ITEM_SHOP_ITEM]: 'Magasin',
        [BUYABLE_ITEM_FEE]: 'Frais de livraison',
        all: 'Ensemble du panier',
        [BUYABLE_ITEM_PRIVATE_PASS]: 'Carte RDV',
        [null]: 'Ensemble du panier',
      },
    },
    actions: {
      cancel: 'Annuler',
      submit: 'Valider',
    },
    tag: {
      tag_group: 'Groupe',
      tag: 'Tag',
      select: {
        tag_group: 'Choisissez un groupe de tags',
        tag: 'Sélectionnez un tag',
        empty_tag_list: 'Auncun tag sélectionné',
        error: 'Un même tag ne peut pas être présent dans les deux listes',
      },
    },
  },
  createCoupon: 'Ajouter un code',
  code: {
    addCoupon: {
      submit: 'Valider',
      cancel: 'annuler',
      label: 'Code promo',
      placeholder: 'SPECIAL_RENTREE',
    },
  },
  search: 'Rechercher un code promo',
};
