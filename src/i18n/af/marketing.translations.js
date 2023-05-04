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
    noNotification: 'Aucune notification activée',
    handleNotification: 'Gérer les notifications',
    create: 'Créer une notification',
    dialogTitle: 'Créer une notification',
    listTitle: 'Notifications',
    selectNotificationRules: 'Sélectionnez une règle pour voir les détails',
    createNotification: 'Formulaire de notification',
    selectIdentifierLabel: {
      establishment_group: 'Sélectionnez une localisation',
      meta_activity: 'Sélectionnez une activité',
      workshop: 'Sélectionnez un atelier',
      establishment: 'Sélectionnez une salle',
      private_service: 'Sélectionnez un rendez-vous',
      payment_pack: 'Sélectionnez une carte de cours',
      private_pass: 'Sélectionnez une carte de rendez-vous',
      contract: 'Sélectionnez un abonnement',
    },
    paymentPackPlaceholder: 'Carte de cours',
    privatePassPlaceholder: 'Carte de rendez-vous',

    next: 'Suivant',
    cancel: 'Annuler',
    fabLabels: {
      establishmentGroup: 'Localisation',
      birthday: 'Anniversaire',
      meta_activity: 'Activité',
      workshop: 'Atelier',
      establishment: 'Salle',
      private_service: 'Rendez-vous',
      payment_pack: 'Carte de cours',
      private_pass: 'Carte de rendez-vous',
      contract: 'Abonnement',
    },
    groupTitle: {
      birthday: 'Anniversaire',
      booking: 'Réservation',
      privateBooking: 'Rendez-vous',
      paymentPack: 'Carte de cours',
      privatePass: 'Carte de rendez-vous',
      contract: 'Abonnement',
    },
    paymentPackKind: {
      validity: 'Validité de la carte',
      credit: 'Nombre de crédits',
    },
    contractKind: {
      contractStart: 'Début de l’abonnement',
      contractEnd: 'Fin de l’abonnement',
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
      state: 'État',
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
  cadence: {
    back: 'Retour',
    shutOff: 'Mettre en pause',
    editMode: 'Éditer',
    editModeLabel: 'Passer en mode édition',
    exitEditMode: 'Terminer',
    exitEditModeLabel: "Quitter le mode d'édition",
    cadenceParameters: 'Paramètres de la cadence',
    triggerElement: 'Élément déclencheur',
    marketingElement: 'Actions marketing',
    cadenceIndexHelper:
      'L’ordre des cadences définit l’ordre de priorité, si un membre peut entrer dans 2 cadences différentes, il commencera par la plus haute dans la liste.',
    form: {
      cancel: 'Annuler',
      submit: 'Créer',
      updateSubmit: 'Valider',
      delete: 'Supprimer',
      edit: 'Modifier',
      createCadenceHelper:
        "Grâce aux cadences, ciblez au mieux les actions marketing que vous envoyez à vos membres en fonction de leur comportement sur la plateforme. Créez une séquence d'actions que vos membres doivent remplir pour obtenir par exemple certaines promotions ou certains tags.",
      addACadence: 'Ajouter une cadence',
      title: 'Créer une cadence',
      updateTitle: 'Modification du nom de la cadence',
      cadenceStep: 'Étape',
      cadenceStepNameLabel: "Nom de l'étape",
      cadenceStepHelper:
        'Définissez ici le nom de l’étape, c’est ici que vous pourrez voir où en sont les membres dans la cadence.',
      cadenceNameLabel: 'Nom de la cadence',
      modify_name_label: 'Modifier le nom',
      entry_step: 'Entrée',
      win_step: 'Gagné',
      lose_step: 'Perdu',
      previous: 'Précédent',
      next: 'Suivant',

      trigger: {
        title: 'Déclencheurs',
        helpers: {
          cadence:
            "Définissez ici les déclencheurs d'entrée de la cadence. Les membres devront correspondre aux critères indiqués ci-dessous pour commencer la séquence marketing.",
          step: 'Définissez ici le déclencheur amenant à la prochaine étape. Les membres devront correspondre aux critères indiqués ci-dessous pour passer à l’étape suivante.',
          exitSuccess:
            'Définissez ici le déclencheur définissant qu’un membre sera considéré comme gagné et sortira de la cadence.',
          exitFail:
            'Définissez ici le déclencheur définissant qu’un membre sera considéré comme perdu et sortira de la cadence.',
        },
        labels: {
          cadence: 'L’entrée dans la cadence se fait via :',
          step: "L'entrée dans cette étape se fait via :",
          exitSuccess:
            'La sortie de la cadence en tant que gagné se fait via :',
          exitFail: 'La sortie de la cadence en tant que perdu se fait via :',
        },
        trigger_event_kind_label: 'Un événement',
        had_filtering_on_selected_event:
          "Filtrer l'événement sélectionné avec une smartlist",
        trigger_smartlist_kind_label: 'Une smartlist',
        rule_between_triggers: 'Règle entre les événements',
        and_rule_between_triggers: 'Et',
        or_rule_between_triggers: 'Ou',
        event_and_smartlist_helper:
          "Les membres devront correspondre à l'événement et faire partie de la smartlist pour rentrer dans la cadence",
        event_or_smartlist_helper:
          "Les membres devront correspondre à l'événement ou bien faire partie de la smartlist pour rentrer dans la cadence",
        marketing_actions: 'Actions marketing',
        select_marketing_actions_helper:
          'Sélectionnez une ou plusieurs actions à effectuer quand un membre est gagné. Cette option est facultative.',
        trigger_timeout_title: 'Limite de temps',
        trigger_timeout_select_label: 'jours maximum dans la cadence',
        trigger_timeout_explain_value_selected:
          'Si le membre est toujours présent dans la cadence au bout de {{ days }} jours alors il sera automatiquement sorti de celle-ci et considéré comme perdu.',
      },
      exit: {
        title: 'Sortie',
        exit_success_label: 'Gagné',
        exit_fail_label: 'Perdu',
      },
      event: {
        100: 'Achat',
        101: 'Réservation',
        102: 'Panier',
        103: 'Facturation',
        104: 'Souscription',
        1: 'Carte de cours',
        2: 'Carte de Rendez-Vous',
        3: 'Cours collectif',
        4: 'Présence cours collectif',
        5: 'Rendez-Vous',
        6: 'Annulation Rendez-Vous',
        7: 'Création',
        8: 'Ajout au panier',
        9: 'Panier payé',
        10: 'Facture crée',
        11: 'Création',
        12: 'Pause',
        13: 'Arrêt',
        14: 'Renouvellement',
        'consumer_payment_pack-create': 'Carte de cours',
        'private_consumer_pass-create': 'Carte de Rendez-Vous',
        'booking-create': 'Cour collectif',
        'booking-attendance': 'Présence cours collectif',
        'private_booking-create': 'Rendez-Vous',
        'private_booking-cancel': 'Annulation Rendez-Vous',
        'basket-created': 'Création',
        'basket-additem': 'Ajout au panier',
        'basket-finalize': 'Panier payé',
        'invoice-create': 'Facture crée',
        'billing_plan-create': 'Création',
        'billing_plan-pause': 'Pause',
        'billing_plan-stop': 'Arrêt',
        'billing_plan-renew': 'Renouvellement',
      },
      marketing_action: {
        1: 'Email',
        2: 'SMS',
        3: 'Notification push',
        4: 'Tag',
        5: 'Template Email',
        select_tag: 'Sélectionner un tag',
        defaultName: 'Nom par défaut',
        form: {
          submit: 'Valider',
          reset: 'Supprimer',
          helper:
            'Sélectionnez une ou plusieurs actions à effectuer quand un membre entre dans cette étape. Cette option est facultative.',
        },
      },
      error: {
        triggerCannotBeEmpty: "Vous devez sélectionner un type d'entrée.",
        timeoutMustBeStrictPositive:
          "La limite de temps doit être d'au moins 1 jour.",
      },
    },
    howTo: {
      title: 'Comment éditer votre cadence',
      explain:
        'Éditez les éléments du graphique en cliquant sur ses éléments ou créer des liens entre les blocs en glissé déposé.',
      add_marketing_action: '{{ index }}. Ajouter une action marketing',
      edit_marketing_action: '{{ index }}. Éditer l’action marketing',
      add_event: '{{ index }}. Ajouter un événement',
      edit_event: '{{ index }}. Éditer l’événement',
      add_trigger: '{{ index }}. Ajouter des branches',
      add_smartlist_filter: '{{ index }}. Filtrer sur des smartlists',
      set_trigger_destination:
        '{{ index }}. Rediriger vers une action marketing',
    },
    svgText: {
      triggers: 'Déclencheurs',
      marketing_actions: 'Actions marketing',
      action_name: "{ Nom de l'action marketing }",
      select_event: 'Sélectionner un événement',
      email: 'Email',
      sms: 'SMS',
      push_notification: 'Notification Push',
    },
    archive: {
      dialog: {
        title: "Suppression d'une cadence",
        beingArchived: 'Vous vous apprêtez à supprimer {{ name }}.',
        helper:
          'Les membres actuellement dans la cadence en sortiront automatiquement. Cette cadence sera archivée, vous pourrez la réactiver ultérieurement.',
        cancel: 'Annuler',
        confirm: 'Continuer',
      },
      archivedHeader: 'Cadences archivées',
    },
    activate: {
      button: 'Lancer',
      setupBeforeActivationHelper:
        'Terminez de configurer votre cadence et créez votre première action marketing pour lancer votre cadence.',
      dialog: {
        title: 'Lancer la cadence',
        firstHelper: 'Voulez-vous lancer la candence ?',
        secondHelper: "Vous ne pourrez plus l'éditer tant qu'elle sera lancée.",
        cancel: 'Annuler',
      },
    },
    cadenceCard: {
      win: 'Gagné',
      lost: 'Perdu',
    },
    triggers: {
      start: 'Entrée',
      exit: 'Sortie',
      trigger: 'Déclencheur',
      timeout: {
        timout_days_chip: '{{ days }} jours',
      },
      events: {
        purchase_chip: 'Achat',
        book_chip: 'Réservation',
        basket_chip: 'Panier',
        invoice_chip: 'Facturation',
        billing_plan_chip: 'Souscription',
        label: 'Évènement',
      },
      smartlist: {
        label: 'Smartlist',
      },
    },
    graph: {
      tools: {
        centerView: 'Centrer la vue',
        showMap: 'Afficher la minimap',
        hideMap: 'Cacher la minimap',
        showControls: "Afficher la barre d'outils",
        hideControls: "Cacher la barre d'outils",
        hideDisabledTriggers: 'Cacher les déclencheurs désactivés',
        showDisabledTriggers: 'Afficher les déclencheurs désactivés',
      },
      nodeElement: {
        addElement: 'Ajouter un déclencheur',
        edgeLabelForNodeCreation: 'En cours de création',
        cancelOnGoingCreation: 'Annuler la création',
        deleteStep: "Supprimer l'étape",
        deleteTrigger: "Supprimer le déclencheur",
      },
      alert: {
        cadenceIsActive:
          'Votre cadence est en cours merci de mettre votre cadence en pause pour pouvoir la modifier.',
        switchToEditMode:
          'Vous êtes en mode vue, cliquez sur ÉDITER pour pouvoir éditer la cadence.',
      },
    },
  },
};
