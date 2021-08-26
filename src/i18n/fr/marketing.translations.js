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
    selectNotificationRules: 'Sélectionnez une règle pour voir les détails',
    createNotification: 'Formulaire de notification',
    selectIdentifierLabel: {
      meta_activity: 'Sélectionnez une activité',
      workshop: 'Sélectionnez un atelier',
      establishment: 'Sélectionnez un établissement',
      private_service: 'Sélectionnez un rendez-vous',
      payment_pack: 'Sélectionnez une carte de cours',
    },
    paymentPackPlaceholder: 'Carte de cours',
    next: 'Suivant',
    cancel: 'Annuler',
    fabLabels: {
      meta_activity: 'Activité',
      workshop: 'Atelier',
      establishment: 'Établissement',
      private_service: 'Rendez-vous',
      payment_pack: 'Carte de cours',
    },
    groupTitle: {
      booking: "Réservation",
      privateBooking: "Rendez-vous",
      paymentPack: "Carte de cours",
    },
    paymentPackKind: {
      validity: 'Validité de la carte',
      credit: 'Nombre de crédits'
    },
    notificationDetails: 'Détails de la notification',
    statisticDetails: 'Statistiques',
    editRule: 'Modifier la règle',
    removeRule: 'Supprimer la règle',
    deleteDialogTitle: 'Supprimer la règle',
    deleteDialogText:
      'Etes vous sûr de vouloir supprimer cette règle ? Cette opération est définitive',
    notificationsEmpty: 'Aucune notification existante pour ce groupe',
    createNotificationFabLabel: 'Créer une notification',
    mail: "Mail ",
    mailTitle: "Aperçu du mail",
    stats: {
      total_mail_send: "Nombre de mails envoyés",
      opened_rate: "Taux d'ouverture",
      total_mail_opened: "Nombre de mails ouverts"
    }
  },
  customForm: {
    title: 'Formulaires',
    CustomFormLink: 'Lien du formulaire',
    linkHelper : 'Pour envoyer le formulaire à vos membres, collez le lien ci-dessus dans vos mails. Seules les modifications sauvegardées seront visibles.',
    search : 'Chercher une formulaire',
    name: 'Nom',
    content: 'Contenu du formulaire',
    preview: 'Aperçu du formulaire',
    label: 'Label',
    kind: 'Type',
    save: 'Sauvegarder',
    cancel :'Annuler',
    send : 'Envoyer',
    mandatory :'Obligatoire',
    numberQuestions: "Nombre de questions",
    listActions: 'Actions',
    disabledCustomForm: 'Formulaires archivés',
    disabledCustomFormField : 'Eléments archivés',
    noCustomForm: 'Utilisez les formulaires pour récupérer des informations supplémentaires sur vos membres.',
    addCustomFrom: 'Ajouter un formulaire',
    selectCustomForm: 'Sélectionner un formulaire pour en voir les détails',
    selectCustomFormFilled: 'Sélectionner un des formulaires complétés pour voir son contenu',
    emptyCustomForm : 'Ce formulaire est vide, vous pouvez ajouter des éléments le configurant.',
    addFieldLong: 'Ajouter un élement',
    unaccessibleForm: 'Ce formulaire est actuellement désactivé, pour retourner sur votre page de profile cliquez sur le boutton ci-dessous.',
    backToUserSpace: 'Profile',
    changesDetected: 'Des changements ont été effectués. Sauvegardez le formulaire pour les appliquer.',
    noChanges: 'Formulaire à jour.',
    answerForDisabledField: 'Questions archivées',
    allFieldDisabled : 'Toutes les questions sont archivées',
    actions: {
      configure: 'Configurer',
      statistics: 'Statistiques',
    },
    modal: {
      delete: {
        title: 'Archiver un formulaire',
        cancel: 'Annuler',
        confirm: 'Confirmer',
        content : "En archivant ce formulaire il sera placé dans vos formulaires archivés et ne sera plus accessible pour vos membres.",
      }
    },
    tab: {
      general: 'Contenu',
      campaign: 'Campagne',
      statistics:'Statistiques',
    },
    field: {
      title: 'Titre',
      paragraph: 'Paragraphe',
      short_answer: 'Réponse courte',
      long_answer: 'Réponse longue',
      radio: 'Choix multiples',
      check_box: 'Cases à cocher',
      select: 'Liste déroulante',
      select_placeholder : 'Sélectionner',
      file: 'Joindre un fichier',
      fileHelper: 'Les fichiers téléchargés seront directement ajoutés à la section “Mes documents” de la fiche membre.',
      link_to_note: 'Créer une note',
      link_to_note_helper: 'En liant la question à une note, la réponse sera automatiquement ajoutée à une note sur la fiche membre.',
      text_size_limit: 'La longeur de la réponse sera limitée à {{count}} caractères.',
      signature: 'Signature',
      link_to_tag_popover: 'Lier un tag à cette option',
      tag_group: 'Catégorie',
      tag_name: 'Tag',
      choice_warning : "Toutes les options enregistrées lors de la sauvegarde du formulaire ne seront plus modifiables. Vous pourrez tout de même les supprimer ou en ajouter de nouvelles.",
    },
    customFormField: {
      modal: {
        disable: {
          title: 'Supprimer un élément',
          cancel: 'Annuler',
          confirm: 'Confirmer',
          content: "En supprimant cet élément il sera placé dans les éléments archivés et ne sera  plus visible pour vos membres.",
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
          choicesLength : "Vous devez défnir au moins 2 choix",
          emptyChoice: "Les choix ne peuvent pas être vides",
        },
        signature: {
          addSignature: 'Ajouter  une signature',
          editSignature : 'Editer la signature',
          addSignatureHelper: 'Vous pouvez dessiner votre signature ci-dessous',
          clear :'Effacer la signature',
        },
      },
    },
    submit: {
      date_submitted : 'Date de complétion',
      dialog: {
        title: 'Bien reçu ! ',
        content: "Merci d'avoir pris le temps de compléter ce formulaire.",
        confirmButton :'Continuer',
      },
      errors: {
        requiredField: 'Ce champ est obligatoire, veuillez sélectionner une réponse.',
        requiredSignature: 'Veuillez signer le formulaire.',
        requiredFile :'Veuillez joindre un fichier',
      }
    },
    statistics: {
      byMember : "Détail par membre",
      table: {
        column: {
          member: 'Membre',
          display_count: "Nombres d'ouvertures",
          last_display_date: "Dernière ouverture",
          completed : "Complété",
        },
        row: {
          no: 'Non',
          yes : 'Oui',
        }
      }
    }
  }
};
