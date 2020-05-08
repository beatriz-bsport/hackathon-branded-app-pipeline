import {
  CB,
  CB_MANUAL,
  CHECK,
  HOLIDAY_CHECK,
  CASH,
  EVENT_BRITE,
  AMEX,
  BANK_TRANSFER,
  CREDIT_ACCOUNT,
  SUBSCRIPTION_CB,
  OTHER,
} from '@bsport/common/lib/master-data/payment-methods';

exports.default = {
  explainOption: "Vous serez prévenu par email lorsqu'une place se libèrera",
  bookAnotherOption: "Me réinscrire sur liste d'attente",
  bookAnOption: "M'inscrire sur liste d'attente",
  availablePaymentPacks: 'Pass compatibles : ',
  goBack: 'Précédent',
  hasOneOrMoreOption: "Vous êtes déjà inscrit sur la liste d'attente",

  paymentComboSectionTitle: 'Pack',

  method: {
    CB: 'Carte bleue',
    CREDIT_ACCOUNT: 'Paiement sur place',
  },

  order: {
    success: 'Votre paiement a bien été enregistré',
  },
  forms: {
    cancelPayment: 'Précédent',
    credit: {
      explain:
        'Votre club sera informé du débit, vous règlerez cette commande sur place',
      pay: 'Confirmer',
    },
    paymentIntent: {
      pay: 'Payer',
    },
  },
  generalTermsAndConditions: {
    iAccept: "J'accepte les ",
    theTermsAndConditions: 'conditions générales de ventes.',
    close: 'Fermer',
  },
  paymentMethod: {
    [CB.id]: 'Carte bleue',
    [CB_MANUAL.id]: 'Carte bleue (manuel)',
    [CHECK.id]: 'Chèque',
    [HOLIDAY_CHECK.id]: 'Chèque vacances',
    [CASH.id]: 'Espèces',
    [EVENT_BRITE.id]: 'EventBrite',
    [AMEX.id]: 'AMEX',
    [BANK_TRANSFER.id]: 'Virement',
    [CREDIT_ACCOUNT.id]: 'Compte interne (crédit)',
    [SUBSCRIPTION_CB.id]: 'Paiement automatique',
    [OTHER.id]: 'Divers',
  },
};
