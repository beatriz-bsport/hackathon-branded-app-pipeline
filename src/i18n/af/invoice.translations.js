const PLANNED_INVOICE_STATUS = require('@bsport/common/lib/master-data/planned-invoice-status');

const {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_GIFTCARD,
  BUYABLE_ITEM_CREDIT,
} = require('@bsport/common/lib/master-data/buyable-items');
const {
  INVOICE_TYPE_MIGRATION,
  INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER,
} = require('@bsport/common/lib/master-data/invoice-type');
const {
  SOURCE_APP,
  SOURCE_WEB,
  SOURCE_SAAS,
  SOURCE_OTHER,
} = require('@bsport/common/lib/master-data/source-device');
const {
  PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CASH,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CHECK,
  PAYMENT_GROUP_METHOD_IDENTIFIER_HOLIDAY_CHECK,
  PAYMENT_GROUP_METHOD_IDENTIFIER_AMEX,
  PAYMENT_GROUP_METHOD_IDENTIFIER_DISPUTE,
  PAYMENT_GROUP_METHOD_IDENTIFIER_TRANSFER,
  PAYMENT_GROUP_METHOD_IDENTIFIER_OTHER,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA,
  PAYMENT_GROUP_METHOD_IDENTIFIER_CB_MANUAL,
  PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL,
  PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT,
  PAYMENT_GROUP_METHOD_IDENTIFIER_EPS,
  PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY,
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_ENGINE_BSPORT,
  REVERSE_ON_PAYMENT_METHOD,
  REVERSE_ON_DEBT,
  REVERSE_ON_NEW_PAYMENT_METHOD,
} = require('@bsport/common/lib/master-data/payment-group');

exports.default = {
  paymentGroup: {
    validateRequiresAction: 'Confirmer le moyen de paiement',
    requiresAction: "La banque n'a pas authentifié le paiement (3DSecure)",
  },
  invoiceInfo: {
    [INVOICE_TYPE_MIGRATION]:
      "Cette facture est issue d'une migration. Nous ne sommes pas en mesure de fournir un PDF ni de l'annuler pour des raisons légales.",
    [INVOICE_TYPE_EMPTY_PAYMENT_CONTAINER]:
      "Ce reçu de paiement représente l'ajustement de solde de votre membre.",
  },
  invoiceType: {
    regular: 'Facture',
    migration: 'Migration',
    credit_payment: 'Reçu (régul. solde)',
    return: 'Facture de retour',
    reversed: 'Facture (annulée)',
  },
  creditAccountBalance: { current: 'Solde actuel' },
  mandate: {
    name: 'Nom et prénom du titulaire',
    email: 'Email du titulaire',
    address_line_1: 'Adresse',
    address_line_2: "Complément d'adresse",
    address_postal_code: 'Code postal',
    phone: 'Numéro de téléphone',
    city: 'Ville',
    state: 'État',
    country: 'Pays',
    contentIban:
      "En donnant votre IBAN et en confirmant votre paiement, vous autorisez bsport et Stripe, notre système de paiement, à envoyer les instructions de débit à votre banque en accord avec l'échéancier de paiement. Vous pouvez demander un remboursement à votre banque selon les termes de votre contrat avec cette dernière. Un remboursement doit être demandé dans les 8 semaines après le premier débit.",
    contentBacsDebit:
      "En donnant vos informations bancaires et en confirmant votre paiement, vous autorisez bsport et Stripe, notre système de paiement, à envoyer les instructions de débit à votre banque en accord avec l'échéancier de paiement. Vous pouvez demander un remboursement à votre banque selon les termes de votre contrat avec cette dernière. Vous pouvez à n'importe quel moment faire la demande auprès de votre banque pour annuler le mandat Direct Debit.",
  },
  invoice: {
    title: 'Facture {{ uuid }}',
    titleRevert: 'Avoir {{ uuid }}',
    titleReverted: 'Facture (annulée) {{ uuid }}',
    titleReceipt: 'Reçu {{ uuid }}',
    editor: {
      title: 'Edition de la facture',
      sumup: 'Récapitulatif',
      save: 'Émettre la facture',
    },
    header: {
      date: 'Date : {{ date }}',
      author: 'Créé par : {{ name }}',
      clientAuthor: 'Client',
      sourceInvoice: 'Annule la facture',
      noEstablishment: 'Aucun Établissement',
      reverseInvoice: 'Remboursé via ',
      source: {
        label: 'Canal : {{ source }}',
        [SOURCE_APP]: 'App',
        [SOURCE_WEB]: 'Web',
        [SOURCE_SAAS]: 'Backoffice',
        [SOURCE_OTHER]: 'Autre',
      },
    },
  },
  anonymousMember: 'Membre anonyme',
  paymentEngine: {
    label: {
      [PAYMENT_ENGINE_STRIPE]: 'Paiement en ligne',
      [PAYMENT_ENGINE_BSPORT]: 'Paiement manuel',
    },
  },
  paymentMethod: {
    title: 'Moyen de paiement',
    inconsistent:
      "Moyen de paiement dé-autorisé, veuillez le reconfigurer. Le client peut avoir demandé à désautoriser son moyen de paiement, ou vous avez fusionné deux membres, dans les deux cas le moyen de paiement n'est plus utilisable.",
    edit: 'Modifier',
    add: 'Ajouter',
    copyLink: "Copier le lien d'ajout d'un moyen de paiement",
    addPaymentMethod: 'Ajouter un moyen de paiement',
    none: 'Aucun moyen de paiement sauvergardé',
    isInternalExplain:
      'Acompte client (manuel): tous les mois une dette est automatiquement créée dans le compte du membre.',
    isInternalExplainFuturePayments:
      "L'échéance sera prélevée automatiquement sur l'acompte client. Si celui-ci n'est pas suffisant, un acompte négatif sera créé.",
    select: {
      label: 'Moyen de paiement',
    },
    label: {
      [PAYMENT_GROUP_METHOD_IDENTIFIER_BACS_DEBIT]: 'Bacs Direct Debit',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_CB]: 'Carte',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_CB_MANUAL]: 'Carte (manuel)',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_CHECK]: 'Chèque',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_HOLIDAY_CHECK]: 'Chèque vacances',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_CASH]: 'Espèces',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_AMEX]: 'AMEX',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_DEBT]: 'Acompte client (dette)',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_DISPUTE]: 'Litige',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_TRANSFER]: 'Virement',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_OTHER]: 'Divers',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_SEPA]: 'SEPA',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_BANCONTACT]: 'Bancontact',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_IDEAL]: 'iDEAL',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_SOFORT]: 'Sofort',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_EPS]: 'EPS',
      [PAYMENT_GROUP_METHOD_IDENTIFIER_GIROPAY]: 'Giropay',
    },
    manual: 'Manuel',
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
  plannedPaymentEvent: {
    actions: {
      registerNow: 'Encaisser maintenant',
      disable: 'Déprogrammer',
      enable: 'Reprogrammer',
      edit: 'Modifier',
      changeMethod: 'Modifier la méthode de paiement',
      solveInvalidPaymentAttempt: 'Régulariser',
    },
    nextRetryDate: 'Le paiement sera retenté le {{ d }}',
    lockedToday:
      "Le paiement est prévu aujourd'hui, vous ne pouvez plus le modifier",
    registerNowInitialData: 'Paiement initialement prévu le {{-date}}',
    unrecoverableError: 'Erreur lors du paiement.',
    dialog: {
      invalidMandate: {
        title: 'Mandat de prélèvement expiré ou invalide!',
        explainSituation:
          "Le mandat associé à cette méthode de paiement a expiré. Cela peut être dû à de multiples raisons, un nombre de paiements en échec trop élevé, une décision unilatérale de la banque, etc. La méthode de paiement n'est désormais plus utilisable il va vous falloir en enregistrer une nouvelle",
        cancel: 'Annuler',
        confirm: 'Suivant',
      },
    },
  },
  paymentPanel: {
    amountRemaining: 'Reste à payer: {{ amount }}',
    errorSecretExplain1: 'Ce mode de paiement est indisponible pour le moment',
    errorSecretExplain2:
      'Si le problème persiste, contactez dev+payment-intent@bsport.io',
    billingMoreThanNeeded:
      'En encaissant plus que le montant de la facture, le solde du membre sera augmenté de la différence',
    amount: {
      label: 'Montant à encaisser',
    },
    paymentNote: {
      label: 'Note',
      helperText: "(optionnel) numéro du chèque, date d'encaissement...",
    },
    date: {
      label: "Date d'encaissement",
    },
    sumup: {
      title: 'Récapitulatif',
      amountDue: 'Total dû',
      amountPaid: 'Encaissement',
      amountBeingProcessed: 'Montant en cours de traitement',
      amountRemaining: 'Reste à payer',
    },
    actions: {
      bill: 'Encaisser',
      pay: 'Régler cette facture',
      revert: 'Annuler',
      cancel: 'Annuler',
      payAll: 'Régler la dette client',
      confirmPayment: 'Confirmer le paiement',
      showInvoice: 'Voir la facture',
      saveForLater: 'Sauvegarder ce moyen de paiement',
      saveForLaterAsSEPA: 'Le mandat sera enregistré en tant que "SEPA"',
      paymentSecurityInformation:
        'Vous pouvez enregistrer en toute securité votre moyen de paiement pour vos prochains achats, vos données seront chiffrées et stockées en sécurité.',
      billByInstalment: 'Paiement échelonné',
      basketInconsistent:
        "Votre panier a été modifié, veuillez rafraichir votre page avant de valider votre paiement.\n Vous n'avez pas été débité.",
      generatePaymentLink: 'Générer un lien de paiement',
      paymentLink: 'Lien de paiement',
    },
    paymentList: {
      title: 'Paiements',
      titleReverse: 'Remboursement',
      isEmpty: 'Aucun paiement',
    },
    plannedPaymentEvent: {
      title: 'Paiement planifié',
      title_plural: 'Paiements planifiés',
    },
    fields: {
      accountHolderName: {
        label: 'Titulaire du compte',
        placeholder: 'Marie Dupont',
      },
      email: {
        label: 'Email du titulaire du compte',
        placeholder: 'marie@dupont.fr',
      },
      country: {
        label: 'Pays du compte bancaire',
        placeholder: 'France',
      },
    },
  },
  invoiceInfoDialog: {
    explain:
      "Un ou plusieurs paiements ne sont pas passés correctement, l'acompte du membre reflète l'echec du paiement",
    actions: {
      show: 'Voir la facture',
      close: 'Fermer',
    },
  },
  invoicePaymentPackTagWarningDialog: {
    title: 'Information',
    content:
      'Attention, vous tentez de facturer une carte à un membre qui ne dispose pas des tags nécessaires à son achat. Voulez vous quand même lui facturer cet élément  ? ',
    cancel: 'Annuler',
    confirm: 'Confirmer',
  },
  invoiceFuturePaymentsDialog: {
    applyForAllFuturePayments:
      'Appliquer aux échéances futures de cette facture',
  },
  uneditableMessage: {
    invoiceRevertedThusNotEditable:
      "La facture a été annulée et n'est plus modifiable",
    invoiceFromSubscriptionThusNotEditable:
      "Cette facture fait partie d'une souscription et n'est donc pas éditable, veuillez modifier directement la souscription",
    invoiceFinalizedThusNotEditable:
      "La facture a été finalisée et n'est donc plus modifiable",
  },
  balance: {
    updaterDialog: {
      title: 'Ajustement de solde',
      typeLabel: "Type d'ajustement",
      balanceValueLabel: 'Montant',
      withoutPaymentNote: {
        label: 'Ne pas générer de reçu',
        warning:
          'Attention: nous ne garderons aucune trace de cette opération. À utiliser uniquement pour des ajustements exceptionnels.',
      },
      explainDecaissement:
        'Un décaissement de {{ amount }} {{ currencyDisplay }} sera enregistré.',
      explainTopup:
        'Une augmentation de {{ amount }} {{ currencyDisplay }} sera enregistré au solde du membre.',
      debt: 'Décaissement',
      topup: 'Encaissement',
      actions: {
        submit: 'Suivant',
        cancel: 'Annuler',
      },
    },
  },
  actions: {
    invoiceReverted: 'Facture annulée',
    revert: 'Annuler',
    addFooter: 'Modifier la note de bas de facture',
    goToSubscription: 'Voir la souscription',
    goToPaymentEditor: 'Paiement',
    backToInvoiceItemEditor: 'Achat',
    save: 'Enregistrer',
    addInvoiceItem: 'Ajouter à la facture',
    equilibrate: 'Equilibrer (acompte)',
    download: 'Télécharger la facture',
    downloadReceipt: 'Reçu de paiement',
    explainPdfDraft:
      "La facture est encore à l'état de brouillon, le pdf n'est pas disponible.",
    finalize: 'Finaliser (PDF)',
    consumeBalance: 'Payer via solde',
    addCoupon: 'Ajouter un code promo',
  },
  returnPayment: {
    modal: {
      title: 'Remboursement client',
      content:
        'Le paiement sera reversé sur le compte BANCAIRE du client, un acompte du même montant sera ajoutée à la facture pour symboliser le paiement.',
      cancel: 'Annuler',
      confirm: 'Rembourser',
    },
  },
  configuration: {
    stripe_footer: 'Bas de page facture',
    invoiceGeneral: 'Facture PDF',
    subscription: {
      title: 'Souscription',
      forms: {
        advance_sepa_billing: {
          label:
            "Envoyer l'ordre de virement SEPA 3 jours en avance, pour pallier aux délais du réseau bancaire pouvant provoquer un retard de trésorerie.",
          helperText:
            "Dans la très grande majorité des cas, le client ne reçoit l'information de virement que 3 jours plus tard.",
        },
        revert_bookings_on_fail_subscription_payment: {
          label: 'Annuler les réservations si le paiement échoue.',
          warning:
            'Attention, les réservations ne seront pas recréées si le paiement réussit !',
          helperText:
            'Si le paiement de la souscription échoue ou est déclaré comme litigieux, les réservations réalisées avec ces cartes seront annulées (et le crédit recrédité)',
        },
        disable_pass_on_fail_subscription_payment: {
          label: 'Désactiver les cartes si le paiement échoue.',
          helperText:
            "Si le paiement de la souscription échoue ou est déclaré comme litigieux, les cartes de cours et de RDV de cette facture seront désactivées jusqu'à ce que la facture soit encaissée",
        },
        activateSmartRetries: {
          label: 'Activer Smart Retries sur les échecs de paiement',
          helperText:
            'bsport réessaiera automatiquement les paiements échoués des souscriptions, au meilleur moment.',
        },
        nbRetriesSubscriptionPayments: {
          label: 'Nombres de tentatives après un échec de paiement',
          helperText: 'Entre 0 et 5 tentatives',
        },
      },
    },
    explainStripeFooter:
      'Ce texte apparaitra en bas de vos factures éditées en PDF, ajoutez toute mention légale nécessaire.',
    submit_stripe_footer: 'Mettre à jour',
    forms: {
      stripe_footer_placeholder: 'Aucune mention supplémentaire',
      show_company_email_in_invoice:
        "Afficher l'email de contact de votre entreprise sur les factures",
    },
    nf525: 'Certification',
    nf525Explain:
      'Bsport suit les procédures de mise en conformité NF525, vous pouvez ici télécharger notre attestation officielle.',
    nf525Button: 'Télécharger',
    stripeTerminal: {
      title: 'Paiement par terminal',
      helperText:
        'Utilisez un terminal de paiement pour payer les factures de vos clients depuis le backoffice. Grâce au terminal, gagnez du temps en encaissant vos clients sans avoir à leur demander leurs coordonnées bancaires. Merci de contacter votre chargé de compte pour en savoir plus.',
      addReader: 'Connecter un terminal',
      addCard: 'Ajouter avec le terminal  Stripe',
      deleteDialog: {
        title: 'Suppression',
        content1:
          'Êtes-vous sûr de vouloir supprimer le terminal de paiement {{label}} ?',
        content2:
          "Il n'apparaîtra plus dans les terminaux disponibles lors des paiements.",
        content3: 'Vous pourrez le connecter de nouveau si vous le souhaitez',
      },
      connectDialog: {
        title: {
          connect: 'Connexion',
          success: 'Connexion réussie',
          error: 'Echec de connexion',
          edit: 'Modification',
        },
        mustCreateStripeLocation:
          'Pour votre premier enregistrement, veuillez renseigner les informations du studio dans lequel le terminal sera utilisé.',
        loading1: "Nous tentons d'établir une connexion avec votre terminal.",
        loading2: 'Merci de patienter.',
        form: {
          readerLabel: 'Nom du terminal',
          registrationCode: 'Code du terminal',
          registrationCodeHelperText:
            'Indiquer le code affiché sur votre TPE Stripe',
          connect: 'Connecter',
          continue: 'Continuer',
          retry: 'Réessayer',
          update: 'Modifier',
        },
        success: 'Votre terminal de paiement Stripe a bien été connecté',
        error1: "Votre terminal de paiement Stripe n'a pas été connecté.",
        error2: 'Veuillez réessayer.',
      },
      paymentDialog: {
        radio: 'Terminal de paiement',
        amountToPay: 'Montant à payer',
        connectAndPay: 'Envoyer sur le terminal',
        minAmountInfo:
          "Le paiement par terminal de paiement n'est pas disponible pour un montant inférieur à {{amountString}}.",
        connectionSuccess: {
          payment:
            'La connexion avec le terminal a été effectuée. Le montant à payer devrait être affiché désormais.',
          intent:
            'La connexion avec le terminal a été effectuée. Le client devrait être en mesure de présenter sa carte.',
          processing: 'Votre demande est en cours de traitement',
          cancel: {
            title: 'Annulation',
            cancelExplain1: "Êtes-vous sûr de vouloir annuler l'opération ?",
            cancelExplain2:
              'Vous serez redirigé vers le choix du terminal de paiement.',
            error: "Une erreur est survenue lors de l'annulation.",
          },
        },
        paymentSuccess: {
          title: {
            payment: 'Paiement accepté',
            setupAndPlan: 'Paiement enregistré',
            setupOnly: 'Méthode de paiement enregistrée',
          },
          content: {
            payment: 'Le paiement a bien été pris en compte.',
            wait: 'Encore un petit instant, nous traitons vos données.',
          },
        },
        paymentFailed: {
          interac: {
            title: 'Moyen de paiement incompatible',
            content:
              "Les cartes Interac ne peuvent pas être utilisées pour des paiements récurrents, ni être sauvegardées. Merci d'utiliser un autre moyen de paiement.",
          },
          title: {
            paymentIntent: 'Echec de paiement',
            setupIntent: "Echec de l'opération",
          },
          content: {
            paymentIntent: "Le paiement n'a pas été pris en compte.",
            setupIntent: "La méthode de paiement n'a pas été sauvegardée.",
          },
          explain: {
            label: "Raison de l'échec :",
          },
        },
        disconnect: {
          title: 'Déconnexion',
          content: 'La connexion a été perdue. Veuillez réessayer',
        },
      },
    },
  },
  invoiceItem: {
    buyableItemIdentifier: {
      [BUYABLE_ITEM_PASS]: 'Carte de cours',
      [BUYABLE_ITEM_SHOP_ITEM]: 'Magasin',
      [BUYABLE_ITEM_PRIVATE_PASS]: 'Carte RDV',
      [BUYABLE_ITEM_COMBO_ITEM]: 'Pack',
      [BUYABLE_ITEM_GIFTCARD]: 'carte cadeau',
      [BUYABLE_ITEM_CREDIT]: 'Crédit',
    },
    credit: {
      label: 'Crédit',
    },
    quantity: 'Quantité',
    voucher: 'Réduction: {{ voucher }}',
    discount: 'Réduction',
  },
  section: {
    invoiceItemList: {
      title: 'Achats',
      titleReverse: 'Retour achat',
      isEmpty: 'Aucun achat',
      total: 'Total achat',
      billing_establishment: 'Établissement de facturation',
    },
    paymentList: {
      title: 'Moyens de paiement',
      isEmpty: 'Aucun moyen de paiement enregistré',
      total: 'Total paiement',
    },
  },
  table: {
    actions: {
      goToInvoice: 'Voir la facture',
    },
    header: {
      member: 'Membre',
      id: 'Identifiant',
      date: 'Date de facturation',
      amount: 'Montant dû',
      missing: 'Restant dû',
      invoiceType: 'Type',
      pdf: 'PDF',
      quickbooks: 'QuickBooks',
    },
    nested: {
      invoiceItem: {
        title: 'Achats',
        isEmpty: 'Aucun achat',
        header: {
          product: 'Nom',
          price: 'Montant TTC',
          priceExcTax: 'Montant HT',
          voucher: 'Dont réduction',
        },
      },
      payment: {
        title: 'Paiement',
        isEmpty: 'Aucun paiement',
        header: {
          paymentMethod: 'Méthode de paiement',
          price: 'Montant',
          date: 'Date',
          paymentReceived: 'Statut',
        },
      },
    },
  },
  revert: {
    dialog: {
      actions: {
        cancel: 'Fermer',
        confirm: 'Confirmer',
      },
      title: 'Annulation facture',
    },
    autoDebitDialog: {
      title: 'Solde Stripe insuffisant',
      helper: `Votre studio est actuellement en procédure de clôture de compte Bsport.\n\nEn cliquant sur confirmer, la facture sera bien remboursée. Votre solde Stripe sera prélevé de {{refundAmount}} {{ currencyDisplay }}. Cependant pour remettre votre solde Stripe à 0 {{ currencyDisplay }} vous serez automatiquement débité de la différence directement sur votre compte bancaire indiqué dans Paramètres > Entreprise.\n\nSi vous ne souhaitez pas dépasser vote limite de découvert, vous pouvez attendre que votre solde Stripe remonte.`,
    },
    blockedDialog: {
      title: 'Solde Stripe insuffisant',
      alert:
        'Attention, avec ce remboursement vous allez dépasser la limite de découvert autorisée de {{ refundBlockingLimit }} {{currencyDisplay}}.',
      helper:
        'Votre solde Stripe est insuffisant pour pouvoir procéder au remboursement. Merci de réessayer après quelques jours afin que des paiements soient encaissés.',
    },
    warning: {
      interac:
        'Au moins un paiement a été effectué avec une carte Interac sur cette facture. Les remboursements directs ne sont pas supportés pour les cartes Interac.',
    },
    content: {
      label: {
        [REVERSE_ON_PAYMENT_METHOD]: 'Remboursement direct',
        [REVERSE_ON_DEBT]: 'Remboursement en avoir (solde)',
        [REVERSE_ON_NEW_PAYMENT_METHOD]: 'Remboursement manuel',
      },
      explainEmptyPayment: 'Êtes vous sûr de vouloir annuler cette facture ?',
      explain: {
        [REVERSE_ON_PAYMENT_METHOD]:
          'Les paiements carte / SEPA / etc... seront reversés directement sur le compte du client. Utilisez cette méthode pour opérer un remboursement direct suite à une erreur.',
        [REVERSE_ON_DEBT]:
          "Un avoir sera généré et incrémentera d'autant le solde client. Utilisez cette méthode pour générer un avoir.",
        [REVERSE_ON_NEW_PAYMENT_METHOD]:
          'Choisissez vous-même le moyen de remboursement. Utilisez cette méthode pour un remboursement chèque / virement manuel / espèces.',
      },
    },
  },
  quickbooks: {
    invoice: {
      onQuickbooks: 'Transférée',
      sendToQuickbooks: 'Transférer la facture sur QuickBooks',
    },
    send: {
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
  },
  applyGiftcard: {
    giftcard: 'Carte cadeau',
    form: {
      amountToPay: 'Montant payé en carte cadeau',
      usedGiftcard: 'Carte cadeau utilisée',
      errors: {
        errorAmount: 'Montant invalide.',
      },
    },
    actions: {
      apply: 'Paiement carte cadeau',
      cancel: 'Fermer',
      confirm: 'Valider',
    },
  },
  status: {
    [PLANNED_INVOICE_STATUS.SUCCEEDED.id]: 'Réussi',
    [PLANNED_INVOICE_STATUS.FAILED.id]: 'Echec',
    [PLANNED_INVOICE_STATUS.PENDING.id]: 'En attente',
    [PLANNED_INVOICE_STATUS.PROCESSING.id]: 'En cours',
    [PLANNED_INVOICE_STATUS.CANCELED.id]: 'Annulé',
  },
};
