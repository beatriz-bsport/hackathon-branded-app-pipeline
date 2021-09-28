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
} = require('@bsport/common/lib/master-data/buyable-item-can-not-be-bought');

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
    linkByEmail: {
      success: 'Professeur lié avec succès',
    },
    error: 'Impossible de sauvegarder le professeur',
    error_email_exists:
      'Un professeur avec cet email existe déjà, utilisez le formulaire de création Professeur',
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
        error: 'Impossible de partager cette carte',
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
        error: 'Impossible de partager cette carte RDV',
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
        success: 'Categorie modifée avec succès',
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
    attachToBasket: {
      error: 'Aucun code promo compatible trouvé',
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
      success: 'Méthode de paiement modifiée',
      error: 'Impossible de modifier la carte de cours',
    },
    freeze: {
      success: 'Souscription mise en pause',
      locked:
        'Impossible de mettre en pause pour le moment, un paiement est-il en attente ?',
      error: 'Impossible de mettre en pause cette souscription',
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
  },
  order: {
    success: 'Votre paiement a bien été enregistré',
  },
  communication: {
    success: "Mail en cours d'envoi",
    error: "Problème lors de l'envoi du mail",
  },
  privateBooking: {
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
};
