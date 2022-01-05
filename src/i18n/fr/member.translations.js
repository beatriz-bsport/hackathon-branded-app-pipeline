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
  archiveMember: 'Archiver',
  actions: 'Actions',
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
    programs: 'Programmes',
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
      emailWillBeSend:
        'Un email sera envoyé aux deux adresses pour prévenir les membres.',
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
  termsAndConditions: 'Les conditions générales de vente',
  termsOfUse: "Les conditions générales d'utilisation",
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
  noData: "Il n'y a aucun membre dans cette smartlist.",
  noMember: "Il n'y a aucun membre à afficher pour le moment.",
  changeEmailRequest: {
    pendingValidation: 'Changement en attente: {{ email }}',
    dialog: {
      title: "Changement d'email",
      titleMerge: ' Fusion de membre',
      simpleChange: {
        warning:
          "Attention, vous avez modifié l'email de connexion de ce membre :",
        unchangedEmail: 'En attendant il conservera son ancien email.',
      },
      linkMember: {
        warning: 'Attention, vous chercher à lier ces deux membres :',
        unchangedEmail:
          'En attendant {{ old_email }} conservera son ancien email et les membres ne seront pas liés.',
        notIncompany:
          "L'email {{ new_email }} appartient à un membre d'un autre studio.",
      },
      mergeMember: {
        warning:
          'Attention, vous chercher à fusionner ces deux membres de votre studio :',
        unchangedEmail:
          'En cliquant sur confirmer le membre {{ new_email }} récupérera les factures, réservations, solde et achats de {{ old_email }}. Le membre {{ old_email }} sera effacé. Un email sera envoyé aux deux adresses pour prévenir les membres.',
      },
      oldEmail: 'Ancienne adresse : {{ email }}',
      newEmail: 'Nouvelle adresse : {{ email }}',
      expiryText:
        'Après son envoi, la demande de changement expirera sous 7 jours',
      securityHelperText:
        'Par mesure de sécurité nous allons lui envoyer un email pour confirmer ce changement.',
      cancelHelperText:
        'Si vous ne souhaitez pas changer l\'email du membre cliquer sur "annuler".',
      actions: {
        close: 'Annuler',
        confirm: 'Confirmer',
      },
    },
    memberPage: {
      simpleEmailChange: {
        title: 'Changement de votre email de connexion',
        acceptRequestHelper:
          'Si vous souhaitez effectivement changer votre adresse par cette nouvelle addrese email, merci de cliquer sur "confirmer ma nouvelle adresse".',
        deniedRequestHelper:
          'Si cette demande de provient pas de vous ou que vous ne souhaitez pas changer votre adresse, merci de cliquer sur "garder mon adresse"',
        multipleCompanyHelper:
          "Votre adrese email est commune à l'ensemble des studios utilisant la solution Bsport. Elle sera donc changée pour tous ces studios. Les studios impactés seront les suivants:",
        submit: {
          acceptedTitle: 'Adresse de connexion modifiée',
          deniedTitle: 'Adresse de connexion conservée',
          emailUpatedTo:
            'Votre adresse de connexion a bien été changée par {{ email }}. Utilisez cette adresse comme nouvelle identifiant de connexion.',
          emailPreservedTo: 'Votre adresse de connexion restera {{ email }}',
        },
        error: {
          alreadyAccepted: {
            title: 'Vous avez déjà validée cette demande',
            helper:
              'Vous avez déjà sélectionné un email de connexion chez {{ company }}, votre décision a été prise en compte.',
            contactCompany:
              "Si vous n'êtes pas à l'origine de ce changement ou que vous souhaitez changer votre décision, merci de contacter directement votre studio.",
            currentEmail: 'Votre email de connexion actuel est : {{ email }}.',
          },
          alreadyDenied: {
            title: 'Vous avez déjà refusée cette demande',
            helper:
              'Vous avez déjà sélectionné un email de connexion chez {{ company }}, votre décision a été prise en compte.',
            contactCompany:
              "Si vous n'êtes pas à l'origine de ce changement ou que vous souhaitez changer votre décision, merci de contacter directement votre studio.",
            currentEmail: 'Votre email de connexion actuel est : {{ email }}.',
          },
          renewed: {
            title: 'Changement de votre email de connexion',
            helper:
              "Il semblerait que le studio {{ company }} vous ait envoyé une demande de changement d'adresse de connexion plus récente. Cette ancienne demande est caduc. Pour trouver la nouvelle demande merci de vérifier vos emails et vos spams.",
            contactCompany:
              'Si vous ne trouvez pas cette nouvelle demande, veuillez contacter votre studio.',
          },
          delayExceeded: {
            title: 'Change de votre email de connexion',
            helper:
              "Le studio {{ company }} vous avait envoyé une demande de confirmation de changement d'email de connexion. La durée de validité de 7 jours de cette demande est expirée.",
            contactCompany:
              "Si vous souhaitez demander de nouveau un changement d'adresse de connexion merci de contacter votre studio.",
          },
          emailTaken: {
            title: 'Email de connexion déjà pris',
            helper:
              'Le studio {{ company }} avait fait une demande pour changer votre email de connexion à votre espace personnel:',
            contactCompany:
              "Cependant un compte utilisant l'adresse {{ email }} a été crée entre-temps. Cette demande est désormais caduc. Si l'adresse email {{ email }} vous appartient mais que vous n'êtes pas à l'origine de la création du compte associé, merci de contacter directement votre studio.",
          },
        },
      },
      linkAccount: {
        title: 'Fusion de votre compte',
        veto: {
          requestExplanation:
            'Nous avons détecté que l’adresse {{ email }} est déjà utilisée dans un autre studio. Le studio {{ company }} a fait la demande de fusionner votre compte avec cet autre compte. Si vous acceptez de fusionner les deux comptes, vos nouveaux identifiants de connexion (email et mot de passe) seront ceux du compte {{ email }}. Vous pourrez gérer l’ensemble des studios dans lesquels vous êtes inscrit depuis une seule adresse.',
          acceptRequestHelper:
            'Pour accepter la fusion des comptes merci de vous rendre sur votre adresse {{ email }} et de cliquer sur le lien dans l’email que nous vous avons envoyé.',
          deniedRequestHelper:
            'Si vous ne souhaitez pas fusionner ces comptes ou que vous n’êtes pas à l’origine de cette demande merci de cliquer sur “refuser la fusion”. Cela empêchera la fusion des comptes et vous conserverez vos données de connexion.',
        },
        dstUser: {
          requestingStudio:
            'Le studio {{ company }} a fait la demande de fusionner votre compte {{ new_email }} avec le compte {{ old_email }}.',
          notMemberYet:
            'Nous avons détecté que vous ne faisiez pas encore parti du studio {{ company }}. Si vous acceptez de fusionner les deux comptes, vous serez inscrit au studio {{ company }} et récuperez les informations et réservations du compte {{ old_email }}. Vous conserverez vos identifiants de connexion actuels sur l’adresse {{ new_email }}. Vous pourrez gérer l’ensemble des studios dans lesquels vous êtes inscrit depuis cette adresse.',
          acceptRequestHelper:
            'Pour accepter la fusion des comptes merci de cliquer sur “accepter la fusion”.',
          deniedRequestHelper:
            'Si vous ne souhaitez pas fusionner ces comptes ou que vous n’êtes pas à l’origine de cette demande merci de cliquer sur “refuser la fusion”. Cela empêchera la fusion des comptes et vous ne serez pas inscrit chez {{ company }}.',
        },
        submit: {
          accept: {
            title: 'Fusion Acceptée',
            content:
              "Votre compte a bien été fusionné avec le compte {{ old_email }}. Vous êtes désormais membre du studio {{ company }}. Utilisez l'adresse {{ new_email }} pour vous connecter à votre compte.",
          },
          denied: {
            title: 'Fusion refusée',
            content:
              'Votre compte n’a pas été fusionné avec {{ new_email }}. Votre adresse de connexion restera {{ old_email}}.',
          },
        },
        error: {
          denied: {
            title: 'Fusion refusée',
            helper:
              'Vous avez déjà fait le choix de refuser la demande de fusion au studio {{ company }}, votre décision a été prise en compte.',
            contactCompany:
              "Si vous souhaitez demander de nouveau une fusion de votre compte ou si vous n'avez pas refusé la demande de fusion, merci de contacter directement votre studio.",
          },
          accepted: {
            title: 'Fusion acceptée',
            helper: 'Votre email de connexion actuel est : {{ email }}',
            contactCompany:
              'Si vous souhaitez changer votre choix ou si cette demande ne provenait pas de vous, merci de contacter votre studio.',
          },
        },
      },
      actions: {
        confirm: 'Confirmer ma nouvelle adresse',
        cancel: 'Garder mon adresse',
        deniedFusion: 'Refuser la fusion',
        confirmFusion: 'Accepter la fusion',
        continue: 'Continuer',
      },
      requestingStudio:
        'Le studio {{ company }} souhaite changer votre email de connexion à votre espace personnel :',
      generalError: {
        title: 'Changement de mail de connexion invalide',
        helper:
          'Le studio {{ company }} avait fait une demande pour changer votre email de connexion à votre espace personnel:',
        contactCompany:
          "Cependant nous avons détecté une erreur dans la demande actuelle, par mesure de sécurité cette demande est désormais désactivée. Pour regénérer cette demande, ou si vous n'êtes pas à l'origine de cette dernière, veuillez contacter directement votre studio.",
      },
      unAuthorizedAccess: {
        title: 'Accès non-autorisé',
        helper:
          "Vous n'êtes pas authentifé au compte pouvant accéder à cette demande, veuillez vous connecter au compte associé à l'email de confirmation envoyé.",
        contactCompany:
          'Si vous ne parvenez pas à accéder à cette demande, merci de contacter directment votre studio.',
      },
    },
  },
};
