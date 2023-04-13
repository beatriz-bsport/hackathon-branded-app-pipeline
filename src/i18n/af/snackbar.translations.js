const {
  OFFER_WAITING_LIST_STATUS_FULL,
  OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON,
  OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE,
  OFFER_BOOKABLE_STATUS_FULL,
  OFFER_BOOKABLE_STATUS_LOCKED,
  OFFER_BOOKABLE_STATUS_ALREADY_BOOKED,
  OFFER_BOOKABLE_STATUS_TOO_MANY_MALE,
  OFFER_BOOKABLE_STATUS_TOO_MANY_FEMALE,
  OFFER_BOOKABLE_STATUS_TOO_MANY_IN_FUTURE,
  SPOT_NOT_AVAILABLE,
  PAYMENT_COMBO_CANT_BE_BOUGHT_HAS_REACHED_MAX_PURCHASE,
  PAYMENT_COMBO_CANT_BE_BOUGHT_NEW_ONLY_ONLY,
  PAYMENT_PACK_CAN_NOT_BE_BOUGHT_NEW_MEMBER_ONLY,
  PAYMENT_PACK_CAN_NOT_BE_BOUGHT_MAX_PURCHASE_REACHED,
  PAYMENT_PACK_CAN_NOT_BE_BOUGHT_MANAGER_ONLY,
  PAYMENT_PACK_CAN_NOT_BE_BOUGHT_DISABLED,
  PAYMENT_PACK_CAN_NOT_BE_BOUGHT_VALIDITY_DATERANGE,
  PAYMENT_PACK_CAN_NOT_BE_BOUGHT_INCOMPATIBLE_WITH_OFFER,
  PAYMENT_PACK_CAN_NOT_BE_BOUGHT_ACTIVITY_INCOMPATIBLE,
  PAYMENT_PACK_CAN_NOT_BE_BOUGHT_SCT_INCOMPATIBLE,
  PAYMENT_PACK_CAN_NOT_BE_BOUGHT_ESTABLISHMENT_INCOMPATIBLE,
  PAYMENT_PACK_CAN_NOT_BE_BOUGHT_VOD_ONLY,
  PAYMENT_PACK_CAN_NOT_BE_BOUGHT_BAD_COMPANY,
  CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_DAY,
  CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_WEEK,
  CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_MONTH,
  CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_YEAR,
  PRIVATE_SLOT_ALREADY_BOOKED,
  GIFTCARD_CAN_NOT_BE_BOUGHT_DISABLED,
  GIFTCARD_CAN_NOT_BE_BOUGHT_MANAGER_ONLY,
  SHOP_ITEM_CAN_NOT_BE_BOUGHT_NOT_ENOUGH_STOCK,
} = require('@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought');

const {
  LOCK_ACQUISITION_FAILURE_GENERIC,
  LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING,
  BASKET_LOCK_ACQUISITION_FAILURE,
} = require('@bsport/common/lib/master-data/error-codes/lock');

const {
  PAYMENT_METHOD_NOT_DETACHABLE_PAYMENT_GROUP_ERROR_CODE,
  PAYMENT_METHOD_NOT_DETACHABLE_ERROR_CODE,
  PAYMENT_METHOD_NOT_DETACHABLE_PLANNED_PAYMENT_EVENT_ERROR_CODE,
  PAYMENT_METHOD_NOT_DETACHABLE_BILLING_PLAN_ERROR_CODE,
  PAYMENT_METHOD_NOT_DETACHABLE_FUTURE_PAYMENT_ERROR_CODE,
} = require('@bsport/common/lib/master-data/error-codes/payment-method');

const {
  ERROR_CUSTOM_FORM_ANSWER_IS_MANDATORY,
  ERROR_CUSTOM_FORM_ANSWER_SIGN_UP_EMAIL_ALREADY_EXISTS,
  ERROR_CUSTOM_FORM_ANSWER_SIGN_UP_GENDER_IS_INVALID,
  ERROR_CUSTOM_FORM_ANSWER_SIGN_UP_PHONE_NUMBER_IS_INVALID,
} = require('@bsport/common/lib/master-data/error-codes/custom-form');

const {
  PENDING_PAYMENT_INTENT_OF_PAYMENT_GROUP_BLOCKS_OTHER_PAYMENT_GROUP_CREATION,
} = require('@bsport/common/lib/master-data/payment-group');

const {
  INVOICE_PAYMENT_BY_GIFTCARD_ERROR,
  GIFTCARD_ACTIVATION_CODE_ERROR_CODE,
  GIFTCARD_ACTIVATION_UNAUTHORIZED_WHEN_DISABLED,
  GIFTCARD_ACTIVATION_UNAUTHORIZED_WHEN_ALREADY_ACTIVATED,
  GIFTCARD_ACTIVATION_FAIL_WHEN_MISSING_RECIPIENT_MEMBER,
} = require('@bsport/common/lib/master-data/error-codes/giftcard');
const {
  EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN,
  EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_LIMIT_FOR_SMARTLIST_REACHED,
  EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_EMAIL_WITH_NO_TITLE,
  EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_EMAIL_WITH_NO_BODY,
  EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_SMS_WITH_NO_BODY,
  EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_PUSH_NOTIFICATION_WITH_NO_TITLE,
  EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_PUSH_NOTIFICATION_WITH_NO_BODY,
} = require('@bsport/common/lib/master-data/smart-list');

const {
  BILLING_PLAN_EXCEPTION_BLOCKING_SWITCHING_CONTENT_WITH_TEMPLATE_INSTANCE,
} = require('@bsport/common/lib/master-data/error-codes/subscription');

const {
  CANNOT_REQUEST_REPLACEMENT_OFFER_NOT_AVAILABLE,
  CANNOT_REQUEST_REPLACEMENT_ALREADY_REQUESTED,
  CANNOT_REQUEST_REPLACEMENT_COACH_OVERRIDE,
  REPLACEMENT_REQUEST_COACH_HAS_REACHED_MAX_NB_LATE_REQUEST,
  REPLACEMENT_REQUEST_CANNOT_POSTPONE_CLOSING_DATE_AFTER_OFFER_DATE_START,
  REPLACEMENT_REQUEST_CANNOT_BE_REFUSED_IF_TEACHER_ALREADY_FOUND,
  REPLACEMENT_REQUEST_CANNOT_BE_CANCELLED_IF_TEACHER_ALREADY_FOUND,
  REPLACEMENT_REQUEST_CANNOT_ATTRIBUTE_TEACHER_IF_TEACHER_ALREADY_FOUND,
  REPLACEMENT_REQUEST_CANNOT_ATTRIBUTE_TEACHER_IF_ANSWERED_NO,
  REPLACEMENT_REQUEST_CANNOT_BE_CANCELLED_IF_MANAGER_REFUSED,
  REPLACEMENT_REQUEST_COACH_ANSWER_CANT_BE_CREATED_IF_REQUEST_IS_CLOSED,
  REPLACEMENT_REQUEST_COACH_ANSWER_COACH_CANT_ANSWER_ON_HIS_OWN_REPLACEMENT_REQUEST,
  REPLACEMENT_REQUEST_DATES_EXCEPTION,
  REPLACEMENT_REQUEST_LIMITATION_EXCEPTION,
} = require('@bsport/common/lib/master-data/error-codes/replacement');

const {
  INVOICE_NO_REFUND_ON_INTERAC_PAYMENT_ERROR_CODE,
  INVOICE_NO_REFUND_ON_TYPE_EMPTY_CONTAINER,
} = require('@bsport/common/lib/master-data/error-codes/payment');

const {
  COACH_EDIT_EMAIL_ADDRESS_IS_STAFF_USER,
  COACH_EMAIL_ADDRESS_EXISTS,
  COACH_CREATE_EMAIL_ADDRESS_IS_FRANCHISOR_USER,
} = require('@bsport/common/lib/master-data/error-codes/associated-coach');

const {
  DST_CONSUMER_PAYMENT_PACK_CANNOT_BE_SHARED_AGAIN,
  DST_PRIVATE_CONSUMER_PASS_CANNOT_BE_SHARED_AGAIN,
} = require('@bsport/common/lib/master-data/error-codes/shared-pass');

exports.default = {
  canNotBuyErrorCode: {
    generic: 'Impossible de réserver',
    [OFFER_WAITING_LIST_STATUS_FULL]: "La liste d'attente est pleine",
    [OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED]:
      "Vous êtes déjà inscrit en liste d'attente",
    [OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON]:
      "La séance n'est pas encore ouverte aux réservations",
    [OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE]:
      "La séance n'est plus ouverte aux réservations",
    [OFFER_BOOKABLE_STATUS_FULL]: 'La séance est pleine',
    [OFFER_BOOKABLE_STATUS_LOCKED]: "La séance n'est pas réservable",
    [OFFER_BOOKABLE_STATUS_ALREADY_BOOKED]:
      'Vous êtes déjà inscrit à cette séance',
    [OFFER_BOOKABLE_STATUS_TOO_MANY_MALE]:
      'Le déséquilibre homme/femme est trop important, réservation impossible',
    [OFFER_BOOKABLE_STATUS_TOO_MANY_FEMALE]:
      'Le déséquilibre homme/femme est trop important, réservation impossible',
    [OFFER_BOOKABLE_STATUS_TOO_MANY_IN_FUTURE]:
      'Vous essayez de réserver plus de séances futures que ce qui est permis par votre club',
    [SPOT_NOT_AVAILABLE]: "Le spot que vous avez choisi n'est plus disponible",
    [PAYMENT_COMBO_CANT_BE_BOUGHT_HAS_REACHED_MAX_PURCHASE]:
      'Vous ne pouvez plus acheter ce pack',
    [PAYMENT_COMBO_CANT_BE_BOUGHT_NEW_ONLY_ONLY]:
      "Ce pack n'est disponible que pour les nouveaux membres",
    [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_NEW_MEMBER_ONLY]:
      "Cette carte de cours n'est disponible que pour les nouveaux membres",
    [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_MAX_PURCHASE_REACHED]:
      'Vous ne pouvez plus racheter ce pass',
    [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_MANAGER_ONLY]:
      "Ce pass n'est pas disponible à la vente",
    [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_DISABLED]:
      "Ce pass n'est pas disponible à la vente",
    [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_VALIDITY_DATERANGE]:
      "Ce pass n'est pas compatible pour une réservation à la date choisie",
    [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_INCOMPATIBLE_WITH_OFFER]:
      "Ce pass n'est pas compatible avec cette séance",
    [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_ACTIVITY_INCOMPATIBLE]:
      "Ce pass n'est pas compatible avec cette activité",
    [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_SCT_INCOMPATIBLE]:
      "Ce pass n'est pas compatible avec cette catégorie d'activité",
    [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_ESTABLISHMENT_INCOMPATIBLE]:
      "Ce pass n'est pas compatible avec ce lieu",
    [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_VOD_ONLY]:
      'Ce pass ne permet pas de réserver des séance (VOD seulement)',
    [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_BAD_COMPANY]:
      "Ce pass n'est pas compatible avec cette séance",
    [CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_DAY]:
      'Votre carte de cours ne permet plus de réserver pour ce jour',
    [CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_WEEK]:
      'Votre carte de cours ne permet plus de réserver cette semaine',
    [CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_MONTH]:
      'Votre carte de cours ne permet plus de réserver ce mois',
    [CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_YEAR]:
      'Votre carte de cours ne permet plus de réserver cette année',
    [GIFTCARD_CAN_NOT_BE_BOUGHT_DISABLED]:
      "La carte cadeau n'est plus disponible à la vente.",
    [GIFTCARD_CAN_NOT_BE_BOUGHT_MANAGER_ONLY]:
      "La carte cadeau n'est plus disponible à la vente.",
    [SHOP_ITEM_CAN_NOT_BE_BOUGHT_NOT_ENOUGH_STOCK]: 'Stock insuffisant',
    [LOCK_ACQUISITION_FAILURE_GENERIC]:
      'Une réservation est déjà en cours, veuillez patienter quelques instants',
    [LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING]:
      'Impossible de réserver. Ce spot est en cours de réservation par un autre membre. Veuillez réessayer en choisissant un autre spot.',
    [BASKET_LOCK_ACQUISITION_FAILURE]:
      "L'objet est déjà en train d'être ajouté au panier, veuillez patienter",
  },
  requestCurrentBasket: {
    [BASKET_LOCK_ACQUISITION_FAILURE]:
      'La récupération des informations du panier est déjà en cours',
  },
  refreshInternalAccountPrepaidLines: {
    [BASKET_LOCK_ACQUISITION_FAILURE]:
      'Une opération est déjà en cours, veuillez patienter quelques instants',
  },
  removeItem: {
    [BASKET_LOCK_ACQUISITION_FAILURE]:
      "L'objet est déjà en train d'être retiré du panier, veuillez patienter",
  },
  offer: {
    restore: {
      success: 'Séance restaurée',
      error: 'Impossible de restaurer cette séance',
    },
  },
  settings: {
    update: {
      success: 'Paramètres mis à jour',
      error: 'Impossible de mettre à jour, veuillez réessayer plus tard',
    },
  },
  invoice: {
    returnPaymentLocked:
      'Impossible de rembourser ce paiement, votre compte Stripe est-il assez approvisionné ?',
    update: {
      success: 'Facture mise à jour avec succès',
    },
    create: {
      success: 'Facture enregistrée',
    },
    error: "Erreur lors de l'enregistrement - Annulé",
    billingEstablishment: {
      error: {
        unAuthorizedEstablishmentModification:
          "Impossible de modifier l'établissement de facturation, seuls les administrateurs en possèdent le droit de modification",
      },
    },
    sendToQuickbooks: {
      success: 'Votre facture a été transférée sur Quickbooks',
      error:
        'Une erreur est survenue pendant le transfère de votre facture sur Quickbooks',
      errors: {
        title: "Erreur lors de l'envoi de votre facture",
        931000: "Erreur lors de l'authentification à Quickbooks",
        931001: "Erreur lors de l'authentification à Quickbooks",
        931002: "Clefs d'authentifications expirées",
        931003: "Clefs d'authentifications expirées",
        931004: "Vous n'avez pas configuré votre application QuickBooks",
        931100: "Erreur lors de la mise à jour des clefs d'authentifications",
        931101: 'Quickbooks ne parvient pas à nous transmettre vos données',
        932000: "Votre compte n'est plus authentifié sur Bsport",
        932001: "Votre compte n'est plus authentifié sur Bsport",
        932100:
          "Impossible d'accéder aux informations de votre compte Quickbooks",
        933000:
          'Le membre associé à la facture ne possède pas les informations nécessaires pour être enregistrer sur QuickBooks',
        933100: 'Impossible de créer le client associé au membre de la facture',
        933101: 'Impossible de créer le client associé au membre de la facture',
        933102: 'Erreur lors de la création de la facture sur Quickbooks',
        933103:
          'Votre plateforme QuickBooks supporte plusieures devises, veuillez préciser la taxe à utiliser.',
        934000:
          'La facture ne possède pas les informations minimales pour être créée sur Quickbooks',
        934001: 'Impossible de créer une facture sans items associés',
        934002: "Impossible d'envoyer une facture annulée sur QuickBooks",
        934003: "Imposible d'envoyer une facture non finalisée sur QuickBooks",
        934004: "Impossible d'envoyer une facture impayée sur QuickBooks",
        934005: 'Votre facture ne peux pas être envoyée sur QuickBooks',
        934006: 'Cette facture est déjà enregistrée sur QuickBooks',
      },
    },
    revert: {
      errors: {
        [INVOICE_NO_REFUND_ON_INTERAC_PAYMENT_ERROR_CODE]:
          "Impossible d'annuler une facture avec des paiements Interac.",
        [INVOICE_NO_REFUND_ON_TYPE_EMPTY_CONTAINER]:
          "Impossible de rembourser en avoir une facture d'ajustement de solde.",
      },
    },
    applyBalance: {
      success: 'Le montant de votre solde a été appliqué à la facture.',
      error: "Impossible d'utiliser votre solde pour régler cette facture.",
    },
    applyGiftcard: {
      success: 'Paiement par carte cadeau validé',
      error: 'Impossible de payer le montant demandé avec cette carte cadeau',
      errors: {
        [INVOICE_PAYMENT_BY_GIFTCARD_ERROR]:
          'Impossible de régler cette facture avec cette carte cadeau',
        [GIFTCARD_ACTIVATION_CODE_ERROR_CODE]:
          "Le code d'activation de la carte n'est pas le bon.",
        [GIFTCARD_ACTIVATION_UNAUTHORIZED_WHEN_DISABLED]:
          'La carte cadeau a été désactivée.',
        [GIFTCARD_ACTIVATION_UNAUTHORIZED_WHEN_ALREADY_ACTIVATED]:
          'La carte cadeau a déjà été activée',
        [GIFTCARD_ACTIVATION_FAIL_WHEN_MISSING_RECIPIENT_MEMBER]:
          'Impossible de reconnaître le membre qui souhaite activer la carte.',
        generic: "Impossible d'activer la carte cadeau",
      },
    },
  },
  zoom: {
    created: {
      success: 'Compte Zoom lié avec succès',
      error: 'Erreur lors du lien du compte Zoom',
    },
  },
  copied: 'Copié dans le presse-papier',
  link: {
    copied: 'Lien copié dans le presse-papier',
  },
  coach: {
    editAccessToCoachSpace: {
      error:
        "Erreur lors de la modification des droits d'accès à l'espace professeur",
    },
    linkByEmail: {
      success: 'Professeur lié avec succès',
    },
    error: 'Impossible de sauvegarder le professeur',
    errors: {
      [COACH_EDIT_EMAIL_ADDRESS_IS_STAFF_USER]:
        "L'email indiqué est déjà lié à un compte staff.",
      [COACH_EMAIL_ADDRESS_EXISTS]:
        'Un membre existe déjà avec cet email. Pour les relier, utiliser la popup précédente.',
      [COACH_CREATE_EMAIL_ADDRESS_IS_FRANCHISOR_USER]:
        "L'email indiqué est déjà lié à un compte staff franchise.",
    },
    create: {
      success: 'Professeur créé avec succès',
    },
    update: {
      success: 'Professeur modifié avec succès',
    },
    delete: {
      success: 'Professeur supprimé',
      error: 'Impossible de supprimer le professeur',
    },
    restore: {
      success: 'Professeur restauré avec succès',
      error: 'Impossible de restaurer le professeur',
    },
  },
  relationship: {
    error: {
      90002: "Le membre n'est pas défini",
      90001: 'Requête invalide',
      90003: 'Token invalide',
      90000: "Droits d'accès à cette relation refusés",
    },
    edit: {
      success: 'Relation modifiée',
    },
    create: {
      success: 'Relation enregistrée',
    },
    delete: {
      success: 'Relation supprimée',
      error: 'Impossible de supprimer cette relation',
    },
    createOrUpdate: {
      error: "Impossible d'enregistrer la relation",
    },
    consumer_payment_pack_links: {
      create: {
        success: 'Carte partagée',
        error: {
          generic: 'Impossible de partager cette carte',
          [DST_CONSUMER_PAYMENT_PACK_CANNOT_BE_SHARED_AGAIN]:
            'Cette carte est partagée depuis un autre compte',
        },
      },
      unlink: {
        success: 'Partage supprimé',
        error: 'Impossible de supprimer ce partage',
      },
      relink: {
        success: 'Partage enregistré',
        error: 'Impossible de partager cette carte',
      },
    },
    private_consumer_pass_links: {
      create: {
        success: 'Carte RDV partagée',
        error: {
          generic: 'Impossible de partager cette carte RDV',
          [DST_PRIVATE_CONSUMER_PASS_CANNOT_BE_SHARED_AGAIN]:
            'Cette carte RDV est partagée depuis un autre compte',
        },
      },
      unlink: {
        success: 'Partage supprimé',
        error: 'Impossible de supprimer ce partage',
      },
      relink: {
        success: 'Partage enregistré',
        error: 'Impossible de partager cette carte RDV',
      },
    },
  },
  paymentRules: {
    update: {
      success: 'Règle par défaut modifiée',
      error: 'Erreur lors de la modification',
    },
    create: {
      error: 'Erreur lors de la création',
      success: 'Règle ajoutée',
    },
    delete: {
      error: 'Erreur lors de la suppression',
      success: 'Règle supprimée',
    },
  },
  paymentRuleGroups: {
    update: {
      success: 'Groupe modifié avec succes',
      error: {
        generic: 'Erreur lors de la modification',
        coachWithPaymentGroup:
          "Imposible de modifier les règles de rémunération d'un coach inclu dans un groupe",
      },
    },
    create: {
      error: 'Erreur lors de la création',
      success: 'Groupe ajouté',
    },
    delete: {
      error: 'Erreur lors de la suppression',
      success: 'Groupe supprimé',
    },
  },
  paymentPack: {
    paymentPackDisabled: {
      success: 'Carte de cours désactivée',
      error: 'Impossible de désactiver la carte',
    },
    paymentPackEnabled: {
      success: 'Carte de cours restaurée',
      error: 'Impossible de restaurer la carte',
    },
    credit: {
      updated: 'Crédits mis à jour',
      error: "Erreur lors de l'enregistrement",
    },
    createOrUpdate: {
      success: 'Carte de cours enregistrée',
      fail: "Erreur lors de l'enregistrement de la carte",
    },
    category: {
      update: {
        success: 'Categorie modifiée avec succès',
        error: 'Impossible de modifier la catégorie',
      },
      create: {
        success: 'Nouvelle catégorie créée avec succès',
        error: 'Impossible de créer cette catégorie',
      },
      delete: {
        success: 'Catégorie supprimée',
        error: 'Impossible de supprimer la catégorie',
      },
    },
  },
  paymentMethod: {
    errors: {
      [PAYMENT_METHOD_NOT_DETACHABLE_PAYMENT_GROUP_ERROR_CODE]:
        'Impossible de supprimer cette méthode paiement, veuillez réessayer un peu plus tard',
      [PAYMENT_METHOD_NOT_DETACHABLE_ERROR_CODE]:
        'Impossible de supprimer cette méthode paiement, veuillez réessayer un peu plus tard',
      [PAYMENT_METHOD_NOT_DETACHABLE_PLANNED_PAYMENT_EVENT_ERROR_CODE]:
        'Des paiements futurs sont programmés avec ce moyen de paiement',
      [PAYMENT_METHOD_NOT_DETACHABLE_BILLING_PLAN_ERROR_CODE]:
        'Une souscription est programmée avec ce moyen de paiement',
      [PAYMENT_METHOD_NOT_DETACHABLE_FUTURE_PAYMENT_ERROR_CODE]:
        'Des paiements futurs sont programmés avec ce moyen de paiement',
    },
    detach: {
      pm_deleted: 'Moyen de paiement supprimé',
      last_payment_method:
        'Impossible de supprimer votre unique moyen de paiement',
      pm_associated_to_protected_bp:
        'Impossible : Vous avez une souscription associée à ce moyen de paiement',
      pm_associated_to_registered_ppe:
        'Impossible : Vous avez une souscription associée à ce moyen de paiement',
      pm_associated_to_pi:
        'Impossible : Vous avez une souscription associée à ce moyen de paiement',
    },
  },
  coupon: {
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
    createOrUpdate: {
      success: 'Code promotionnel enregistré',
      error: "Erreur lors de l'enregistrement du code promotionnel",
    },
    attachToBasket: {
      error: 'Aucun code promo compatible trouvé',
    },
    templateInstance: {
      create: {
        error: 'Impossible de partager cette promotion avec ce(s) studio(s)',
      },
    },
  },
  email: {
    create: {
      success: 'Email créé',
      error: "Impossible d'enregistrer l'email",
    },
    update: {
      success: 'Email modifié',
      error: "Impossible de modifier l'email",
    },
    delete: {
      success: 'Email supprimé',
      error: "Impossible de supprimer l'email",
    },
  },
  establishment: {
    restore: {
      success: 'Salle restorée',
      error: 'Impossible de restaurer cette salle',
    },
    delete: {
      success: 'Salle supprimée',
      error: 'Impossible de supprimer cette salle',
    },
    error: 'Impossible de sauvegarder la salle',
    create: {
      success: 'Salle créée avec succès',
    },
    update: {
      success: 'Salle modifiée avec succès',
    },
  },
  establishmentGroup: {
    create: {
      success: 'La nouvelle localisation a été créée',
      error: 'Impossible de créer la localisation',
    },
    update: {
      success: 'Localisation modifiée',
      error: 'Impossible de modifier la localisation',
    },
    delete: {
      success: 'Localisation supprimée',
      error: 'Impossible de supprimer la localisation',
    },
  },
  establishmentBillingGroup: {
    create: {
      success: 'Le nouveau groupe de facturation  a été créé',
      error: 'Impossible de créer le groupe de facturation',
    },
    update: {
      success: 'Groupe de facturation modifié',
      error: 'Impossible de modifier le groupe de facturation',
    },
    delete: {
      success: 'Groupe de facturation supprimé',
      error: 'Impossible de supprimer le groupe de facturation',
    },
  },
  memberNote: {
    delete: {
      success: 'Note supprimée',
      error: 'Impossible de supprimer la note',
    },
  },
  member: {
    link: {
      success: 'Compte lié avec succès',
    },
    merge: {
      success: 'Membres fusionnés',
      seeMemberPage: ' Voir la page du membre',

      error: 'Impossible de fusionner les membres',

      srcMember: 'Membre à fusionner (supprimé)',
      dstMember: 'Membre à conserver',
      title: 'Fusion membre',
      explainCredit: "L'acompte interne du membre sera transféré",
      explainBookingsAndPassAndInvoiceAndNotes:
        'Les cartes de cours, réservations, factures et notes seront transférés.',
      explainTags: 'Les tags du membre supprimés ne seront pas transférés',
      cancel: 'Annuler',
      submit: 'Fusionner',
    },
    error: 'Impossible de sauvegarder le membre',
    create: {
      title: 'Nouveau membre',
      success: 'Membre créé avec succès',
    },
    update: {
      title: 'Edition des informations',
      success: 'Membre modifié avec succès',
    },
    createOrUpdate: {
      success: 'Informations enregistrées',
      error: "Erreur lors de l'enregistrement",
    },
    changeEmailRequest: {
      create: {
        success: "Email de confirmation de changement d'email envoyé",
        error: "Impossible créer la demande de changement d'email",
      },
    },
  },
  activity: {
    create: {
      success: 'Activité sauvegardée',
      error: "Impossible de sauvegarder l'activité",
    },
    update: {
      success: 'Activité mise à jour',
      error: "Impossible de mettre à jour l'activité",
    },
  },
  notificationRule: {
    createOrUpdate: {
      success: 'Modifié avec succès',
      error: "Impossible d'enregistrer",
    },
  },
  role: {
    update: {
      success: 'Autorisations modifiées',
    },
    error: {
      generic: 'Impossible de modifier cette autorisation',
      errorEmail:
        'Cet email est déjà utilisé pour un compte élève ou professeur',
    },
    noMasterControl: {
      overbookingNotAllowed:
        'Vous ne pouvez pas dépasser le nombre maximum de réservations.',
      overbookingNotAllowedInWaitingList:
        "Vous ne pouvez pas dépasser la capacité maximale de la liste d'attente.",
      overrideEstablishmentNotAllowed:
        'Vous ne pouvez pas forcer le rendez-vous dans cette salle.',
      overrideCoachNotAllowed:
        'Vous ne pouvez pas forcer le rendez-vous avec ce professeur.',
      changeDateEstablishmentUnaivalable:
        "Impossible de réserver sur cette date : la salle n'est pas libre.",
      changeDateCoachUnaivalable:
        "Impossible de réserver sur cette date : le professeur n'est pas libre.",
    },
  },
  shop: {
    subShop: {
      createOrUpdate: {
        success: 'Catégorie enregistrée avec succès',
        error: "Impossible d'enregsitrer la catégorie",
      },
      delete: {
        success: 'Catégorie supprimée',
        error: 'Impossible de supprimer la catégorie',
      },
    },
    item: {
      updateProvisions: {
        success: 'Stock mis à jour',
        error: "Erreur lors de l'enregistrement du stock",
      },
      duplicate: {
        success: 'Produit dupliqué avec succès',
        error: 'Impossible de dupliquer le produit',
      },
      createOrUpdate: {
        success: 'Enregistré',
        error: "Erreur lors de l'enregistrement",
      },
      delete: {
        success: 'Elément supprimé',
        error: 'Erreur lors de la suppression',
      },
    },
  },
  smartlist: {
    create: {
      success: 'Smartlist créée avec succès',
      error: "Impossible d'enregistrer la smartlist",
    },
    update: {
      success: 'Smartlist mise à jour avec succès',
      error: "Impossible d'enregistrer la smartlist",
    },
    delete: {
      success: 'Smartlist supprimée',
      error: 'Impossible de supprimer la smartlist',
    },
    duplicate: {
      success: 'Smartlist dupliquée',
      error: 'Impossible de dupliquer la smarlist',
    },
    tag_rules: {
      success: 'La règle automatique a été lancée',
      error: "Impossible d'appliquer cette règle",
      limit_reached:
        'Impossible : Vous avez atteint la limite de création (10)',
    },
  },
  automatedCampaign: {
    [EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN]: 'Une erreur est servenue',
    [EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_LIMIT_FOR_SMARTLIST_REACHED]:
      "Erreur: Nombre limite d'envois par membre invalide",
    [EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_EMAIL_WITH_NO_TITLE]:
      'Erreur: Titre obligatoire',
    [EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_EMAIL_WITH_NO_BODY]:
      "Erreur: Contenu de l'email obligatoire",
    [EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_SMS_WITH_NO_BODY]:
      'Erreur: Contenu du SMS obligatoire',
    [EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_PUSH_NOTIFICATION_WITH_NO_TITLE]:
      'Erreur: Titre de notification obligatoire',
    [EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_PUSH_NOTIFICATION_WITH_NO_BODY]:
      'Erreur: Contenu de la notification obligatoire',
  },
  subscription: {
    switchPaymentMethod: {
      success: 'Méthode de paiement mise à jour',
      error: 'Impossible de modifier la méthode de paiement',
    },
    stop: {
      success: 'La souscription a été arrétée',
      warning:
        "Impossible d'arrêter pour le moment, un paiement est-il en cours de transfert ?",
      error: "Impossible d'arrêter la souscription pour le moment",
    },
    switchPack: {
      success: 'Carte de cours modifiée',
      error: 'Impossible de modifier la carte de cours',
    },
    switchPrivatePass: {
      success: 'Carte de rendez-vous modifiée',
      error: 'Impossible de modifier la carte de rendez-vous',
    },
    switchPaymentCombo: {
      success: 'Pack modifié',
      error: 'Impossible de modifier le pack',
    },
    switchItemsErrors: {
      paymentPack: {
        [BILLING_PLAN_EXCEPTION_BLOCKING_SWITCHING_CONTENT_WITH_TEMPLATE_INSTANCE]:
          "Impossible : Le changement de carte de cours partagée entre franchisés n'est pas autorisé",
      },
      privatePass: {
        [BILLING_PLAN_EXCEPTION_BLOCKING_SWITCHING_CONTENT_WITH_TEMPLATE_INSTANCE]:
          "Impossible : Le changement de carte de rendez-vous partagée entre franchisés n'est pas autorisé",
      },
      paymentCombo: {
        [BILLING_PLAN_EXCEPTION_BLOCKING_SWITCHING_CONTENT_WITH_TEMPLATE_INSTANCE]:
          "Impossible : Le changement de pack partagé entre franchisés n'est pas autorisé",
      },
    },
    freeze: {
      success: 'Souscription mise en pause',
      locked:
        'Impossible de mettre en pause pour le moment, un paiement est-il en attente ?',
      error: 'Impossible de mettre en pause cette souscription',
      deleteFail: 'Impossible de supprimer une pause déjà commencée.',
      deleteSuccess: 'La pause a bien été supprimée',
    },
    register: {
      success: 'Abonnement enregistré avec succès',
      error: "Impossible d'enregistrer l'abonnement",
    },
    updatePrice: {
      success: 'Montant mis à jour',
      error: 'Impossible de modifier ce montant',
    },
    youSubscribed: {
      error: "Erreur lors de l'abonnement",
      success: 'Vous êtes désormais abonné',
    },
    contract: {
      restore: {
        success: 'Contrat restauré avec succès',
        error: 'Impossible de restaurer le contrat',
      },
    },
    billNow: {
      errors: {
        [PENDING_PAYMENT_INTENT_OF_PAYMENT_GROUP_BLOCKS_OTHER_PAYMENT_GROUP_CREATION]:
          'Un paiment est déjà en cours de validation, revenez plus tard pour enregistrer un nouveau paiement.',
      },
    },
  },
  webhook: {
    success: 'Webhook enregistré',
    error: "Impossible d'enregistrer le webhook",
    testSuccess: 'Url correcte',
    testError: "Veuillez vérifier l'url",
  },
  login: {
    passwordChangedSuccess: 'Mot de passe modifié avec succès !',
  },
  booking: {
    register: {
      success: 'Réservation enregistrée',
    },
    delete: {
      error: 'Vous ne pouvez pas annuler une séance qui a déjà commencée.',
    },
  },
  order: {
    success: 'Votre paiement a bien été enregistré',
  },
  communication: {
    success: "Mail en cours d'envoi",
    error: "Problème lors de l'envoi du mail",
  },
  communicationv2: {
    success: "Communication en cours d'envoi",
    error: "Problème lors de l'envoi de la communication",
  },
  privateBooking: {
    register: {
      warning: {
        [PRIVATE_SLOT_ALREADY_BOOKED]: 'Vous avez déjà réservé ce créneau',
      },
      error: 'Impossible de réserver sur cette date',
    },
    attachCoach: {
      success: 'RDV attribué au professeur',
      error: "Impossible d'attribuer au professeur",
    },
    updateCoach: {
      success: 'Le professeur a été modifié',
      error: 'Impossible de modifier le professeur',
    },
    restore: {
      success: 'Le rendez-vous a été restauré',
      error:
        "Impossible de restaurer le rendez-vous, il n'y a pas assez de crédits sur cette carte de rendez-vous.",
    },
  },
  privateConsumerPass: {
    creditUpdate: {
      success: 'Crédits mis à jour',
      error: "Impossible d'enregistrer le crédit",
    },
    nonCompatible: {
      error:
        'Une erreur est survenue lors du chargement des passes non compatibles',
    },
    incompatibilitiesReasons: {
      error:
        "Une erreur est survenue lors du chargement des raisons d'incompatibilités du pass",
    },
  },
  consumerPass: {
    success: 'Votre achat a bien été enregistré !',
  },
  bookerModule: {
    pass: {
      changed: 'La carte de cours pour réserver a du être modifiée',
      nothingAvailable:
        'Aucun pass ne permet de réserver en même temps ces séances',
    },
  },
  privateRecurrentRule: {
    createOrUpdate: {
      success: 'Rendez-vous récurrent enregistré avec succès',
      error: "Impossible d'enregistrer le rendez-vous récurrent",
      locked: 'Une règle de récurrence existe déjà avec ces paramètres',
    },
    delete: {
      success: 'Rendez-vous récurrent supprimé',
      error: 'Impossible de supprimer le rendez-vous récurrent',
    },
  },
  video: {
    createOrUpdate: {
      success: 'Vidéo enregistrée avec succès',
      error: "Impossible d'enregistrer la vidéo",
    },
    delete: {
      success: 'Vidéo supprimée',
      error: 'Impossible de supprimer la vidéo',
    },
    register: {
      success: 'Vidéo enregistrée dans votre bibliothèque',
      error: "Impossible d'enregister cette vidéo, réessayez dans un moment",
    },
  },
  playlist: {
    createOrUpdate: {
      success: 'Playlist enregistrée avec succès',
      error: "Impossible d'enregistrer la playlist",
    },
    delete: {
      success: 'Playlist supprimée',
      error: 'Impossible de supprimer la playlist',
    },
    video: {
      add: {
        success: 'Vidéo ajoutée à la playlist',
        error: "Impossible d'ajouter la vidéo",
      },
      del: {
        success: 'Vidéo supprimée de la playlist',
        error: 'Impossible de supprimer la vidéo de la playlist',
      },
    },
  },
  metaActivity: {
    restore: {
      success: 'Élément restauré',
      error: 'Impossible de restaurer cet élément',
    },
    del: {
      success: 'Élément supprimé',
      error: 'Impossible de supprimer cet élément',
    },
  },
  privatePass: {
    restore: {
      success: 'Carte de RDV restaurée',
      error: 'Impossible de restaurer cette carte de RDV',
    },
    del: {
      success: 'Carte de RDV supprimée',
      error: 'Impossible de supprimer cette carte de RDV',
    },
  },
  bookingNotification: {
    createOrUpdate: {
      success: 'Notification enregistrée avec succès',
      error: "Impossible d'enregistrer la notification",
    },
    delete: {
      success: 'Notification supprimée',
      error: 'Impossible de supprimer la notification',
    },
  },
  background: {
    pending: 'Traitement en cours, veuillez patienter',
    success: 'Terminé',
    error: 'Une erreur est survenue, réessayez plus tard',
    timeout:
      'Le serveur a mis trop longtemps à répondre. Essayez de rafraîchir la page',
    cannotFetch:
      'Une erreur est survenue. Vérifiez votre connexion et essayez de rafraîchir la page',
  },
  subscriptionScheduledStop: {
    create: {
      success: 'Arrêt de la souscription programmé',
      error: "Impossible de programmer l'arrêt de la souscription",
    },
    delete: {
      success: "L'arrêt programmé de la souscription a été supprimé",
      error: "Impossible de supprimer l'arrêt programmé de la souscription",
    },
  },
  dashboard: {
    save: {
      success: 'Les modifications ont été enregistrées',
      error: "Impossible d'enregistrer les modifications",
    },
  },
  contractPause: {
    create: {
      error:
        'Impossible de mettre en pause pour le moment, veuillez réessayer plus tard',
    },
    delete: {
      error: 'Impossible de supprimer la pause pour le moment.',
    },
    updateName: {
      success: 'Le nom de la pause a bien été modifié',
      error: "Le nom de la pause n'a pas pu être modifié",
    },
  },
  signup: {
    emailAlreadyExists: 'Cet email est déjà utilisé',
    failedCreation:
      "Impossible de créer votre compte pour le moment, veuillez réessayer d'ici quelques minutes",
    changeWorkspaceError:
      'Une erreur est survenue dans le changement de compte',
  },
  customForm: {
    update: {
      success: 'Formulaire modifié',
      error: 'Impossible de modifier le formulaire',
    },
    create: {
      success: 'Formulaire créé',
      error: 'Impossible de créer la formulaire',
    },
    duplicate: {
      success: 'Formulaire dupliqué',
      error: 'Impossible de dupliquer le formulaire',
    },
    disable: {
      success: 'Formulaire archivé',
      error: "Impossible d'archiver le formulaire",
    },
    restore: {
      success: 'Formulaire restauré',
      error: 'Impossible de restaurer le formulaire',
    },
    customFormField: {
      disable: {
        success: 'Elément  archivé',
        error: "Impossible d'archiver l'élément",
      },
      restore: {
        success: 'Element restauré',
        error: "Impossible de restaurer l'élément",
      },
    },
    upsert: {
      errors: {
        84006:
          "Vous devez définir une décharge de responsabilité dans Paramètres > Général pour pourvoir ajouter la question 'Décharge de responsabilité'.",
      },
    },
    signupViaCustomForm: {
      success: 'Inscription validée',
      error: "Erreur lors de l'inscription, veuillez réessayer",
      errors: {
        [ERROR_CUSTOM_FORM_ANSWER_IS_MANDATORY]:
          "Des champs obligatoires n'ont pas été remplis",
        [ERROR_CUSTOM_FORM_ANSWER_SIGN_UP_EMAIL_ALREADY_EXISTS]:
          'Cet email est déjà utilisé',
        [ERROR_CUSTOM_FORM_ANSWER_SIGN_UP_GENDER_IS_INVALID]:
          "Le sexe spécifié n'est pas valide",
        [ERROR_CUSTOM_FORM_ANSWER_SIGN_UP_PHONE_NUMBER_IS_INVALID]:
          "Le numéro de téléphone n'est pas valide",
      },
    },
    customFormStepper: {
      error: "Impossible d'enregistrer les réponses.",
    },
  },
  customFormDisplayRule: {
    create: {
      success: 'Règle de notification créée',
      error: 'Impossible de créer la règle de notificaiton',
    },
    update: {
      success: 'Règle de notification modifiée',
      error: 'Impossible de modifier la règle de notification',
    },
    delete: {
      success: 'Règle de notification supprimée',
      error: 'Impossible de supprimer la règle de notification',
    },
    customError: {
      3: "Impossible de créer une règle avec le même temps d'apparition",
    },
  },
  platformBilling: {
    payNowInvoice: {
      success: 'Paiement réussi',
      error: 'Paiement refusé',
    },
  },
  quickbooks: {
    create: {
      success: 'Votre compte Quickbooks est maintenant authentifié',
      error: 'Impossible de connecter votre compte quickbooks',
    },
    revoke: {
      success: 'Votre compte Quickbooks est déconnecté',
      error: 'Impossible de déonnecter votre compte Quickbooks',
    },
  },
  clientSecret: {
    errors: {
      [PENDING_PAYMENT_INTENT_OF_PAYMENT_GROUP_BLOCKS_OTHER_PAYMENT_GROUP_CREATION]:
        'Un paiment est déjà en cours de validation, revenez plus tard pour enregistrer un nouveau paiement.',
    },
  },
  companyTheme: {
    provincialTax: {
      success: 'Taxe provinciale enregistrée',
      error: "Erreur d'enregistrement de la tax provinciale",
      customError: {
        80001: "La taxe provinciale n'est pas disponible dans votre pays",
      },
    },
    update: {
      success: 'Modifications enregistrées',
      error: 'Impossible de sauvegarder les modifications',
    },
  },

  clockIn: {
    errors: {
      96002: 'Impossible, cet utilisateur a déjà un pointage en cours',
    },
  },
  plannedPayment: {
    registerNow: {
      success: 'Paiement enregistré',
      error: "Impossible d'enregistrer le paiement",
    },
  },
  marketplace: {
    update: {
      error:
        'Une erreur est survenue. Veuillez vérifier les paramètres demandés.',
      stripeTerminal: {
        deleteReader: {
          success: 'Terminal de paiement supprimé',
          error: 'Impossible de supprimer ce terminal de paiement',
        },
      },
    },
  },
  replacement: {
    disciplineGroup: {
      create: {
        success: 'Groupe de disciplines créé',
        error:
          'Une erreur est survenue lors de la création du groupe de disciplines',
      },
      update: {
        success: 'Groupe de disciplines modifié',
        error:
          'Une erreur est survenue lors de la modification du groupe de disciplines',
      },
      delete: {
        success: 'Groupe de disciplines supprimé',
        error: 'Impossible de supprimer ce groupe de disciplines',
      },
    },
    assignDisciplineGroup: {
      success: 'Le groupe de disciplines du professeur a été mis à jour',
    },
    updateCoachReplacementPreferences: {
      success: 'Règles sauvegardées',
      error: 'Impossible de sauvegarder les règles',
    },
    cancelReplacementRequest: {
      success: 'La demande de remplacement a été supprimée.',
      error: 'Une erreur est survenue lors de la suppression de la demande.',
    },
    errors: {
      [REPLACEMENT_REQUEST_COACH_HAS_REACHED_MAX_NB_LATE_REQUEST]:
        "Impossible de créer ces demandes de remplacement: vous n'avez pas assez de demandes en retard restantes.",
      [REPLACEMENT_REQUEST_CANNOT_POSTPONE_CLOSING_DATE_AFTER_OFFER_DATE_START]:
        'La date de clotûre ne peut pas être déplacée après la date de la séance.',
      [REPLACEMENT_REQUEST_CANNOT_BE_REFUSED_IF_TEACHER_ALREADY_FOUND]:
        'Vous en pouvez pas refuser cette demande car un professeur a déjà été attribué.',
      [REPLACEMENT_REQUEST_CANNOT_BE_CANCELLED_IF_TEACHER_ALREADY_FOUND]:
        'Vous en pouvez pas annuler cette demande car un professeur a déjà été attribué.',
      [REPLACEMENT_REQUEST_CANNOT_ATTRIBUTE_TEACHER_IF_TEACHER_ALREADY_FOUND]:
        'Un professeur a déjà été attribué pour cette demande.',
      [REPLACEMENT_REQUEST_CANNOT_ATTRIBUTE_TEACHER_IF_ANSWERED_NO]:
        "Ce professeur a répondu qu'il ne souhaitait pas être remplaçant sur cette séance.",
      [REPLACEMENT_REQUEST_COACH_ANSWER_CANT_BE_CREATED_IF_REQUEST_IS_CLOSED]:
        'Vous ne pouvez plus répondre à cette demande de remplacement.',
      [REPLACEMENT_REQUEST_COACH_ANSWER_COACH_CANT_ANSWER_ON_HIS_OWN_REPLACEMENT_REQUEST]:
        'Vous ne pouvez pas répondre à votre propre demande de remplacement',
      [REPLACEMENT_REQUEST_DATES_EXCEPTION]:
        "La valeur 'Nombre de jours demande en retard' doit être supérieure à la valeur 'Nombre de jours clôture des inscriptions.",
      [REPLACEMENT_REQUEST_LIMITATION_EXCEPTION]:
        'Paramètres manquants pour les limites de demandes en retard.',
      [CANNOT_REQUEST_REPLACEMENT_OFFER_NOT_AVAILABLE]:
        'Cette séance est déjà passée',
      [CANNOT_REQUEST_REPLACEMENT_ALREADY_REQUESTED]:
        'Une demande de remplacement existe déjà',
      [CANNOT_REQUEST_REPLACEMENT_COACH_OVERRIDE]:
        'Vous êtes déjà remplaçant sur cette séance',
      [REPLACEMENT_REQUEST_CANNOT_BE_CANCELLED_IF_MANAGER_REFUSED]:
        'Cette demande de remplacement a été refusée: impossible de la supprimer',
    },
  },
  accessDenied: {
    general: {
      title: 'Accès refusé',
      message: "Vous ne pouvez pas accéder à l'espace demandé",
    },
  },
  communicationProviderSettings: {
    update: {
      success: 'Modifications enregistrées',
      error: 'Impossible de sauvegarder les modifications',
    },
  },
};
