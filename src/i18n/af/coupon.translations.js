const BUYABLE_ITEM = require('@bsport/common/lib/master-data/buyable-items');

const {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_FEE,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
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
    title: 'Coupon',
    alert:
      "Un code de réduction peut être utilisé par un membre pour réduire le prix d'un panier. Dans ce formulaire, vous pouvez entièrement personnaliser les modalités d'application du code. Vous choisissez vous-même le code et c'est à vous de décider comment le partager avec vos membres.",
    selectorPlaceholder: {
      privatePass:
        "Sélectionner des cartes de rendez-vous (valables sur toutes les cartes si aucune n'est sélectionnée)",
      paymentPack:
        "Sélectionner des cartes de cours (valable sur toutes les cartes de cours si aucune n'est sélectionnée)",
      shopitem:
        "Sélectionner des produits du magasin (valable sur tous les produits si aucun n'est sélectionné)",
      paymentCombo:
        "Sélectionner des packs (valable sur tous les produits si aucun n'est sélectionné)",
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
      helperTextFranchise:
        "Le code que vous transmettrez aux clients concernés. Assurez-vous que le code n'existe pas déjà dans vos différents studios.",
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
        [BUYABLE_ITEM_COMBO_ITEM]: 'Pack',
        [null]: 'Ensemble du panier',
      },
      choicesFranchise: {
        [BUYABLE_ITEM_PASS]: 'Cartes de cours partagées',
        [BUYABLE_ITEM_PRIVATE_PASS]: 'Cartes de RDV partagées',
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
      apply: 'Appliquer',
      submit: 'Valider',
      cancel: 'annuler',
      label: 'Code promo',
      placeholder: 'SPECIAL_RENTREE',
      not_applicable: "Ce code promo n'est pas applicable.",
      not_found: "Ce code promo n'est pas valide.",
    },
  },
  search: 'Rechercher un code promo',
  reverted: 'Facture annulée',
  couponTemplate: {
    formDisclaimer:
      'Si dans le futur, vous souhaitez modifier cette section pour rendre cette promotion applicable sur une ou plusieurs cartes de cours/RDV en particulier, la liste des studios qui partageront cette promotion sera remise à zéro pour des questions de compatibilité.',
    warningDialog: {
      title: 'Confirmer la modification',
      content1:
        'Attention, vous souhaitez modifier des paramètres d’application de la promotion partagée sur certaines cartes de cours ou de RDV.',
      content2:
        'Cette opération va réinitialiser la liste des studios avec lesquels la promotion sera partagée.',
      content3:
        'Vous pourrez de nouveau choisir les studios qui partageront cette promotion.',
    },
    actions: {
      create: 'Ajouter un code partagé',
    },
    isEmptyExplain: 'Aucun code promotionnel partagé enregistré',
    notEditable:
      'Ce coupon est un coupon partagé par le compte franchiseur. Les éléments ont été définis par le compte franchiseur et ne sont pas modifiables.',
  },
  couponTemplateInstance: {
    create: {
      title: 'Configurer mes studios',
      explain1:
        'Les studios suivants seront compatibles avec les produits sélectionnés dans votre coupon.',
      explain2:
        "Si un membre applique un code promo dans l'un des studios compatibles, il pourra également l'utiliser dans les autres studios que vous avez défini.",
    },
    delete: {
      title: 'Stopper le partage',
      explain1:
        'Êtes-vous sûr de vouloir stopper le partage du code promotionnel pour {{name}} ?',
      explain2: "Vous pourrez l'ajouter de nouveau par la suite.",
    },
    companyEmpty: "Aucun studio n'est configuré pour accepter cette promotion",
  },
  uniqueCodeCoupon: {
    form: {
      alertInfo:
        "Les bons d'achat sont des codes uniques qui offrent une réduction de 100% sur un produit spécifique pour le membre. Ces codes ne sont pas générés par la plateforme elle-même, mais doivent être téléchargés ici sous forme de fichier CSV. Cette fonctionnalité est particulièrement utile si vous avez établi un partenariat avec une entité externe comme Groupon pour organiser une campagne promotionnelle. Dans ce cas, Groupon (ou une entité similaire) génère et vend les bons d'achat au nom de votre studio.",
      alertWarning: 'Non applicable aux souscriptions',
      couponCostForCompany: {
        label: 'Prix TTC',
        helperText:
          "Les revenus que vous obtenez du partenaire de la campagne pour chaque bon d'achat vendu. Ils seront utilisés lors du calcul de la valeur marginale pour la rénumération des professeurs ainsi que dans les rapports. Pour tout calcul ne tenant pas compte de la valeur marginale, les rapports ignoreront ce prix donné et traiteront cette promotion comme une remise de 100%.",
      },
      usage_per_member: {
        label: "Limiter le nombre de bons d'achat qu'un membre peut acheter",
        helperText: 'Limite maximale',
      },
      only_on_first_checkout: {
        label: 'Ne peut être utilisé que pour le premier achat',
      },
      fileUploader: {
        title: "Télécharger des bons d'achat uniques",
        label: 'Glisser/Déposer ou cliquer pour sélectionner le fichier',
        sizeLimitHelper: 'Fichier CSV (1Mo maximum)',
        helperText:
          "Veuillez télécharger un fichier CSV avec tous les codes de bons d'achat dans la première colonne, un code par ligne, sans en-tête.",
      },
      update: {
        alertInfo:
          'Il y a {{count}} code enregistré pour cette promotion, vous pouvez télécharger de nouveaux codes.',
        alertInfo_plural:
          'Il y a {{count}} codes enregistrés pour cette promotion, vous pouvez télécharger de nouveaux codes.',
        append: 'Ajouter aux codes existants',
        replace: 'Remplacer les codes existants',
        popover:
          'Les codes non utilisés seront supprimés, mais les codes utilisés seront conservés.',
      },
      errors: {
        required: 'Ce champ est requis',
        positiveNumber: 'La valeur doit être supérieure à 0',
        expirationDate: {
          dateBeforeNow:
            "La date d'expiration ne peut pas être antérieure à la date actuelle.",
          format: 'Erreur lors du formatage de la date',
        },
        fileUploader: {
          fileTooLargeError:
            'Le fichier est trop volumineux. Veuillez ne pas dépasser 1 Mo.',
          incorrectDataError:
            'Le fichier ne contient pas de données correctes.',
          notCsvFileError:
            'Le type de fichier ne correspond pas à un fichier CSV.',
        },
        only_on_objects:
          'Vous devez impérativement choisir un objet sur lequel appliquer la réduction',
        applies_to:
          "L'objet sur lequel appliquer la réduction doit être impérativement une carte de cours, une carte de rendez-vous, un pack ou un article du magasin",
        update_mode:
          'Si vous souhaitez modifier les codes enregistrés pour cette promotion vous pouvez ajouter les codes aux existants, ou remplacer les codes existants',
      },
    },
    voucherCodesDialog: {
      header: {
        codes: 'Codes',
        status: 'Statut',
      },
      selector: {
        allStatus: 'Tous les statuts',
        redeemed: 'Marqué comme utilisé',
        pending: 'En attente de validation externe',
        notUsed: 'Non utilisé',
      },
      checkBoxes: {
        selectAll: 'Tout sélectionner',
        unselectAll: 'Tout désélectionner',
      },
      searchBar: {
        placeHolder: 'Chercher un code',
      },
      noResult: 'Aucun résultat',
      export: 'Exporter',
      markAsRedeemed: 'Marquer comme utilisé',
      markAsRedeemed_plural: 'Marquer comme utilisés',
      close: 'Fermer',
    },
  },
  fabLabels: {
    voucherCodes: "Bons d'achat",
    discountCode: 'Code de réduction',
  },
  couponFilter: {
    title: 'Type de promotion',
    allType: 'Tout type de promotion',
  },
};
