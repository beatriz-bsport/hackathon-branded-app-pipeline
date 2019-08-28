// @flow

import coach from './es/coach.translations';
import establishment from './es/establishment.translations';
import member from './es/member.translations';
import search from './es/search.translations';
import paymentPack from './es/payment-pack.translations';
import companies from './es/companies.translations';
import dashboard from './es/dashboard.translations';
import settings from './es/settings.translations';
import paymentRules from './es/payment-rules.translations';
import payment from './es/payment.translations';
import subscription from './es/subscription.translations';
import reporting from './es/reporting.translations';
import stripe from './es/stripe.translations';
import alerting from './es/alerting.translations';
import booking from './es/booking.translations';
import tag from './es/tag.translations';
import shop from './es/shop.translations';
import order from './es/order.translations';
import marketplace from './es/marketplace.translations';
import metaActivity from './es/meta-activity.translations';
import login from './es/login.translations';
import invoice from './es/invoice.translations';
import datetime from './es/datetime.translations';
import offer from './es/offer.translations';
import waitingList from './es/waiting-list.translations';
import selfCheckIn from './es/selft-check-in.translations';

export default {
  dashboard,
  tag,
  login,
  waitingList,
  establishment,
  order,
  settings,
  datetime,
  shop,
  paymentRules,
  payment,
  invoice,
  coach,
  subscription,
  reporting,
  alerting,
  paymentPack,
  metaActivity,
  offer,
  member,
  booking,
  marketplace,
  selfCheckIn,
  coachPerformance: {
    fields: {
      bonus: 'Bonus',
      base: 'Base',
      duration: 'Durée',
      nb_bookings: 'Réservations',
      name: 'Nom',
      date: 'Date',
      rule: 'Régle',
    },
    addBonus: 'Ajouter une règle',
    dateTitle: 'Plage de dates',
    remuneration: 'Rémunération',
    pricePerOffer: 'Montant par séance',
    bonus: 'Bonus',
    checkboxIncludeABonus: 'Inclure un bonus à la performance',
    bookingThresholdLabel: 'Minimum de réservation',
    bookingThresholdHelper:
      'Une séance ne sera comptabilisée que si elle totalise ce nombre de réservation',
    pricePerAdditionalBookingLabel: 'Variable par réservation',
    pricePerAdditionalBookingHelper:
      'Montant reversé pour toute réservation au-dessus de la limite',
    fixedPriceForAdditionalBookingLabel: 'Fixe par séance',
    fixedPriceForAdditionalBookingHelper:
      "Montant fixe reversé pour toute séance avec suffisamment d'inscrits",
  },
  translation: {
    stripe,
    activityCreated: 'Activité ajoutée',
    activityUpdated: 'Activité modifiée',
    bookingConfirmed: 'Réservation confirmée',
    button: { login: 'Connexion' },
    report: {
      delete: "Suppression d'un rapport",
    },
    metaActivity: {
      forms: {
        create: {
          success: 'Activité créée',
          error: "Erreur lors de l'enregistrement de l'activité",
        },
      },
      update: {
        imageUploaderRequireEditMessage:
          "Une fois votre activité créée, vous aurez la possibilité d'ajouter des images supplémentaires.",
      },
      create: {
        success: 'Activité créée',
      },
    },
    companies,
    error: {
      connectionError: 'Erreur réseau',
    },
    hi: 'Salut',
    pageTitle: {
      myAccount: 'Mon compte',
    },
    paymentMethod: {
      // TODO: remove that
      CB: 'Carte bleue',
      CB_MANUAL: 'Carte bleue (manuel)',
      CHECK: 'Chèque',
      HOLIDAY_CHECK: 'Chèque vacances',
      CASH: 'Espèces',
      EVENT_BRITE: 'EventBrite',
      AMEX: 'AMEX',
      BANK_TRANSFER: 'Virement',
      CREDIT_ACCOUNT: 'Compte interne (crédit)',
      SUBSCRIPTION_CB: 'Paiement automatique CB',
      OTHER: 'Divers',
    },
    errors: {
      end_before_start: 'La date de fin doit être après la date de début',
      start_after_end: 'La date de début doit être antérieure à la date de fin',
    },
    members: {
      form: {
        title: 'Nouveau membre',
      },
    },
    common: {
      items: 'éléments',
      skip: 'Passer',
      level: 'Niveau',
      activePass: 'pass actif',
      invoices: 'Factures',
      download: 'Télécharger',
      description: 'Description',
      hourSmall: 'h',
      daySmall: 'j',
      minuteSmall: 'min',
      export: 'Exporter',
      generate: 'Générer',
      tax: 'TVA',
      uploadOneImage: {
        new: 'Glisser et déposer ou cliquer ici pour ajouter une image',
        edit: "Glisser et déposer ou cliquer ici pour changer l'image",
      },
      buy: 'Acheter',
      establishments: 'Lieux',
      notes: 'Notes',
      add: 'Ajouter',
      loading: 'Chargement...',
      show: 'Voir',
      delete: 'Supprimer',
      previous: 'Précédent',
      firstname: 'Prénom',
      lastname: 'Nom de famille',
      save: 'Enregistrer',
      saveAndAdd: 'Enregistrer et ajouter à nouveau',
      booking: 'Réservation',
      from: 'Du',
      until: "Jusqu'au",
      paymentMethod: 'Méthode de paiement',
      activity: 'Activité',
      datetime: 'Séance',
      paymentPack: 'Abonnement',
      amount: 'Montant',
      continue: 'Continuer',
      credit_s: 'Crédit(s)',
      NA: 'Non renseigné',
      price: 'Prix',
      priceIncludingTax: 'Prix TTC',
      sports: 'Sports',
      credits: 'Crédits',
      create: 'Créer',
      or: 'ou',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      name: 'Nom',
      status: 'Status',
      ok: 'ok',
      seeMore: 'Afficher',
      coach: 'Professeur',
      coaches: 'Professeurs',
      company: 'Société',
      sport: 'Sport',
      filterBy: 'Filtrer par : ',
      edit: 'Modifier',
      merge: 'Fusionner',
      activities: 'Activités',
      email: 'Email',
      show_more: 'Voir +',
      showDetails: 'Voir détails',
      yes: 'Oui',
      no: 'Non',
      sort: 'Trier',
      contact: 'Contact',
      members: 'Mes utilisateurs',
      transactions: 'Mes transactions',
      selected: 'Séléctionné(s)',
      pass: 'Pass',
      booking_s: 'Séance(s)',
      offers: 'Séances',
      date: 'Date',
      nothing: 'Aucun',
      bookings: 'Réservations',
      places: 'Lieux',
      male: 'Homme',
      female: 'Femme',
    },
    pagination: {
      rowPerPage: 'Eléments par page',
      outOf: ' sur ',
    },
    offer: {
      attendant: 'présent(s)',
      nonAttendant: 'absent(s)',
      maxBookingsNb: 'places',
      effectif: 'Effectif',
      sizeOfWaitingList: "Taille de la liste d'attente",
      offersPendingChange: 'Séances qui seront modifiées :',
      offersPendingDelete: 'Séances qui seront suprimées :',
      noPackAvailableForOfferPurchase:
        'Aucun abonnement compatible avec cette séance !',
      noConsumerPackAvailableForPurchase:
        'Aucun abonnement compatible possédé par ce membre !',
      backToCalendar: 'Calendrier',
      previousOffer: 'Séance précédente',
      nextOffer: 'Séance suivante',
      disabled: 'annulé',
      substitute: 'Remplaçant',
      compatiblePacks: 'Abonnements compatibles',
      noCompatiblePacks: "Aucun abonnement n'est compatible avec cette séance",
      extraordinaryEstablishment: '(lieu temporaire)',
      addInvoice: 'Facturer',
      myBookings: 'Réservations',
      hasntBooked: 'Non inscrit',
      hasBooked: 'Inscrit',
      createBooking: 'Inscrire',
      reCreateBooking: 'Réinscrire',
      noQuickInvoiceOpened: 'Aucune facturation ouverte',
      myOpenedInvoices: 'Factures rapides',
      manageOffer: 'Gérer mes réservations',
    },
    shop: {
      supplier_price: 'Prix fournisseur',
      myShop: 'Mon magasin',
      subShop: {
        delete: {
          explain:
            "Êtes-vous sûr de vouloir supprimer cette catégorie ? Tous les éléments qu'elle contient seront également supprimés",
          title: 'Suppression',
        },
      },
      ht: 'HT',
      noProvisionUpdates: 'Aucun stock',
    },
    form: {
      waiting_list_max_size: "Taille de la liste d'attente",
      address: {
        streetNumber: 'N°',
        addressLine1: 'Adresse',
        addressLine2: "Complément d'adresse",
        city: 'Ville',
        country: 'Pays',
        zipcode: 'Code postal',
      },
      login: {
        changePasswordTitle: 'Modification du mot de passe',
        password: 'Mot de passe',
        confirmPassword: 'Confirmer',
        passwordTooEasy: 'Veuillez complexifier votre mot de passe',
        passwordChangedSuccess: 'Mot de passe modifié avec succès !',
        passwordMismatch: 'Les mots de passe ne correspondent pas',
      },
      shop: {
        subShop: {
          nameTitle: 'Nouvelle catégorie',
          namePlaceholder: 'Jus de fruits',
          createOrUpdate: {
            success: 'Catégorie enregistrée avec succès',
            error: "Impossible d'enregsitrer la catégorie",
          },
          delete: {
            success: 'Catégorie supprimée',
            error: 'Impossible de supprimer la catégorie',
          },
        },
        item: {
          create: 'Ajouter un article',
          unlimitedProvision: 'Pas de gestion du stock',
          marketplace_enabled: 'Disponible sur marketplace web',
          deleteTitle: 'Suppression',
          deleteExplain:
            'Attention cette suppression est définitive, aucun client ne pourra plus acheter ce produit, les stocks seront supprimés.',
          updateProvisions: {
            success: 'Stock mis à jour',
            error: "Erreur lors de l'enregistrement du stock",
          },
          modifyProvisions: 'Mettre à jour le stock',
          updateProvisionExplain:
            "Entrez l'apport à votre inventaire. Celui-ci sera additionné à votre stock actuel",
          updateProvisionTitle: 'Modification du stock',
          createOrUpdate: {
            success: 'Enregistré',
            error: "Erreur lors de l'enregistrement",
          },
          delete: {
            success: 'Elément supprimé',
            error: 'Erreur lors de la suppression',
          },
          add: 'Ajouter un élément',
          subtitle: 'Sous-titre',
          description: 'Description',
          provisions: 'Stock',
          name: 'Nom',
          price: 'Prix',
          tva: 'TVA',
        },
      },
      booking: {
        delete: {
          success: 'Réservation supprimée',
          error: 'Erreur lors de la suppression',
        },
      },
      member: {
        rgpd: {
          email: 'Accepte les notification par email',
          sms: 'Accepte les notifications SMS',
        },
        createOrUpdate: {
          error: "Erreur lors de l'enregistrement de la note",
          success: 'Note enregistrée',
        },
        delete: {
          error: 'Erreur lors de la suppression de la note',
          success: 'Note supprimée',
        },
        phone: 'Téléphone',
        rgpdTitle:
          'Moyen de communication accepté par le membre (alerte annulation, modification, etc...)',
        birthdayYear: 'Année de naissance',
        referenceNumber: "Numéro d'adhérent",
        referenceNumberHelper:
          '(optionnel) si vide un numéro sera automatiquement créé',
      },
      metaActivity: {
        cantAddSameName: 'Une activité du même nom existe déjà !',
      },
      signup: {
        typePhone: 'Tél. portable *',
        confirmPasswordLabel: 'Confirmation',
        confirmPassword: 'Mot de passe',
        rgpdTitle:
          "Comment préférez-vous que les professeurs vous contactent pour les annulations/changement d'heure ?",
        communication: {
          email: 'par email',
          sms: 'par SMS',
        },
        signupButton: "S'inscrire",
        iAcceptPrivacyPolicy: "J'accepte les ",
        privacyPolicy: "Conditions générales d'utilisation",
      },
      quickInvoice: {
        totalPurchase: 'Achats',
        totalPayment: 'Paiements',
        paymentDue: 'Paiement dû',
      },
      invoice: {
        dateStartPaymentPack: "Début de l'abonnement le",
        backToInvoiceItemList: 'Retour à la liste',
        title: 'Enregistrer un paiement',
        paymentLabel: 'Ajouter une transaction',
        offerHelper: 'Cette séance sera crédité au membre',
        paymentPackHelper: 'Cet abonnement sera crédité au membre',
        noPayedObject: 'Aucun',
        objectTypeLabel: 'Objet à créditer',
        activityHelper: "Choisissez l'activité puis la séance",
        titleUnevenInvoice: 'Facture non-équilibrée',
        explainUnevenInvoice: ({ totalInvoiceItems, totalPayments }) =>
          `Le total s'élève à ${totalInvoiceItems}€ quand le total des paiements est à ${totalPayments}€. Le compte interne du membre sera crédité/débité pour équilibrer.`,
      },
      payment: {
        status: 'Status',
        paid: 'Payé',
        unpaid: 'En attente',
        noPaymentExtraInfo: 'Aucune information additionnelle',
        additionalInformationLabel: 'Information',
        additionalInformationHelper:
          "(optionnel) numéro du chèque, date d'encaissement...",
      },
      offer: {
        levelChangeWarning:
          'Si vous modifiez le niveau du cours, cette modification sera effective pour toutes les séances futures. Toute autre modification enregistrée ici (établissement, prix, jour de la semaine...) sera donc appliquée à toutes les séances.',
        coachChangeWarning:
          'Si vous modifiez le professeur, cette modification sera effective pour toutes les séances futures. Si ce n\'est pas ce que vous souhaitez, utilisez le champ "Remplaçant". Toute autre modification enregistrée ici (établissement, prix, jour de la semaine...) sera donc appliquée à toutes les séances.',
        establishmentChangeWarning:
          'Si vous modifiez l\'établissement, cette modification sera effective pour toutes les séances futures. Si ce n\'est pas ce que vous souhaites, utilisez le champ "Etablissement temporaire". Toute autre modification enregistrée ici (jour de la semaine, prix, remplaçaant, professeur...) sera donc appliquée à toutes les séances.',
        substituteCoachLabel: 'Remplaçant',
        coachLabel: 'Professeur',
        establishmentLabel: 'Etablissement',
        substituteEstablishmentLabel: 'Etablissement (lieu temporaire)',
        warningPackonEdit:
          "Les changements sur les séances risquent de les rendre incompatibles avec certains abonnements. Après la modification veuillez prendre le temps de vérifier qu'ils resteront compatible avec les éventuels changements de lieu / professeur.",
        deleteTitle: 'Supprimer la séance',
        cancelTitle: 'Annuler la séance',
        changeDate: "Modifier l'horaire / date",
        changeCoach: 'Modifier le professeur',
        changeEstablishment: 'Modifier le lieu',
        explainRecursiveOfferDelete:
          'Voulez-vous supprimer TOUTES les séances similaires ?',
        explainRecursiveOfferEdit:
          'Voulez-vous modifier TOUTES les séances similaires selon ces nouvelles conditions ?',
        explainNotificationOnEdit:
          'Voulez-vous informer vos clients de cette modification ?',
        delete: {
          buttonHardDelete: 'Supprimer',
          explainHardDelete:
            'Supprimer la séance de la liste ? Attention celle-ci deviendra invisible, cette opération est irréversible ! Si la séance contient des réservations, elle ne sera pas supprimée.',
          explainCreditBack: 'Rembourser les crédits dépensés aux clients',
          explainNotify: 'Envoyer une alerte aux clients ayant réservé',
          explainModalities:
            'Attention, cette modification est définitive. Votre séance ne sera plus visible par les clients finaux. Vous pourrez toujours y accéder.',
        },
      },
      paymentPack: {
        newMemberOnly: 'Uniquement pour les nouveaux clients',
        managerOnly: 'Invisible pour les clients',
        helper: {
          // eslint-disable-next-line
          name: "Nom de l'abonnement",
          // eslint-disable-next-line
          price: "Prix pour le client pour l'abonnement",
          starting_date:
            'Début de validité du pass, laisser vide pour le rendre valable immédiatement',
          // eslint-disable-next-line
          ending_date:
            "Fin de validité du pass, laisser vide pour qu'il reste toujours actif",
          // eslint-disable-next-line
          credits:
            'Nombre de crédits disponibles, laisser vide pour le rendre illimité',
          maxBookingPerWeek: 'Laisser vide pour ne pas imposer de limite',
        },
        timeSettingsTitle: "Validité de l'abonnement",
        generalSettingsTitle: 'Général',
        validByDuration: 'Abonnement valide N jours après achat',
        validByDaterange: 'Abonnement valide sur un créneau de date précis',
        durationDays: 'Durée de validité (jours) si applicable',
        durationDaysHelperText:
          "Période en jours pour laquelle l'abonnement sera valide après achat ",
        durationMonths: 'Durée de validité (mois) si applicable',
        durationMonthsHelperText: "S'ajoute au nombre de jours",
        durationYears: 'Durée de validité (années) si applicable',
        durationYearsHelperText: "S'ajoute au nombre de jours et de mois",
        restrictionsTitle: 'Restrictions',
        maxBookingPerWeek: 'Utilisation max par semaine',
        noneMeansAll: 'Laisser vide pour tout autoriser',
        update: {
          success: 'Abonnement: opération effectuée avec succès',
          error: "Abonnement : erreur lors de l'opération",
        },
        delete: {
          title: "Suppression de l'abonnement :",
          askConfirmation:
            "Attention ! Cette opération est définitive. L'abonnement ne sera plus visible et deviendra indisponible à l'achat.",
          thereAreConsumers:
            "Attention ! Des membres ont acheté cet abonnement, si vous le supprimez ces derniers pourront toujours utiliser leurs crédits restants. Vous pouvez les réduire manuellement à zéro ici.\n\nL'abonnement n'apparaitra plus dans votre magasin pour les nouveaux acheteurs.",
        },
      },
      title: 'Titre',
      specific_info: 'Description',
      pleaseEnterYourSMSCode: 'Veuillez entrer le code envoyé par SMS',
      code: 'Code',
      signUpTitle: 'Inscription',
      SMSSignInTitle: 'Connexion SMS',
      signInPhoneInstruction:
        'Veuillez entrer votre numéro de téléphone, un code de confirmation vous sera envoyé par SMS',
      password: 'Mot de passe',
      // eslint-disable-next-line
      default_waiting_list_max_size: "Taille de la liste d'attente",
      generateOffers: 'Créer les séances',
      offersWillBeGenerated: 'séances vont être crées',
      offerWillBeGenerated: 'séance va être créée',
      recurrence: 'Récurrence',
      notRecurrent: 'Une seule séance',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel',
      timeSettings: 'Horaires & dates',
      firstSessionOn: 'Première séance le',
      firstSessionAt: 'à',
      lastSession: 'Dernière séance le',
      duration_minute: 'Durée',
      priceCategory: 'Facturation',
      credits: 'Crédit (prix)',
      price: 'Prix',
      caracteristics: 'Caractéristiques',
      effectif: 'Effectif',
      level: 'Niveau',
      addingSessionFor: 'Création de séance pour : ',
      establishment: 'Etablissement',
      coach: 'Professeur',
      newMember: 'Nouveau membre',
      newCoach: 'Nouveau Professeur',
      firstname: 'Prénom',
      lastname: 'Nom de famille',
      gender: 'Sexe',
      birthdayYear: 'Année de naissance',
      birthday: 'Date de naissance',
      clearDate: 'Effacer',
      phone: 'Numéro de téléphone',
      email: 'Adresse email',
      description: 'Description',
      send: 'Envoyer',
      discard: 'Annuler',
      name: 'Nom',
      SCT: 'Sport',
      default_price: 'Prix',
      default_credits: 'Prix (crédits)',
      default_last_booking_minutes: 'Dernière réservation avant',
      // eslint-disable-next-line
      default_last_discard_minutes: "Dernière annulation jusqu'à",
      default_duration_minutes: 'Durée de la séance',
      newMetaActivity: 'Nouvelle activité',
      zeroMinute: '0 min',
      quarterHour: '15 min',
      halfHour: '30 min',
      halfAndQuarterHour: '45 min',
      oneHour: '1h',
      oneHourAndHalf: '1h30',
      twoHour: '2h',
      fourHour: '4h',
      sixHour: '6h',
      eightHour: '8h',
      oneDay: '1 journée',
      twoDays: '2 journées',
      oneWeek: '1 semaine',
      tenDays: '10 jours',
      twoWeeks: '2 semaines',
    },
    member,
    coach,
    marketing: {
      dashboard: 'Tableau de bord',
      conversionRate: 'Taux de conversion',
      sales: 'Ventes',
      averageBuy: 'Panier moyen',
      totalBuy: 'Total CA',
      action: 'Action',
      SMSSent: 'SMS envoyés',
      EmailSent: 'Emails envoyés',
      notificationsSent: 'Notifications envoyées',
      clientsReached: 'Clients touchés',
      criterias: 'Critères',
      strategy: 'Stratégie : ',
      estimatedTarget: 'Part des utilisateurs concernés',
      message: 'Message',
      after: 'Après ',
      offersMatching: ' séances similaires',
      promoTitle: 'Offre de réduction',
      promo: 'Réduction de ',
      noPromo: 'Aucun',
    },
    consumer: {
      myPaymentPacks: 'Mes abonnements',
      company: 'Club',
      help: {
        areYouSureCancelBookingOption:
          'Voulez-vous vraiment annuler votre option ?',
        explainCancelBookingOption:
          "La suppression est définitive, si vous prenez de nouveau une option sur cette séance votre place sur la liste d'attente sera réinitialisée.",
      },
      booking: {
        cancelBooking: 'Annuler la réservation',
        discardBookingTitle: 'Annuler la réservation',
        discardPossibleExplain:
          'Êtes-vous sûr de vouloir annuler cette réservation ? Votre crédit sera de nouveau utilisable.',
        discardImpossibleExplain:
          'Êtes-vous sûr de vouloir annuler cette réservation ? Vous annulez trop tard et votre abonnement ne sera pas recrédité (conditions générales du club).',
        confirmBooking: 'Confirmer',
        waitingSlot: 'En attente',
        myFutureBookings: 'Prochaines séances',
        myPastBookings: 'Mes précédentes réservations',
        // eslint-disable-next-line
        myOptions: "Réservations sur liste d'attente",
        // eslint-disable-next-line
        noBookingOptions: "Aucune réservation sur liste d'attente",
        noFutureBookings: 'Aucune réservation prévue',
        noPastBookings: 'Aucune réservation passée',
        cancelOption: 'Annuler',
      },
    },
    navigation: {
      order: 'Pedidas',
      workshopActivities: 'Eventos',
      invoice: 'Facturas',
      alpha: 'en desarollo',
      coachPerformance: 'Profesores',
      beta: 'beta',
      consumer: {
        pass: 'Abonos',
        bookings: 'Mis reservas ',
        profile: 'Mi perfil',
        order: 'Mis pedidas',
      },
      reporting: 'Informes',
      search: 'Buscar',
      dashboard: 'Marcador',
      activity: 'Mis Actividades',
      calendar: 'Calendario',
      message: 'Marketing',
      member: 'Alumnos',
      establishment: 'Locales',
      payment: 'Pagos',
      logoff: 'Desconectarse',
      goBack: 'Volver',
      pass: 'Abonos',
      settings: 'Parametros',
      myClub: 'Mi Club',
      subscription: 'Suscripciones',
    },
    invoice: {
      choseDateTitle: 'Date de facturation',
      reverted: 'Annulé',
      revert: 'Annuler la facture',
      choseDate: 'Date de facturation',
      explainDateChoser:
        'Veuillez choisir la date de facturation. Les paiements par CB seront immédiatement encaissés quelle que soit la date choisie',
      revertImpossibleExplainSubscription:
        "Cette facture fait partie d'une souscription, vous ne pouvez pas annuler une facture encaissée liée à une souscription, mais vous pouvez arrêter la souscription",
      revertExplainPayment:
        "Les paiements par carte bleue seront reversés sur l'accompte du membre. Tous les autres modes de paiement seront supprimés.",
      revertExplainCredits:
        'Les débit/crédit sur le compte du membre seront inversés.',
      revertExplainPacks:
        'Les abonnements seront annulés ainsi que TOUTES les réservations associées',
      revertExplainShop:
        'Les achats du magasin seront annulés et les stocks réinitialisés.',
      invoiceReverted: 'Facture annulée',
      finalize: 'Finaliser la facture',
      explainFinalize:
        "Attention ! Une facture finalisée n'est plus modifiable, de plus tous les paiements marqués en attente d'encaissement seront considérés comme encaissés. Une fois la facture finalisée vous pourrez l'exporter en tant que PDF",
      forms: {
        update: {
          success: 'Facture mise à jour avec succès',
        },
        create: {
          success: 'Facture enregistrée - Membre crédité',
        },
        error: "Erreur lors de l'enregistrement - Annulé",
      },
    },
    payment: {
      credit: 'Crédit',
      products: 'articles',
      invoiceRevertedThusNotEditable:
        "La facture a été annulée et n'est plus modifiable",
      topUp: 'Crédit',
      invoiceFinalizedThusNotEditable:
        "La facture a été finalisée et n'est donc plus modifiable",
      actions: 'Actions',
      bookWithUnlimitedPack: 'Réserver',
      noCreditLeft: 'Pas assez de crédit',
      noBookingsLeftOnPack: 'Abonnement épuisé pour cette semaine',
      yourBasket: 'Votre achat',
      availablePaymentPacks: ' abonnements compatibles',
      payWithNCredits1: 'Réserver (',
      payWithNCredits2: 'crédit)',
      pay: 'Payer',
      type: 'Type',
      amount: 'Montant',
      fullyPaid: 'Status',
      consumer: 'Client',
      // eslint-disable-next-line
      paymentDate: "Date d'achat",
      object: 'Description',
      addInvoiceItem: 'Ajouter à la facture',
      addOffer: 'Séance',
      addPaymentPack: 'Abonnement',
      updateInvoiceVoucher: 'Ajouter une réduction',
      voucher: 'Réduction',
      total: 'TOTAL',
      paymentMethodStripe: 'Carte bleue',
      paymentMethodCheck: 'Chèque',
      paymentMethodCash: 'Espèces',
      invoice: 'Facture',
      paymentMethod: 'Mode de paiement',
      creditAccountBalance: 'Accompte actuel : ',
      paymentMethods: {
        CB: 'Carte bleue',
        CB_MANUAL: 'Carte bleue (manuel)',
        CHECK: 'Chèque',
        HOLIDAY_CHECK: 'Chèques vacances',
        CASH: 'Espèces',
        EVENT_BRITE: 'EventBrite',
        AMEX: 'AMEX',
        BANK_TRANSFER: 'Virement',
        CREDIT_ACCOUNT: 'Compte interne (crédit)',
        SUBSCRIPTION_CB: 'Paiement automatique CB',
        OTHER: 'Divers',
      },
      paymentItemsListTitle: 'Paiements enregistrés',
      noPaymentItem: 'Aucun paiement enregistré',
      addThisPaymentItem: 'Paiement',
      status: 'Encaissé',
      stillUnpaid: 'Reste à encaisser : ',
      isRecurring: 'Paiement en plusieurs fois',
      intervalMonth: 'Mensuel',
      intervalWeek: 'Hebdomadaire',
      billingAnchor: 'Premier paiement',
      nbInterval: 'Nombre de prélèvements',
      intervalType: 'Fréquence de paiement',
      stripePaymentWillBeCashedOutOnInvoiceValidation:
        "La CB ne sera débitée qu'après la sauvegarde de la facture",
      createInvoice: 'Paiement',
      toBill: 'Facturer',
      toSubscribe: 'Souscrire',
    },
    paymentPack,
    paginatedList: {
      isEmpty: 'Aucunes données à afficher',
    },
    login: {
      welcome: 'Bienvenue !',
      signUpConsumer: 'Pas encore de compte ?',
      invalidPhone: 'Numéro de téléphone inconnu',
      choseYourUserspace: 'Je suis',
      loginAsPro: 'Un gérant',
      loginAsConsumer: 'Un élève',
      noAccount: 'Pas encore compte ? Créez-en un ici !',
      password: 'Mot de passe',
      authError: 'Email ou mot de passe erroné',
      forgottenPassword: 'Mot de passe oublié',
    },
    calendar: {
      modifyOffer: 'Modifier',
      deleteOffer: 'Annuler',
      allDay: 'journée',
      previous: '<',
      next: '>',
      // eslint-disable-next-line
      today: "aujourd'hui",
      month: 'mois',
      week: 'semaine',
      day: 'jour',
      agenda: 'Agenda',
      date: 'date',
      time: 'heure',
      event: 'séance',
      showMore: (total) => `+ ${total} séance(s) supplémentaire(s)`,
      showMonth: 'Affichage mois',
      showWeek: 'Affichage semaine',
      pleaseSelectOffer:
        'Sélectionnez une séance pour voir les membres inscrits',
    },
    activity: {
      forms: {
        create: {
          success: 'Activité sauvegardée',
          error: "Impossible de sauvegarder l'activité",
        },
        update: {
          success: 'Activité mise à jour',
          error: "Impossible de mettre à jour l'activité",
        },
      },
      nextSlotAt: 'Prochaine séance le ',
      settings: 'Paramètres',
      lastBookingBeforeMinutes:
        'Avant le début du cours, dernière réservation possible',
      lastDiscardBeforeMinutes:
        'Avant le début du cours, dernière annulation possible',
      addOffers: 'Ajouter des séances',
      addActivity: 'Ajouter une activité',
      name: 'Titre',
      noNextSlot: 'Plus aucune séance programmée',
      // eslint-disable-next-line
      grossVolume: "Chiffre d'affaire",
      totalCustomers: 'Total réservations',
      fillrate: 'Remplissage moyen',
      description: 'Description',
      category: 'Sport',
      offersThisDay: 'Séances ce jour :',
      noOfferThisDay:
        'Pas de séance, sélectionnez une autre date sur le calendrier',
      orNcredits1: '(ou ',
      orNcredits2: ' credits)',
      packsAvailable: 'Eligible aux pass :',
      reviews: 'Avis clients: ',
    },
    establishment,
    search,
    workshopActivity: {
      addWorkshopActivity: 'Ajouter un atelier',
      imageUploaderRequireEditMessage:
        "Une fois votre atelier créé, vous aurez la possibilité d'ajouter des images supplémentaires.",
      lastBookingBeforeMinutes:
        "Avant le début de l'atelier, dernière réservation possible",
      lastDiscardBeforeMinutes:
        "Avant le début de l'atelier, dernière annulation possible",
      forms: {
        create: {
          success: 'Atelier sauvegardé',
          error: "Impossible de sauvegarder l'atelier",
        },
        update: {
          success: 'Atelier mis à jour',
          error: "Impossible de mettre à jour l'atelier",
        },
      },
    },
    booking: {
      wasRefunded: 'Remboursé',
      success: 'Réservation enregistrée',
      revertBookingTitle: "Annuler l'inscription",
      revertBookingExplain: (name: string, offerIsAvailable) => {
        if (offerIsAvailable) {
          return `Êtes-vous sûr de vouloir supprimer la réservation de ${name} ? Les crédits utilisés seront recrédités. Si vous ne souhaitez pas recréditer le membre, passez la réservation en Absent en cliquant sur le bouton "Présent"`;
        }
        return `La réservation de ${name} sera supprimé. La séance a déjà été annulée et les crédits ne seront pas remboursés si vous n'avez pas coché "rembourser" lors de l'annulation`;
      },

      revertBookingWithInvoiceImpossibleExplain:
        'Cette réservation a déjà été payée par le membre et ne peut être annulée. Toutefois vous pouvez passer la réservation en "Absent"',
      attend: 'Présent',
      doNotAttend: 'Absent',
      discard: 'Annuler',
      // eslint-disable-next-line
      onWaitingList: "Sur liste d'attente",
      onHold: 'En attente',
      waitingUserConfirmation: 'En attente de confirmation client',
      confirm: 'Encaisser',
      validated: 'Payé',
      pending: 'Non encaissé',
      cancelled: 'Annulé',
      cancelBooking: 'Annuler',
      noBookingOnThisOffer:
        'Aucune réservation enregistrée sur cette séance pour le moment',
      last: 'Dernière:',
      next: 'Prochaine:',
      fillRate: 'Taux de remplissage',
      nb_booking: 'Nb de place',
      status: {
        // eslint-disable-next-line
        null: "liste d'attente",
        true: 'inscrit',
        false: 'annulé',
      },
      sources: {
        MOB: 'Mobíl',
        WEB: 'Web',
        MAN: 'Manual',
      },
      lastBooking: 'Proxima clase',
      // eslint-disable-next-line
      waiting: 'Lista de espera',
      confirmed: 'Confirmados',
      free: 'huecos disponibles',
      seeCustomers: 'Ver las reservas',
    },
    level: {
      all: 'Todos los niveles',
      beginner: 'Principiente',
      intermediate: 'Intermediaro',
      intermediary: 'Intermédiaire', // no_translate
      advanced: 'Avanzado',
    },
    time: {
      weekday: {
        sunday: 'Domingo',
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miercoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        satursday: 'Sabado',
      },
      monthShort: {
        january: 'Ene',
        february: 'Feb',
        march: 'Mar',
        april: 'Abr',
        may: 'May',
        june: 'Jun',
        july: 'Jul',
        august: 'Aug',
        september: 'Sep',
        october: 'Oct',
        november: 'Nov',
        december: 'Dic',
      },
      month: {
        january: 'Ene',
        february: 'Febrero',
        march: 'Marzo',
        april: 'Abril',
        may: 'Mayo',
        june: 'Junio',
        july: 'Julio',
        august: 'Augusto',
        september: 'Septiembre',
        october: 'Octubre',
        november: 'Noviembre',
        december: 'Deciembre',
      },
    },
    marketplace: {
      substitute: 'Sustituto',
      substituted: 'Ausente',
      backToCalendar: 'Volver',
      showMarketplace: 'Ver el calendario de ',
      noSessionToday: 'No hay clase hoy',
      bookButton: {
        book: 'Reservar',
        bookOption: 'Liste de espera',
        notAvailable: 'Cancelada',
        isPast: 'Pasada',
      },
      sessionThisDay: 'Clases de este día :',
      calendar: 'Calendario',
      workshop: 'Eventos',
      shop: {
        tabName: 'Tienda',
        noDescription: 'No hay descripción',
        addToCard: 'Añadir a la cesta',
        isEmpty: 'No hay productos en la tienda.',
      },
      checkout: {
        dialog: {
          title: 'Mi cesta',
          cancel: 'Volver a la tienda',
          goToDelivery: 'Continuar',
          goToPayment: 'Pagar',
        },
      },
      welcomeTo: 'Bienvenido en ',
      pass: 'Abonos',
      buyPack: 'Comprar',
      selector: {
        coach: { placeholder: 'Filtrar por profesores' },
        level: { placeholder: 'Filtrar por niveles' },
        establishment: { placeholder: 'Filtrar por locales' },
      },
    },
    appbar: {
      title: {
        planning: 'Calendario',
        allCoachPerformance: 'Resumen del profesor',
        mergeMember: 'Fusionar alumnos',
        dashboard: 'Marcador',
        shopManager: 'Mi Tienda',
        coachList: 'Profesores',
        offerManagement: 'Reservas',
        metaActivity: 'Actividades',
        workshopActivityList: 'Eventos',
        WorkshopActivityFormPage: 'Formulario Evento',
        metaActivityEditForm: 'Formulario de Actividad',
        metaActivityList: 'Actividades',
        metaActivityFormPage: 'Formulario de Actividad',
        offerFormPage: 'Crear una clase',
        coachPerformance: 'Pago del profesor', // no_translate
        coachFormPage: 'Formulario del profesor',
        invoiceFormPage: 'Editar factura',
        invoiceCreatePage: 'Facturar',
        invoiceList: 'Mis transaciones',
        paymentPackFormPage: 'Crear un abono',
        paymentPackList: 'Abonnements',
        members: 'Alumnos',
        member: 'Alumno',
        memberFormPage: 'Formulario del alumno',
        establishmentList: 'Locales',
        establishmentFormPage: 'Formulario del local',
        marketingRule: 'Stratégies marketing',
        subscriptions: 'Souscription',
        marketingDashboard: 'Marketing',
        reportingDashboard: 'Informes',
        searchResults: 'Buscar',
        settings: 'Parametros',
        orderList: 'Pedidas',
        orderDetail: 'Detalles de las pedidas',
      },
    },
    countdown: {
      hours: 'Horas',
      minutes: 'Minutos',
      seconds: 'Segundos',
    },
  },
};
