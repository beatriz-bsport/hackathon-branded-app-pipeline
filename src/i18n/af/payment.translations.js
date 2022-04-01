const {
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
} = require('@bsport/common/lib/master-data/payment-methods');
const {
  PAYOUT_STATUS_PENDING,
  PAYOUT_STATUS_CANCELED,
  PAYOUT_STATUS_FAILED,
  PAYOUT_STATUS_SUCCESS,
  PAYOUT_STATUS_TRANSIT,
} = require('@bsport/common/lib/master-data/payout-status');

exports.default = {
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
    CB: 'Carte',
    CREDIT_ACCOUNT: 'Paiement sur place',
    CASH: 'Espèces',
    CHECK: 'Chèque',
    SEPA: 'SEPA',
    BANCONTACT: 'Bancontact',
    SOFORT: 'Sofort',
    IDEAL: 'iDEAL',
    EPS: 'EPS',
    GIROPAY: 'Giropay',
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
        success: 'Méthode de paiement sauvegardée avec succès !',
        error: "Impossible d'enregistrer cette méthode de paiement",
      },
      collect: {
        title: 'Ajouter un moyen de paiement',
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
      invalid:
        "IBAN invalide. Attention : l'IBAN doit correspondre à un compte bancaire domicilié dans le même pays que votre entreprise",
      accountNumber: {
        label: 'Numéro de compte',
        placeholder: 'FR89370400440532013000',
      },
      bankCode: { label: 'Bank code' },
      institutionNumber: { label: 'Institution number' },
      transitNumber: { label: 'Transit number' },
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
  },
  subscriptionPaymentDialog: {
    title: 'Acheter un abonnement',
    success: {
      text_content:
        'Votre achat a bien été pris en compte, vous pouvez dès maintenant retrouver les détails de votre abonnement sur votre espace membre.',
      text_status: 'Achat réalisé avec succès !',
      button_text: 'Continuer',
    },
    error: {
      text_content:
        'Votre achat n’a pas pu être effectué, vous pouvez réessayer en cliquant sur le bouton ci-dessous ou vous pouvez revenir à la liste des abonnements en fermant cette fenêtre.',
      text_status: 'Votre achat n’a pas pu aboutir !',
      button_text: 'Réessayer',
    },
  },
};
