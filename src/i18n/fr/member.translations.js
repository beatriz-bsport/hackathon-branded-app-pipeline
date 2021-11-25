exports.default = {
  search: {
    createMember: 'Ajouter un membre',
    cancel: 'Fermer',
  },
  // eslint-disable-next-line
  name: 'Nom',
  unpaidInvoiceTitle: 'Facture impayée',
  unpaidInvoiceTitle_plural: 'Factures impayées',
  adjustBalance: 'Ajuster le solde',
  restoreMember: 'Restaurer',
  archived: 'Archivé',
  table: {
    show: 'Voir',
  },
  date_joined: "Date d'inscription",
  invoiceTitle: 'Factures',
  subscriptionTitle: 'Souscriptions',
  offers_joined: 'Nb séances inscrit(e)',
  pass_owner: 'Carte valide',
  birth: {
    bornIn: 'Né le {{-date}} - {{age}} ans',
    bornIn_F: 'Née le {{-date}} - {{age}} ans',
    unknown: 'Né le -',
    unknown_F: 'Née le -',
  },
  barcode: {
    none: 'aucun',
    code: 'Code carte',
    display: 'Afficher le code barre',
  },
  memberSince: 'Inscrit le ',
  showNextBooking: 'Voir les réservations futures',
  nextBooking: 'prochaine : ',
  showPreviousBooking: 'Voir les réservations passées',
  pastBooking: 'dernière : ',
  engagement: 'Engagement',
  addMember: 'Ajouter une fiche de membre',
  memberList: 'Liste des membres',
  note: {
    noNoteSaved: 'Aucune note enregistrée',
    addNote: 'Ajouter une note',
    myNotes: 'Mes notes',
    healthNotes: 'Informations essentielles',
    is_medical: 'Note essentielle',
  },
  file: {
    addButtonBlocked: 'Supprimez des documents pour en ajouter de nouveaux',
    deletion: 'Suppression',
    imported: 'Document importé !',
    title: 'Mes documents',
    deleteFileMessage: 'Etes vous sûr de vouloir supprimer ce document ?',
    confirm: 'Confirmer',
    add: 'Ajouter un document',
    submit: 'Ajouter',
    nofileSaved: 'Aucun document enregistré',
    upload_file: 'Ajouter un document',
    cancel: 'Annuler',
    name: 'Nom',
    drop_file: 'Glisser et déposer ou cliquer pour ajouter un document',
  },
  regularizeBalance: 'Régulariser',
  applyBalanceToUnpaidInvoices: 'Appliquer le solde aux impayés',
  cashoutBalance: 'Décaisser',
  creditAccountBalance: 'Solde client',
  showPaymentPack: 'Voir les cartes de cours',
  showInvoices: 'Voir les factures',
  showSubscriptions: 'Voir les souscriptions',
  relation: {
    pleaseSelectRelation:
      'Sélectionnez une relation pour voir les carte de cours partagées',
  },
  menu: {
    info: 'Général',
    relation: 'Relations',
    bookings: 'Réservations',
    giftcard: 'Carte cadeau',
    paymentPack: 'Cartes de cours',
    invoices: 'Factures et Souscriptions',
    contact: 'Contact',
    payment: 'Facturation',
    privateBooking: 'Rendez-vous',
    privateConsumerPass: 'Cartes RDV',
    vod: 'VOD',
    form: 'Formulaires',
  },
  row: {
    headers: {
      actions: 'Actions',
      newsletter_email: 'Accepte les emails',
    },
    yes: 'Oui',
    no: 'Non',
    update: 'Modifier',
  },
  paymentAction: {
    toBill: 'Facturer',
    toSubscribe: 'Souscrire',
  },
  merge: 'Fusionner',
  forms: {
    title: 'Informations utilisateur',
    needInformationValidation: {
      welcome: 'Bonjour {{firstname}}',
      subtitle: {
        notMemberYet:
          'Il semblerait que ce soit la première fois que vous vous connectez à ce studio',
        memberOfCompany: 'Dites nous en plus sur vous.',
      },
      legend: {
        notMemberYet:
          'Souhaitez vous transmettre vos informations pour vous y inscrire ? ',
        memberOfCompany:
          'Pour continuer votre navigation veuillez compléter les informations requises ci-dessous',
      },
      button: {
        notMemberYet: 'Transmettre les informations',
        memberOfCompany: 'Compléter mes informations',
      },
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
    phone: {
      error: 'Numéro de téléphone invalide',
    },
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
    goTo: 'Voir le membre',
    linkUser: "Lier l'utilisateur",
    merge: 'Fusionner',
  },
  linkDialog: {
    title: 'Lier un utilisateur existant',
    content:
      'Ce compte a initialement été utilisé dans un autre club, il sera désormais connecté à un nouveau club.',
    cancel: 'Annuler',
    confirm: 'Je confirme',
  },
  termsAndConditions: "Les conditions générales d'utilisation",
  memberTermsAccepted: ' ont été acceptées le {{- date}}',
  vaccinationStatus: {
    done: 'Pass sanitaire valide',
    notDone: 'Pas de pass sanitaire valide',
    unknown: 'Status pass sanitaire inconnu',
  },
  archive: {
    archivedMember: 'Membre Archivé : {{name}}',
    dialog: {
      title: 'Archiver un membre',
      helper_text_1: 'Êtes-vous sûr de vouloir archiver ce membre ?',
      helper_text_2:
        "Ce membre n'apparaitra plus dans la liste de vos membres.",
      warning: {
        general:
          'Nous avons identifié les points ci-dessous, nous vous conseillons de régulariser le compte de ce client avant archivage:',
        0: 'Solde interne négatif',
        1: 'Facture(s) impayée(s)',
        2: 'Abonnement en cours',
        3: 'Abonnement avec renouvelement automatique en cours',
        4: 'Réservation(s) prévue(s) dans le future',
        5: 'Réservation(s) récurrente(s) enregistrée(s)',
        6: 'Rendez-vous prévu(s)',
      },
      actions: {
        close: 'Fermer',
        confirm: 'Confirmer',
      },
    },
  },
};
