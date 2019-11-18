export default {
  table: {
    noContent: 'Aucune souscription enregistrée',
  },
  recap: {
    willBecharged: ' sera facturé ',
    every: ' chaque ',
    month: 'mois ',
    times: ' fois ',
    forObject: ' pour ',
    from: 'A partir du ',
    to: " jusqu'au ",
    forATotalOf: 'Pour un total de ',
    includingFreeTrialOf1: ' dont ',
    includingFreeTrialOf2: ' non-facturés ',
  },
  form: {
    check: 'Vérifier',
    submit: 'Facturer',
    title: 'Nouveau paiement récurrent',
    cancel: 'Annuler',
  },
  plannedInvoiceStatus: {
    pending: 'En attente',
    canceled: 'Annulé',
    failed: 'Paiement refusé',
    succeeded: 'Encaissé',
  },
  subscriptionStatus: {
    pending: 'En cours de facturation',
    canceledOn: 'Stoppée le ',
    hasEnded: 'Facturation terminée',
  },
  action: {
    stop: 'Arrêter',
    stopExplain:
      'Les prochains paiements seront annulés et les factures correspondantes seront supprimées. Si une réservation a été enregistrée avec un abonnement dont la facture a été annulée, elle sera également annulée.',
  },
  parameters: {
    autoRenew: 'Renouvellement automatique',
    parameters: 'Paramètres',
    subscribeAgain: 'Souscrire à nouveau',
    voucher: 'Offre spéciale',
    trial_nb: 'Nombre de mois offerts',
    recurrent_voucher: 'Réduction sur chaque facture',
    name: 'Nom',
    member: 'Membre',
    dateCreated: 'Date de création',
    nbInterval: 'Nombre de mois',
    recurrent_price: 'Paiement récurrent',
    paymentPack: 'Abonnement',
    nbMonths: 'Nombre de mois',
    dateStart: 'Première facturation',
    firstBilling: 'Premier encaissement',
  },
  schedule: {
    provisionalTitle: 'Echéancier prévisionnel',
    paymentMethodTitle: 'Méthode de débit',
  },
  paymentMethod: {
    sepa: 'Prélèvement SEPA',
    card: 'Carte bleue',
  },
  mandate: {
    name: 'Nom et prénom du titulaire',
    email: 'Email du titulaire',
    content:
      "En donnant votre IBAN et en confirmant votre paiement, vous autorisez bsport et Stripe, notre système de paiement, à envoyer les instructions de débit à votre banque en accord avec l'échéancier de paiement. Vous pouvez demander un remboursement à votre banque selon les termes de votre contrat avec cette dernière. Un remboursement doit être demandé dans les 8 semaines après le premier débit.",
  },
};
