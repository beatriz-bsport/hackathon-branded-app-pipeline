exports.default = {
  deleteImpossibleTitle: 'Impossible de supprimer la séance',
  deleteImpossibleText:
    "Vous ne pouvez pas supprimer cette séance parce qu'elle a des réservations en cours.",
  close: 'Fermer',
  video: {
    cantOpenLink:
      'Le lien vers conférence semble erroné, veuillez contacter votre club {{ contact_email }}',
    redirectLink:
      "Si vous n'êtes pas automatiquement redirigé, utiliser ce lien :",
    startingSoon: 'Votre séance démarre dans {{ minutesLeft }} minutes',
    hasEnded: 'Cette séance est terminée',
    isAutoRefresh:
      'Vous serez redirigé automatiquement sur la visioconférence 15 minutes avant le début du cours',
    loadingSoon: 'En cours de chargement...',
    activateVideo: 'Lancer la diffusion',
  },
  recurrenceIndex: 'Groupe n°{{ index }} de la récurrence',
  disabled: 'Annulée',
  credit_price: ' Crédit',
  booking: {
    confirmed: 'Confirmé(s)',
    fillRate: 'Taux de remplissage',
    waiting: "Liste d'attente",
  },
  extraordinaryEstablishment: '(lieu temporaire)',
  substitute: 'Remplaçant',
  pendingReplacementRequest: 'Une demande de remplacement est ouverte',
  calendar: {
    modifyOffer: 'Modifier',
    deleteOffer: 'Annuler',
    filter: 'Filtrer',
    today: "Aujourd'hui",
  },
  manageOffer: 'Gérer mes réservations',
  restoreOffer: 'Restaurer la séance',
  forms: {
    old_date: 'Ancien horaire :',
    new_date: 'Nouvel horaire :',
    delete: {
      buttonHardDelete: 'Supprimer',
    },
  },
  card: {
    copyLink: 'Copier le lien vers la page de réservation',
    copied: 'Lien copié',
  },
  offerManagement: {
    bookingOrder: {
      date: 'Trier par date',
      lastname: 'Trier par nom',
      firstname: 'Trier par prénom',
    },
    unevenQuickInvoices:
      'Des factures sans aucun mode de paiement sont ouvertes sur cette page. Voulez-vous vraiment quitter ?',
  },
  menu: {
    showMonth: 'Vision mois',
    showWeek: 'Vision semaine',
    showCancelled: 'Voir les annulations',
    hideCancelled: 'Masquer les annulations',
    massDisable: 'Annulation groupée',
    download: 'Récapitulatif',
  },
  massDisabler: {
    success: 'Annulation confirmée',
    offers: 'Séances non annulables',
    warningOfferGroupTitle: 'Séances non annulées',
    warningOfferGroup:
      "Attention les séances suivantes n'ont pas pu être annulées car elle font partie d'un groupe de séance. Pour les annuler merci d'annuler le groupe correspondant.",
    confirmationExplain: `Veuillez écrire ci-dessous en lettre capitale "JE CONFIRME".`,
    iConfirm: 'JE CONFIRME',
    successInfo:
      'La suppression de toutes les séances entre le {{start_date}} et le {{end_date}} a bien été prise en compte.',
    confirm: 'Confirmer',
    confirmInfo:
      "Vous êtes sur le point d'annuler toutes les séances comprises entre le {{start_date}} et le {{end_date}} (inclus). Soit {{number_of_deleted_offer}} séance annulée.",
    confirmInfo_plural:
      "Vous êtes sur le point d'annuler toutes les séances comprises entre le {{start_date}} et le {{end_date}} (inclus). Soit {{number_of_deleted_offer}} séances annulées.",
    sure: 'Êtes vous sûr de vouloir valider cette action ?',
    startDateLabel: 'Date de début (inclus)',
    endDateLabel: 'Date de fin (inclus)',
    info: 'Sélectionner les dates entre lesquelles vous souhaitez annuler toutes les séances. Les dates sélectionnées sont incluses.',
    warning: 'ATTENTION cette opération est irréversible',
    title: 'Annulation groupée',
    explain:
      "Sélectionnez l'intervalle de date sur lequel vous souhaitez annuler vos séances. Les membres ayant réservé seront prévenus par email et leur crédits automatiquement remboursés sur la carte de cours correspondante.",
    explainWarning: 'ATTENTION cette opération est irréversible.',
    explainLoading: 'Veuillez patienter',
    secondWarning:
      "En cliquant sur 'CONFIRMER' toutes les séances dans l’intervalle de dates seront définitivement annulées. Vous ne pourrez plus revenir en arrière.",
    secondWarningConfirm: 'Voulez-vous vraiment continuer ?',
    actions: {
      cancel: 'Annuler',
      submit: 'Confirmer',
      continue: 'Continuer',
    },
  },
  bookingList: 'Réservations',
  bookingListEmpty: 'Aucune réservation',
  liveOfferEdit: {
    editSimilarOffers:
      'Voulez-vous modifier les séances similaires selon ces nouvelles conditions ?',
    editSimilarOffersGroup:
      'Modifier la séance dans les récurrences futures du groupe ?',
    selectEdit: 'Sélectionnez les séances qui seront modifiées',
    selectAll: 'Tout sélectionner',
    unselectAll: 'Tout désélectionner',
    deleteSimilarOffers: 'Voulez-vous supprimer les séances similaires ?',
    deleteSimilarOffersGroups:
      'Voulez-vous supprimer les récurrences futures du groupe',
    selectDelete: 'Sélectionnez les séances qui seront supprimées',
    cancelSimilarOffers: 'Voulez-vous annuler les séances similaires ?',
    cancelSimilarOffersGroup:
      'Annuler la séance dans les autres récurrences du groupe ?',
    selectCancel: 'Sélectionnez les séances qui seront annulées',
    noSimilarOffer:
      'Aucune séance similaire trouvée. Seule cette séance sera affectée.',
    editSubteacher: {
      title: 'Changement professeur remplaçant',
      propagateToSimilarOffers: {
        checkboxLabel:
          'Appliquer les changements sur le professeur remplaçant aux séances sélectionnées',
        checkboxInfo:
          'En cochant cette case les changements appliqués au professeur remplaçant de cette séance seront appliqués à toutes les séances similaires. Sinon ils ne seront appliqués qu’à cette séance.',
        warning:
          'Les séances similaires suivantes possèdent déjà un autre professeur remplaçant. Que souhaitez vous faire ?',
        mode: {
          offersWithSameCoachOverrideOnly:
            'Conserver le remplaçant actuel sur ces séances',
          all: 'Propager les changements liés au professeur remplaçant sur ces séances',
        },
      },
    },
  },
  warningOfferFull: 'Le nombre maximum de réservations a déjà été atteint',
  maximumNumber: 'Nombre maximum de réservations',
  maximumNumberDescription:
    "Le nombre maximum de {{effectif}} réservations a déjà été atteint.En inscrivant ce membre vous dépasserez l'effectif initialement prévu. Etes vous sûr de vouloir inscrire ce membre ?",
  tagManagementInfo:
    '{{authorized}} tag(s) autorisé(s), {{unauthorized}} tag(s) non-autorisé(s)',
  levels: {
    modal: {
      title: 'Modifier le niveau',
      name: 'Nom',
      nameCaption: '{{max}} caractères max ({{count}}/{{max}})',
      color: 'Code couleur',
      cancel: 'Annuler',
      submit: 'Sauvegarder',
    },
    deleteModal: {
      title: 'Suppression',
      content: 'Êtes vous sûr de vouloir supprimer ce niveau ?',
      content2:
        'Les séances ayant déjà ce niveau le conserveront mais il ne pourra plus être ajouté aux futures séances.',
    },
    select: {
      add: 'Ajouter un niveau',
      title: 'Niveau',
      placeholder: 'Niveau',
    },
    customs: 'Personnalisés',
    delete: 'Supprimer',
    edit: 'Modifier',
  },
  rollCall: {
    warningText: {
      notValidatedRollCall: 'L’appel n’a pas été validé',
      modifiedRollCall:
        'L’appel a été modifié, vous devez de nouveau le valider',
      validatedDate: 'Validé le {{- date }} à {{ time }}',
      rollCallsLeftToValidate: '{{ number }} appel nécessite une validation',
      rollCallsLeftToValidate_plural:
        '{{ number }} appels nécessitent une validation',
      noRollCallLeft: 'Tous les appels ont été validés',
      lastValidatedRollCall: 'Dernier appel validé le {{- date }} {{ time }}',
    },
    warningIcon: {
      stateChangedTitle: 'Statut non validé',
      stateChanged: "Le statut a été changé mais n'a pas été validé",
    },
    button: {
      validationRollCallZero: 'Valider l’appel',
      validationRollCall: 'Valider l’appel',
      validationRollCall_plural: 'Valider tous les appels',
    },
    dialog: {
      validationRollCall: 'Valider l’appel',
      confirmationRollCall:
        'Attention, les membres marqués comme absents et titulaires d’une carte illimitée sujette aux pénalités seront sanctionnés. Etes-vous sûr de vouloir confirmer l’appel ?',
      confirmationRollCall_plural:
        'Vous allez valider l’appel pour l’ensemble des séances du jour. Attention, les membres marqués comme absents et titulaires d’une carte illimitée sujette aux pénalités seront sanctionnés. Etes-vous sûr de vouloir confirmer tous les appels ?',
      validatedRollCall: 'Appel validé',
      validatedRollCall_plural: 'Appels validés',
      savedRollCall: 'L’appel a bien été enregistré.',
      savedRollCall_plural: 'Les appels ont bien été enregistrés.',
    },
    chip: {
      validatedRollCall: 'Appel validé le {{- date }} {{ time }}',
      notValidatedRollCall: 'Appel non validé',
    },
    drawer: {
      rollCall: 'Appel',
      info: 'Valider l’appel permet de déclencher le décompte pour les pénalités des absences (no-show).',
      listMembers: 'Liste des membres inscrits',
    },
    filter: {
      validated: 'Appel validé',
      notValidated: 'Appel non validé',
      placeholder: 'Statut de l’appel',
    },
  },
  form: {
    stepper: {
      step: {
        INFOS: 'Séance',
        SETTINGS: 'Paramètres de modification',
      },
    },
    groupedOffer: {
      warning:
        'Attention cette séance fait partie du groupe de séances {{ name }}',
    },
    section: {
      specificities: {
        title: 'Caractéristiques',
        field: {
          effectif: 'Effectif',
          waitingListMaxSize: "Liste d'attente",
          level: 'Niveau',
          credits: 'Crédits',
          establishment: 'Lieu',
          broadcastLink: 'Lien de la visioconférence',
          hybridSection: 'Séance hybride',
          hybridLabel: 'Cette séance est à la fois en salle et en ligne.',
          hybridHelper:
            "En choisissant cette option une séance en ligne sera créée avec un effectif pour defaut de {{ onlineOfferDefaultEffectif }}. Vous pourrez éditer les informations de l'offre en ligne après création (Lien de diffusion, effectif, prix, etc...)",
          roomBlueprint: {
            title: 'Spot scheduling',
            placeholder: 'Sélectionner un plan',
          },
        },
        tooltip: {
          broadcastLink:
            'Le lien sera généré automatiquement pour ZOOM par bsport',
          credits:
            'Nombre de crédits de carte de cours nécessaires pour réserver',
          roomBlueprint:
            "Permet à vos élèves de réserver l'emplacement qu'ils souhaitent dans la salle",
        },
      },
      credits: {
        title: 'Crédits',
        field: {
          creditCount: 'Nombre de crédits',
        },
      },
      dateTime: {
        title: 'Horaires et date',
        field: {
          dateIntervalStartTime: 'Heure de début',
          durationMinute: 'Durée',
          dateIntervalStart: 'Date du cours',
          dateIntervalEnd: 'Date de fin',
          recurrence: {
            title: 'Récurrence',
            placeholder: 'Sélectionner une récurrence',
            option: {
              daily: 'Quotidien',
              weekly: 'Hebdomadaire',
              monthly: 'Mensuel',
            },
            preview: 'Prévisualiser',
            previewCount: '{{count}} séance va être créée',
            previewCount_plural: '{{count}} séances vont être créées',
          },
        },
      },
      coach: {
        title: 'Professeur',
        field: {
          coach: {
            title: 'Professeur',
            placeholder: 'Sélectionner un professeur',
          },
          coachOverride: {
            title: 'Remplaçant',
            placeholder: 'Sélectionner professeur remplaçant',
          },
          coachPaymentRule: {
            title: 'Règle de rémunération',
            placeholder: 'Sélectionner une règle',
          },
        },
      },
      settings: {
        title: 'Paramètres',
        field: {
          isManagerOnly: 'Disponible à la réservation (web+app)',
          allowGuestOffer: 'Autoriser la réservation pour un invité',
          partnership: {
            title: 'Marketplace',
            availableOnPartnership:
              'Sur les marketplaces (ClassPass, OneFit...)',
            partnerMaxBookingCount:
              'Nombre maximum de réservation marketplace (OneFit uniquement)',
          },
          isNotifyConsumers:
            'Voulez-vous informer vos clients de cette modification ?',
          isModifyRecursively:
            'Voulez-vous modifier les séances similaires selon ces nouvelles conditions ?',
        },
      },
      tags: {
        title: 'Tags',
        helperText:
          'Utilisez les tags pour rendre la séance réservable uniquement à un groupe de membres souhaité. Vous sélectionnez des tags pour rendre la séance réservable seulement aux membres possédant un des tags choisis. Ou bien vous pouvez sélectionner des tags pour rendre la séance non réservable seulement aux membres possédant un des tags sélectionnés.',
        field: {
          whitelistTags: 'Autorisé',
          blacklistTags: 'Non-Autorisé',
        },
        placeholder: 'Laisser vide pour autoriser tous les membres',
      },
      similarOffers: {
        title: 'Sélectionnez les séances qui seront modifiées',
        selectAll: 'Tout sélectionner',
        unselectAll: 'Tout désélectionner',
        info: "Les changements sur les séances risquent de les rendre incompatibles avec certaines cartes de cours. Après la modification veuillez prendre le temps de vérifier qu'ils resteront compatibles avec les éventuels changements de lieu / professeur.",
      },
      coachOverride: {
        title: 'Changement professeur remplaçant',
        field: {
          isCoachOverridePropagate:
            'Appliquer les changements sur le professeur remplaçant aux séances sélectionnées',
        },
        info: 'En cochant cette case les changements appliqués au professeur remplaçant de cette séance seront appliqués à toutes les séances similaires. Sinon ils ne seront appliqués qu’à cette séance.',
      },
    },
    dialog: {
      recurrencePreview: 'Prévisualisation',
      createLevel: 'Créer un niveau',
    },
    errors: {
      required: 'Champ incomplet',
      positiveNumber: 'La valeur doit être supérieure à 0',
      minZero: 'La valeur doit être supérieure ou égale à 0',
      minTwo: 'La valeur doit être supérieure ou égale à 2',
      dateFormat: 'Format de date invalide',
      dateTooFar:
        'Impossible de créer des séances ayant lieu dans plus de 3 ans',
      field: {
        effectif: 'La valeur est supérieure au nombre maximum de places',
        partnerMaxBookingCount:
          'Le nombre de places ici est supérieur au nombre de places dans la séance',
        broadcastLink:
          "Le lien est erroné. Il doit commencer par http:// ou https:// et ne pas contenir d'espacement",
        durationMinute: "La durée d'une seance doit être supérieure à 0 minute",
        dateIntervalEnd:
          'La date de fin ne peut pas être avant la date de début',
      },
    },
    warnings: {
      effectif:
        "Attention, vous n'êtes pas en train de saisir un prix. Êtes-vous sûr de la valeur ?",
      editOfferInitialCredits:
        'Les réservations anciennes ne prennent pas en compte les modifications des crédits',
    },
  },
};
