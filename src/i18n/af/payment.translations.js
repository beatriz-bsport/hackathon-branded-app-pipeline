const {
  BACS_DEBIT,
  CB,
  CB_MANUAL,
  CHECK,
  HOLIDAY_CHECK,
  CASH,
  EVENT_BRITE,
  AMEX,
  BANK_TRANSFER,
  CREDIT_ACCOUNT,
  DISPUTE,
  SUBSCRIPTION_CB,
  SEPA,
  BANCONTACT,
  OTHER,
  GIROPAY,
  EPS,
  IDEAL,
  SOFORT,
  PAYMENT_PACK,
} = require('@bsport/common/lib/master-data/payment-methods');
const {
  PAYOUT_STATUS_PENDING,
  PAYOUT_STATUS_CANCELED,
  PAYOUT_STATUS_FAILED,
  PAYOUT_STATUS_SUCCESS,
  PAYOUT_STATUS_TRANSIT,
} = require('@bsport/common/lib/master-data/payout-status');
const {
  DISPUTE_STATUS_WON,
  DISPUTE_STATUS_LOST,
  DISPUTE_STATUS_PENDING,
} = require('@bsport/common/lib/master-data/dispute-status');

exports.default = {
  disputeStatus: {
    [DISPUTE_STATUS_WON]: 'Litige résolu',
    [DISPUTE_STATUS_LOST]: 'Litige perdu',
    [DISPUTE_STATUS_PENDING]: 'Litige en cours de traitement',
  },
  interval: {
    month: 'mois',
    month_plural: 'mois',
    year: 'année',
    year_plural: 'années',
    day: 'jour',
    day_plural: 'jours',
    week: 'semaine',
    week_plural: 'semaines',
  },
  instalment: {
    form: {
      title: {
        scheduler: 'Échéancier',
        payment: 'Moyen de paiement',
      },
      actions: {
        submit: 'Confirmer',
        next: 'Suivant',
        previous: 'Précédent',
        close: 'Fermer',
      },
      nb_interval: {
        label: 'Nombre de facturation(s)',
      },
      anchor_date: {
        label: 'Premier encaissement',
        helperText: 'Le paiement sera encaissé durant la matinée',
      },
      interval: {
        label: 'Récurrence',
        helperText: 'Fréquence de génération des factures / cartes',
      },
      recurrence: {
        section: 'Récurrence',
        explain:
          'Le paiement sera étalé sur {{ total_interval_duration }} {{ interval }} tous les {{ recurrence_basis }} {{ interval }} et génèrera {{ nb_interval }} encaissements',
      },
      recurrence_basis: {
        label: 'Répéter tous les',
        helperText: '',
        intervalName: {
          year: 'an',
          year_plural: 'ans',
          month: 'mois',
          month_plural: 'mois',
          day: 'jour',
          day_plural: 'jours',
          week: 'semaine',
          week_plural: 'semaines',
        },
      },
    },
  },
  payment: {
    return: 'Rembourser',
  },
  explainOption: "Vous serez prévenu par email lorsqu'une place se libèrera",
  bookAnotherOption: "Me réinscrire sur liste d'attente",
  bookAnOption: "M'inscrire sur liste d'attente",
  availablePaymentPacks: 'Pass compatibles : ',
  goBack: 'Précédent',
  hasOneOrMoreOption: "Vous êtes déjà inscrit sur la liste d'attente",
  paymentNote: {
    label: 'Note',
    helperText: "(optionnel) numéro du chèque, date d'encaissement...",
  },

  creditAccountBalance: {
    current: 'Acompte actuel',
  },

  paymentComboSectionTitle: 'Pack',
  method: {
    BACS_DEBIT: 'Bacs Direct Debit',
    CB: 'Carte',
    CREDIT_ACCOUNT: 'Crédit client',
    CASH: 'Espèces',
    CHECK: 'Chèque',
    SEPA: 'SEPA',
    BANCONTACT: 'Bancontact',
    SOFORT: 'Sofort',
    IDEAL: 'iDEAL',
    EPS: 'EPS',
    GIROPAY: 'Giropay',
    [BACS_DEBIT.id]: 'Bacs Direct Debit',
    [CB.id]: 'Carte',
    [CB_MANUAL.id]: 'Carte (manuel)',
    [CREDIT_ACCOUNT.id]: 'Crédit client',
    [HOLIDAY_CHECK.id]: 'Chèque vacances',
    [AMEX.id]: 'AMEX',
    [BANK_TRANSFER.id]: 'Virement',
    [SUBSCRIPTION_CB.id]: 'Paiement automatique',
    [CASH.id]: 'Espèces',
    [CHECK.id]: 'Chèque',
    [SEPA.id]: 'SEPA',
    [EVENT_BRITE.id]: 'Event brite',
    [BANCONTACT.id]: 'Bancontact',
    [SOFORT.id]: 'Sofort',
    [IDEAL.id]: 'iDEAL',
    [EPS.id]: 'EPS',
    [GIROPAY.id]: 'Giropay',
    [PAYMENT_PACK.id]: 'Pass',
    [OTHER.id]: 'Other',
    [DISPUTE.id]: 'Dispute',
  },

  forms: {
    cancelPayment: 'Précédent',
    savePaymentMethod: {
      label: 'Sauvegarder ce moyen de paiement',
      section: 'Sélectionner une méthode de paiement',
    },
    credit: {
      explain:
        'Votre club sera informé du débit, vous règlerez cette commande sur place',
      pay: 'Confirmer',
    },
    paymentIntent: {
      pay: 'Payer',
    },
    paymentMethod: {
      message: {
        success: 'Moyen de paiement sauvegardé avec succès !',
        error: "Impossible d'enregistrer cette méthode de paiement",
      },
      collect: {
        title: 'Ajouter un moyen de paiement',
        contentAdd: 'Ce moyen de paiement sera sauvegardé dans votre compte.',
        content:
          'Ce moyen de paiement sera sauvegardé dans votre compte pour être facturé conformément au contrat.',
      },
      actions: {
        close: 'Fermer',
        collect: 'Sauvegarder',
        retry: 'Réessayer',
        addPaymentMethod: 'Ajouter une méthode de paiement',
        selectPaymentMethod: 'Sélectionner votre moyen de paiement',
        displayPaymentMethod: 'Afficher mes méthodes de paiement',
      },
      mandateRevalidated: {
        collect: 'Accepter',
        content: 'Le mandat de prélèvement sera revalidé avec la banque.',
        success:
          'Le mandat a bien été renouvelé, les prochains prélèvements seront effectués avec succès.',
        error:
          'Impossible de renouveler le mandat de prélèvement, veuillez contacter votre banque.',
        retry: 'Réessayer',
      },
    },
  },
  generalTermsAndConditions: {
    iAccept: "J'accepte les ",
    theTermsAndConditions: 'conditions générales de vente.',
    generalTermsOfUse: " conditions générales d'utilisation",
    waiver: 'décharge de responsabilité',
    close: 'Fermer',
  },
  returnedAmount: 'Remboursé: ',
  paymentMethod: {
    label: 'Moyen de paiement',
    [BACS_DEBIT.id]: 'Bacs Direct Debit',
    [CB.id]: 'Carte',
    [CB_MANUAL.id]: 'Carte (manuel)',
    [CHECK.id]: 'Chèque',
    [HOLIDAY_CHECK.id]: 'Chèque vacances',
    [CASH.id]: 'Espèces',
    [EVENT_BRITE.id]: 'EventBrite',
    [AMEX.id]: 'AMEX',
    [DISPUTE.id]: 'Litige',
    [BANK_TRANSFER.id]: 'Virement',
    [CREDIT_ACCOUNT.id]: 'Compte interne (crédit)',
    [SUBSCRIPTION_CB.id]: 'Paiement automatique',
    [OTHER.id]: 'Divers',
    [SEPA.id]: 'SEPA',
    [BANCONTACT.id]: 'Bancontact',
    [GIROPAY.id]: 'Giropay',
    [EPS.id]: 'EPS',
    [IDEAL.id]: 'iDEAL',
    [SOFORT.id]: 'Sofort',
    disputeWon: 'Résolu',
  },
  actions: {
    addThisPaymentItem: 'Ajouter ce moyen de paiement',
  },
  bankAccount: {
    form: {
      title: 'Compte bancaire',
      content:
        'Ce compte bancaire sera utilisé pour vous transférer les montants payés en ligne via bsport.',
      accountHolderName: {
        label: 'Titulaire du compte bancaire',
        placeholder: 'Jacques Chirac',
      },
      routingNumber: {
        label: 'Numéro de routage',
        placeholder: '000001',
      },
      sortCode: {
        label: 'Code de tri',
        placeholder: '123456',
      },
      invalid:
        "IBAN invalide. Attention : l'IBAN doit correspondre à un compte bancaire domicilié dans le même pays que votre entreprise",
      accountNumber: {
        label: 'Numéro de compte',
        placeholder: 'FR89370400440532013000',
      },
      bankCode: { label: 'Bank code' },
      institutionNumber: {
        label: 'Institution number',
        placeholder: 'Institution number',
      },
      transitNumber: { label: 'Transit number', placeholder: 'Transit number' },
      branchCode: { label: 'Branch code' },
      clearingCode: { label: 'Clearing code' },
      unknownCountry:
        'Opération manuelle pour ce pays, veuillez contacter bsport via contact@bsport.io',
      actions: {
        cancel: 'Annuler',
        submit: 'Confirmer',
      },
    },
  },
  payout: {
    title: 'Mes encaissements',
    status: {
      [PAYOUT_STATUS_PENDING]: 'En attente',
      [PAYOUT_STATUS_CANCELED]: 'Annulé',
      [PAYOUT_STATUS_FAILED]: 'Echoué',
      [PAYOUT_STATUS_SUCCESS]: 'Réussi',
      [PAYOUT_STATUS_TRANSIT]: 'En cours de traitement',
    },
    paymentNb: '{{nb}} paiements',
    seeMore: 'Voir plus',
    invoice: 'Facture {{ uuid }}',
    isEmpty: 'Aucun encaissement.',
    isEmptyWarning:
      'NB: certains encaissements avant le 15 Mars 2021 peuvent ne pas être listés ci-dessous.',
    payoutIsIncludedInOther:
      "Ce virement a été inclus dans celui du {{date}} portant l'identifiant {{readable_identifier}}",
    payoutAmountFromIncludedPayouts:
      'dont {{price}} provenant de payouts précédents',
    payoutIsManual:
      "Ce virement a été enclenché manuellement par les équipes de bsport pour accélérer la réception de vos fonds. Dans ce cas le détail des paiements n'est pas disponible. Veuillez vous rapprocher de nos équipes si vous souhaitez plus d'informations.",
  },
  stripeBalance: {
    title: 'Solde Stripe',
    dialog: {
      firstPart: `Chez bsport nous utilisons le service Stripe pour gérer l'ensemble de vos paiements en ligne. Les montants de ceux-ci sont conservés sur Stripe puis reversés sur votre compte (section "Mes encaissements").`,
      secondPart:
        'Votre "solde disponible" correspond donc au montant des paiements en ligne qui ne vous a pas encore été versé.',
      thirdPart:
        'Votre "solde en cours de traitement" correspond au montant qui va arriver sur votre solde disponible.',
      alert:
        'A noter que quand vous effectuez un remboursement direct, cet argent est directement prélevé sur votre compte Stripe. Ce qui peut le faire passer en négatif.',
      close: 'Fermer',
    },
    nullPendingBalanceText: 'Aucun',
    availableBalance: 'Solde disponible',
    pendingBalance: 'Solde en cours de traitement',
  },
  subscriptionPaymentDialog: {
    title: 'Acheter un abonnement',
    success: {
      recap: 'Récapitulatif',
      contract: 'Mon contract',
      title: 'Félicitations !',
      text_content:
        'Votre achat a bien été pris en compte, vous pouvez dès maintenant retrouver les détails de votre abonnement sur votre espace membre.',
      text_content_funnel:
        'Votre achat a bien été pris en compte, cliquez sur continuer pour finaliser votre réservation. La carte liée à votre abonnement a été ajoutée dans la section "Mes cartes de cours", sélectionnez la pour effectuer votre réservation.',
      text_status: 'Achat réalisé avec succès !',
      button_text: 'Continuer',
    },
    error: {
      title: 'Erreur lors du paiement',
      userSpace: 'Espace membre',
      text_content:
        'Votre achat n’a pas pu être effectué, vous pouvez réessayer ou revenir à votre espace membre.',
      text_status: 'Votre achat n’a pas pu aboutir !',
      button_text: 'Réessayer',
    },
  },
};
