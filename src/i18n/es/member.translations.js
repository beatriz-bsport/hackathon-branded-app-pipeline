export default {
  // eslint-disable-next-line
  date_joined: "Date d'inscription",
  invoiceTitle: 'Factures',
  subscriptionTitle: 'Souscriptions',
  offers_joined: 'Nb séances inscrit(e)',
  pass_owner: 'Abonnement valide',
  bornIn: 'Né le ',
  memberSince: 'Inscrit le ',
  showNextBooking: 'Voir les réservations futures',
  nextBooking: 'prochaine : ',
  showPreviousBooking: 'Voir les réservations passées',
  pastBooking: 'dernière : ',
  engagement: 'Engagement',
  addMember: 'Ajouter une fiche de membre',
  note: {
    noNoteSaved: 'Aucune note enregistrée',
    addNote: 'Ajouter une note',
    myNotes: 'Mes notes',
    healthNotes: 'Informations médicales',
    is_medical: 'Note médicale',
  },
  creditAccountBalance: 'Accompte crédit restant',
  showPaymentPack: 'Voir les abonnements',
  showInvoices: 'Voir les factures',
  showSubscriptions: 'Voir les souscriptions',
  menu: {
    info: 'Général',
    bookings: 'Réservations',
    paymentPack: 'Abonnements',
    invoices: 'Factures et Souscriptions',
    payment: 'Facturation',
  },
  row: {
    headers: {
      actions: 'Actions',
    },
    update: 'Modifier',
  },
  merge: 'Fusionner',
  forms: {
    merge: {
      success: 'Membres fusionnés',
      error: 'Impossible de fusionner les membres',

      srcMember: 'Membre à fusionner (supprimé)',
      dstMember: 'Membre à conserver',
      title: 'Fusion membre',
      explainCredit: "L'accompte interne du membre sera transféré",
      explainBookingsAndPassAndInvoiceAndNotes:
        'Les abonnements, réservations, factures et notes seront transférés.',
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
  },
  user: {
    existsWithEmail:
      "Un utilisateur avec l'adresse email {{email}} existe déjà.",
    existsWithPhone:
      'Un utilisateur avec le numéro de téléphone {{phonenumber}} existe déjà.',
  },
  member: {
    existsWithEmail: "Un membre avec l'adresse email {{email}} existe déjà.",
    existsWithPhone:
      'Un membre avec le numéro de téléphone {{phonenumber}} existe déjà.',
  },
  exists: {
    goTo: 'Aller à la fiche membre',
    linkUser: "Lier l'utilisateur",
  },
  link: {
    success: 'Membre lié avec succès',
  },
  linkDialog: {
    title: 'Lier un utilisateur existant',
    content:
      "En liant l'utilisateur à votre compte entreprise, vous confirmez que celui-ci a expressement donné son consentement à cet effet.",
    cancel: 'Annuler',
    confirm: 'Je confirme et lie le compte utilisateur',
  },
};
