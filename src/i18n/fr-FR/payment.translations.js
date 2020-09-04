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
  OTHER,
} = require('@bsport/common/lib/master-data/payment-methods');

exports.default = {
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
    CB: 'Carte bleue',
    CREDIT_ACCOUNT: 'Paiement sur place',
  },

  forms: {
    cancelPayment: 'Précédent',
    savePaymentMethod: {
      label: 'Sauvegarder ce moyen de paiement',
      section: 'Mes moyens de paiement ({{count}})',
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
        addPaymentMethod: 'Ajouter un moyen de paiement',
      },
    },
  },
  generalTermsAndConditions: {
    iAccept: "J'accepte les ",
    theTermsAndConditions: 'conditions générales de ventes.',
    close: 'Fermer',
  },
  paymentMethod: {
    label: 'Moyen de paiement',
    [CB.id]: 'Carte bleue',
    [CB_MANUAL.id]: 'Carte bleue (manuel)',
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
      invalid:
        "IBAN invalide. Attention : l'IBAN doit correspondre à un compte bancaire domicilié dans le même pays que votre entreprise",
      accountNumber: {
        label: 'Identifiant bancaire (IBAN)',
        placeholder: 'FR89370400440532013000',
      },
      actions: {
        cancel: 'Annuler',
        submit: 'Confirmer',
      },
    },
  },
};
