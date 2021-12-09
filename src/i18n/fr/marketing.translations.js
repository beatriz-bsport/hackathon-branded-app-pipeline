exports.default = {
  newsletter: {
    form: {
      title: 'Inscrivez-vous à notre newsletter',
      email: 'Adresse email',
      firstName: 'Prénom',
      lastName: 'Nom',
      validate: 'Valider',
    },
    messages: {
      error: "Impossible d'enregistrer votre email pour le moment",
      success: "C'est enregistré !",
    },
  },
  notifications: {
    dialogTitle: 'Créer une notification',
    selectNotificationRules: 'Sélectionnez une règle pour voir les détails',
    createNotification: 'Formulaire de notification',
    selectIdentifierLabel: {
      meta_activity: 'Sélectionnez une activité',
      workshop: 'Sélectionnez un atelier',
      establishment: 'Sélectionnez une salle',
      private_service: 'Sélectionnez un rendez-vous',
      payment_pack: 'Sélectionnez une carte de cours',
      private_pass: 'Sélectionnez une carte de de rendez-vous',
    },
    paymentPackPlaceholder: 'Carte de cours',
    privatePassPlaceholder: 'Carte de rendez-vous',
    next: 'Suivant',
    cancel: 'Annuler',
    fabLabels: {
      meta_activity: 'Activité',
      workshop: 'Atelier',
      establishment: 'Salle',
      private_service: 'Rendez-vous',
      payment_pack: 'Carte de cours',
      private_pass: 'Carte de rendez-vous',
    },
    groupTitle: {
      booking: 'Réservation',
      privateBooking: 'Rendez-vous',
      paymentPack: 'Carte de cours',
      privatePass: 'Carte de rendez-vous',
    },
    paymentPackKind: {
      validity: 'Validité de la carte',
      credit: 'Nombre de crédits',
    },
    notificationDetails: 'Détails de la notification',
    statisticDetails: 'Statistiques',
    notificationPreview: 'Apercu de la notification',
    editRule: 'Modifier la règle',
    removeRule: 'Supprimer la règle',
    deleteDialogTitle: 'Supprimer la règle',
    deleteDialogText:
      'Etes vous sûr de vouloir supprimer cette règle ? Cette opération est définitive',
    notificationsEmpty: 'Aucune notification existante pour ce groupe',
    createNotificationFabLabel: 'Créer une notification',
    mail: 'Mail ',
    mailTitle: 'Aperçu du mail',
    stats: {
      total_mail_send: 'Nombre de mails envoyés',
      opened_rate: "Taux d'ouverture",
      total_mail_opened: 'Nombre de mails ouverts',
    },
  },
  customForm: {
    layout: {
      editLayout: "Editer l'agencement",
      undo: 'Retour',
      reset: 'Réinitialiser',
      redo: ' Réappliquer',
      save: 'Sauvegarder',
      saveAndExit: 'Sauvegarder et Fermer',
      layoutUpTodate: 'Aucun enregistrement en cours',
      layoutUpdating: 'Une sauvegarde est en cours',
    },
    save: 'Sauvegarder',
    signupFormTitle: "Formulaire d'inscription",
    memberFormTitle:
      "Formulaire d'édition de profil (page de profil de vos membres)",
    signupFormHelper:
      "Les questions obligatoires du formulaire d’inscription doivent être éditables par vos membres sur leur profil. Ces questions seront ajoutées automatiquement au formulaire d'édition de profil client et sont affichées et modifiables.",
    memberFormHelper:
      'Les questions obligatoires du formulaire d’inscription sont par défaut affichées et modifiables. Elles ne peuvent être supprimées.',
    navigateToSignup: "Editer le formulaire d'inscription",
    navigateToMemberForm: "Editer le formulaire d'édition de profil client",
    navigateToMemberForm: "Editer le formulaire d'édition de profil client",
    save: 'Sauvegarder',
    editLayoutTitle: "Editer l'agencement du formulaire",
    editLayoutSubtitle:
      "Vous avez modifié un formulaire utilisant un agencement personnalisé, verifiez ici, et modifiez si besoin, l'apercu de vos formulaire sur les différentes tailles d'écran",
    signupFormTitle: "Formulaire d'inscription",
    title: 'Formulaires',
    CustomFormLink: 'Lien du formulaire',
    linkHelper:
      'Pour envoyer le formulaire à vos membres, collez le lien ci-dessus dans vos mails. Seules les modifications sauvegardées seront visibles.',
    search: 'Chercher une formulaire',
    name: 'Nom',
    content: 'Contenu du formulaire',
    preview: 'Aperçu du formulaire',
    label: 'Label',
    kind: 'Type',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    next: 'Suivant',
    previous: 'Retour',
    submitLater: 'Répondre plus tard',
    send: 'Envoyer',
    mandatory: 'Obligatoire',
    display: 'Afficher',
    editable: 'Modifiable',
    numberQuestions: 'Nombre de questions',
    listActions: 'Actions',
    disabledCustomForm: 'Formulaires archivés',
    disabledCustomFormField: 'Eléments archivés',
    noCustomForm:
      'Utilisez les formulaires pour récupérer des informations supplémentaires sur vos membres.',
    addCustomFrom: 'Ajouter un formulaire',
    selectCustomForm: 'Sélectionner un formulaire pour en voir les détails',
    selectCustomFormFilled:
      'Sélectionner un des formulaires complétés pour voir son contenu',
    emptyCustomForm:
      'Ce formulaire est vide, vous pouvez ajouter des éléments le configurant.',
    addFieldLong: 'Ajouter un élement',
    unaccessibleForm:
      'Ce formulaire est actuellement inaccessible, pour retourner sur votre page de profil cliquez sur le boutton ci-dessous.',
    backToUserSpace: 'Profile',
    changesDetected:
      'Des changements ont été effectués. Sauvegardez le formulaire pour les appliquer.',
    noChanges: 'Formulaire à jour.',
    changesAreSubmitting: 'Formulaire en cours de mise à jour.',
    answerForDisabledField: 'Questions archivées',
    allFieldDisabled: 'Toutes les questions sont archivées',
    allStepsCompleted: 'Vous avez complété toutes les étapes',
    resetSubmit: 'Modifier mes réponses',
    disconnect: 'Se déconnecter',
    actions: {
      configure: 'Configurer',
      statistics: 'Statistiques',
      customization: 'Personnalisation',
    },
    modal: {
      delete: {
        title: 'Archiver un formulaire',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        content:
          'En archivant ce formulaire il sera placé dans vos formulaires archivés et ne sera plus accessible pour vos membres.',
      },
    },
    signUpInfoModal: {
      title: 'Informations',
      content:
        'Vous venez de rendre certaines questions du formulaire d’inscription obligatoires. Les questions obligatoires du formulaire d’inscription doivent être éditables par vos membres sur leur profil. Ces questions ont donc été ajoutées automatiquement au formulaire de modification et sont affichées et modifiables. Rendez-vous sur l’édition du formulaire de modification pour le personnaliser.',
      cancel: 'Annuler',
      confirm: 'Continuer',
    },
    tab: {
      general: 'Contenu',
      campaign: 'Campagne',
      statistics: 'Statistiques',
      layout: 'Personnalisation',
    },
    breakpoints: {
      xs: 'Mobile',
      sm: 'Petit écran',
      md: 'Ecran moyen',
      lg: 'Ecran large',
    },
    field: {
      location: 'Localisation préférée',
      sign_up_question: "Question du formulaire d'inscription",
      first_name: 'Prénom',
      last_name: 'Nom de famille',
      birthday: 'Date de naissance',
      address_line_1: 'Adresse',
      address_line_2: "Complément d'adresse",
      gender: 'Sexe',
      zipcode: 'Code postal',
      photo: 'Photo de profil',
      emergency_contact: "Contact d'urgence",
      accept_email: 'Accepte email',
      accept_sms: 'Accepte sms',
      vaccination_status: 'Status pass sanitaire COVID-19',
      title: 'Titre',
      email: 'Adresse email',
      phone: 'Téléphone',
      password: 'Mot de passe',
      additional_adress: "Complément d'adresse",
      city: 'Ville',
      country: 'Pays',
      general_terms_and_conditions:
        "J'accepte les conditions générales d'utilisation",
      repeatPassword: 'Confirmer le mot de passe',
      paragraph: 'Paragraphe',
      short_answer: 'Réponse courte',
      long_answer: 'Réponse longue',
      radio: 'Choix multiples',
      check_box: 'Cases à cocher',
      select: 'Liste déroulante',
      select_placeholder: 'Sélectionner',
      file: 'Joindre un fichier',
      fileHelper:
        'Les fichiers téléchargés seront directement ajoutés à la section “Mes documents” de la fiche membre.',
      link_to_note: 'Créer une note',
      link_to_note_helper:
        'En liant la question à une note, la réponse sera automatiquement ajoutée à une note sur la fiche membre.',
      text_size_limit:
        'La longeur de la réponse sera limitée à {{count}} caractères.',
      signature: 'Signature',
      link_to_tag_popover: 'Lier un tag à cette option',
      tag_group: 'Catégorie',
      tag_name: 'Tag',
      choice_warning:
        'Toutes les options enregistrées lors de la sauvegarde du formulaire ne seront plus modifiables. Vous pourrez tout de même les supprimer ou en ajouter de nouvelles.',
      waiver: 'Décharge de responsabilité',
      general_terms_and_conditions: "Conditions générales d'utilisation",
      isMandatoryOnSignUp: "La question est obligatoire à l'inscription",
    },
    customFormField: {
      modal: {
        disable: {
          title: 'Supprimer un élément',
          cancel: 'Annuler',
          confirm: 'Confirmer',
          content:
            'En supprimant cet élément il sera placé dans les éléments archivés et ne sera  plus visible pour vos membres.',
        },
        add: {
          title: 'Elément du formulaire',
          addField: 'Ajouter un ',
          select: 'Sélectionner un élément',
          option: 'Ajouter une option',
          cancel: 'Annuler',
          confirm: 'Confirmer',
        },
        error: {
          choicesLength: 'Vous devez défnir au moins 2 choix',
          emptyChoice: 'Les choix ne peuvent pas être vides',
          passwordsDontMatch: 'Les deux mots de passes ne sont pas les mêmes',
          tooShort: "Le mot de passe doit être formé d'au moins 8 caractères",
          signupQuestionShouldBeSelected:
            " Vous devez sélectionner une question du formulaire d'inscription",
        },
        signature: {
          addSignature: 'Ajouter  une signature',
          editSignature: 'Editer la signature',
          addSignatureHelper: 'Vous pouvez dessiner votre signature ci-dessous',
          clear: 'Effacer la signature',
        },
      },
    },
    submit: {
      date_submitted: 'Date de complétion',
      dialog: {
        title: 'Bien reçu ! ',
        content: "Merci d'avoir pris le temps de compléter ce formulaire.",
        confirmButton: 'Continuer',
      },
      errors: {
        requiredField: 'Obligatoire',
        requiredSignature: 'Veuillez signer le formulaire.',
        requiredFile: 'Veuillez joindre un fichier',
        passwordMinimumRequirementsError:
          'Le mot de passe doit contenir au moins 6 caratères',
        passwordConfirmationError: 'Les mots de passes ne sont pas indetiques',
        invalidEmail: 'Email invalide',
      },
    },
    statistics: {
      byMember: 'Détail par membre',
      table: {
        column: {
          member: 'Membre',
          display_count: "Nombres d'ouvertures",
          last_display_date: 'Dernière ouverture',
          completed: 'Complété',
        },
        row: {
          no: 'Non',
          yes: 'Oui',
        },
      },
    },
    displayRule: {
      header: 'Règles de notifications',
      addNewDisplayRule: 'Ajouter une règle',
      empty: 'Aucune règle de notification pour ce formulaire',
      forbiddenForSignup:
        'Ce formulaire ne peut pas être associé à des règles de notifications',
      kind: {
        signUp: 'Les nouveaux membres',
        signUpAlreadyExists: ' Règle existante',
        connection: 'Les membres déjà inscrits',
        connectionLabel: 'Ancienneté du membre (jours)',
        connectionHelperText:
          'Seul les membres inscrits depuis un minimum de {{count}} jours verront cette notification',
      },
      form: {
        dialog: {
          title: "Règles d'affichage",
          subTitle: 'Quels membres voulez-vous cibler ?',
          helperTextRegisteredMembers:
            'Le formulaire apparaitra en pop-up sur la marketplace et le widget pour tous les membres concernés.',
          helperTextNewMembers:
            "Le formulaire apparaitra en pop-up sur la marketplace et le widget à la suite du formulaire d'inscription.",
          create: 'Ajouter',
          cancel: 'Annuler',
          modify: 'Modifier',
          advancedOptions: 'Paramètres avancés',
          snoozeOption:
            'Autoriser les membres à remettre à plus tard le remplissage du formulaire',
          force_display:
            "Forcer l'affichage aux membres ayant déjà remplie le formulaire précédemment",
          snoozeOptionLabel: 'Durée du snooze (heures)',
          snoozeOptionHelperText:
            "Le formulaire s'affichera de nouveau {{count}} heures après avoir été ignoré",
        },
        errors: {
          timedeltaBeforeDisplayMustBeGraterThanZero:
            'Cette valeur doit être supérieure à 0.',
        },
      },
      forNewMember: 'Pour les nouveaux membres',
      forRegisteredMember:
        'Pour les membres inscrits depuis plus de {{ count }} jours',
      forRegisteredMemberMinimal: '> {{ count }} jours',
      unForcedModeMinimal:
        'Non-visible par les membres ayant déjà remplie le formulaire',
      forcedDisplayMinimal:
        'Visible même pour les membres ayant déjà remplie le formulaire',
      snoozableMinimal: 'Peut être ignoré',
      unSnoozableMinimal: 'Obligatoire',
      snoozeTime: 'Veille de {{ count }} heures',
    },
    signUp: {
      signupFields: 'Questions des formulaires',
      helperSignup:
        'Vous pouvez modifier ici le formulaire d’inscription de votre studio. Choisissez et personnalisez les questions à remplir pour devenir membre de votre club.',
      helperMemberForm:
        'Le formulaire de modification est le formulaire présent sur la page de profil de vos membres. Il leur permet de voir et de modifier leurs informations. Ce formulaire est lui aussi personnalisable.',
    },
    clientForms: {
      preview: 'Aperçu de mes formulaires',
      signup: 'Inscription',
      modification: 'Modification',
      customize: 'Personnaliser',
      modify: 'modifier',
    },
  },
};
