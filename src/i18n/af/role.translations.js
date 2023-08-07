const { RoleType } = require('@bsport/common/lib/master-data/user-role');

const {
  OWNER_ROLE,
  STAFF_ROLE,
  REPORT_ROLE,
  RESTRICTED_STAFF_ROLE,
  CHECKIN_APP_ROLE,
  ADMIN_ROLE,
} = require('../../libs/role/role-types');

exports.default = {
  pageTitle: 'Staff',
  userRoles: 'Comptes Staff',
  permissions: 'Rôles disponibles',
  explainStaffDo:
    'Un accès staff permet de se connecter à https://backoffice.bsport.io via ordinateur ou mobile',
  explainStaffDoNot:
    "Un accès staff ne permet pas de se connecter à l'application mobile (professeur et élèves uniquement)",
  overbookingForbidden:
    'Les droits qui vous ont été attribués en temps que staff ne vous permettent pas de dépasser le nombre maximum de réservations.',
  forms: {
    user: {
      create: {
        buttonLabel: 'Ajouter un accès',
        title: 'Création de compte staff',
        generalInfo: {
          title: 'Informations générales',
          email: {
            label: 'Email',
          },
          firstName: {
            label: 'Prénom',
          },
          lastName: {
            label: 'Nom',
          },
        },
        role: {
          title: 'Rôles',
          selectRole: {
            label: 'Sélectionner un rôle',
            topLabel: 'Role',
          },
        },
        franchisees: {
          title: 'Accès franchisés',
          warning:
            "Sélectionnez à quels franchisés aura accès ce compte staff. Laissez vide pour donner accès à l'ensemble des franchisés.",
        },
        cancel: 'Annuler',
        submit: 'Valider',
        register: 'Enregister',
      },
      delete: {
        title: 'Suppression compte staff',
        content: 'Êtes-vous sûr de vouloir supprimer ce compte ?',
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
      selectCoach: 'Selectionner les professeurs',
      selectFranchisees: 'Sélectionner des franchisés',
      selectFranchiseesDisabled:
        'This setting is only for custom role (not Admin or Owner)',
      ifEmptySelectAll: 'Laisser vide pout tout sélectionner',
      commissionHeader: 'Taux de commission',
    },
    role: {
      create: {
        buttonCreate: 'Ajouter un rôle  ',
        title: 'Création de rôle',
        name: 'Nom',
        description: 'Description',
        restrictedUrl: 'URL Whitelist',
        restrictedUrlExplain:
          "Utilisez ce paramètre pour définir une whitelist d'URLs pour ce rôle. Seules les URLs listées ci-dessous seront accessibles par le staff associé à ce rôle",
        restrictedUrlPlaceholder: 'ex: /member/',
        permissions: 'Permissions',
        showAdvanced: 'Voir plus',
        authorizeManagerAction: "Donner au staff le contrôle d'un manager",
        authorizeManagerExplain:
          "Le staff portant ce rôle pourra forcer les actions comme le manager : forcer la réservation d'une séance dans une salle indisponible, forcer la réservation avec un professeur indisponible, dépasser le nombre maximal de membres inscrits à une séance.",
      },
      delete: {
        title: 'Suppression rôle',
        content: 'Êtes-vous sûr de vouloir supprimer ce rôle ?',
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
      failDelete: {
        title: 'Suppression rôle impossible',
        content:
          'Un staff possède encore ce rôle, vous ne pouvez pas le supprimer.',
        close: 'Fermer',
      },
      franchise: {
        create: {
          title: 'Création de rôle',
          steps: {
            masterAccount: 'Accès Master account',
            franchisee: 'Accès franchisé',
          },
          buttons: {
            next: 'Suivant',
            previous: 'Précédent',
            close: 'Fermer',
          },
        },
      },
    },
  },
  rolePermissions: {
    appbarButtons: {
      _label: 'Actions appbar',
      ledger: {
        _label: 'Livret de caisse',
      },
      notificationCenter: {
        _label: 'Centre de notification',
      },
      communicationAlerts: {
        _label: 'Notification de messages',
      },
    },

    search: {
      _label: 'Recherche membre',
    },
    offer: {
      _label: 'Séances',
      create: {
        _label: 'Création',
      },
      delete: {
        _label: 'Annulation',
      },
      edit: {
        _label: 'Modification',
      },
    },
    member: {
      _label: 'Membre',
      create: {
        _label: 'Création de membre',
      },
      retrieve: {
        _label: 'Accès fiche membre',
      },
      edit: {
        _label: 'Modification',
      },
      search: {
        _label: 'Recherche',
      },
    },
    navigationMenu: {
      _label: 'Menu de navigation',
      dashboard: {
        _label: 'Dashboard',
      },
      calendar: {
        _label: 'Calendrier',
      },
      schedule: {
        _label: 'Emploi du temps',
      },
      myClub: {
        _label: 'Mon Club',
        activities: {
          _label: 'Activités',
        },
        workshops: {
          _label: 'Ateliers',
        },
        appointments: {
          _label: 'Rendez vous',
        },
        teachers: {
          _label: 'Professeurs',
        },
        establishments: {
          _label: 'Etablissements',
        },
        programs: {
          _label: 'Programmes',
        },
        replacement: {
          _label: 'Remplacement',
        },
      },
      products: {
        _label: 'Produits',
        paymentPack: {
          _label: 'Cartes de cours',
        },
        privatePass: {
          _label: 'Cartes RDV',
        },
        shop: {
          _label: 'Magasin',
        },
        packs: {
          _label: 'Packs',
        },
        giftcards: {
          _label: 'Cartes de cadeaux',
        },
        promotions: {
          _label: 'Promotions',
        },
        contracts: {
          _label: 'Contrats',
        },
      },
      payments: {
        _label: 'Paiements',
        billings: {
          _label: 'Factures',
        },
        directDebits: {
          _label: 'Prélèvements',
        },
        orders: {
          _label: 'Commandes',
        },
        expenses: {
          _label: 'Dépenses',
        },
        installments: {
          _label: 'Payment en plusieurs fois',
        },
        teachers: {
          _label: 'Professeurs',
        },
        clockIn: {
          _label: 'Pointeuse horaire',
          selfClockIn: {
            _label: 'Pointer pour soi même',
          },
          clockInForOther: {
            _label: 'Pointer pour un autre staff',
          },
          canAccessHistory: {
            _label: "Accéder à l'historique des horaires",
          },
        },
      },
      marketing: {
        _label: 'Marketing',
        templates: {
          _label: 'Emails',
        },
        customForms: {
          _label: 'Formulaires',
        },
        smartlists: {
          _label: 'Smartlists',
        },
        notifications: {
          _label: 'Notifications',
        },
        strategies: {
          _label: 'Stratégies',
        },
        tags: {
          _label: 'Tags',
        },
      },
      digitalOffer: {
        _label: 'Offre digitale',
        videos: {
          _label: 'Bibliothèques vidéo',
        },
        playlists: {
          _label: 'Playlist',
        },
      },
      member: {
        _label: 'Membre',
      },
      reporting: {
        _label: 'Rapports',
      },
      settings: {
        _label: 'Paramètres',
        generals: {
          _label: 'Général',
        },
        marketplace: {
          _label: 'Paramètres marketplace',
        },
        widgets: {
          _label: 'Widget',
        },
        staffs: {
          _label: 'Staff',
        },
        personalization: {
          _label: 'Personnalisation',
        },
        mobilePersonalization: {
          _label: 'Personnalisation app',
        },
        coachUserspace: {
          _label: 'Espace professeur',
        },
        memberForms: {
          _label: 'Formulaire membre',
        },
        liveStreaming: {
          _label: 'Visioconférence',
        },
        transactionnalEmail: {
          _label: 'Emails transactionnels',
        },
        teacherPayrollRules: {
          _label: 'Règles de rémunération',
        },
        paymentMethods: {
          _label: 'Moyen de paiement',
        },
        company: {
          _label: 'Entreprise',
        },
        billing: {
          _label: 'Facturation',
        },
        waitingList: {
          _label: "Liste d'attente",
        },
        webShop: {
          _label: 'Magasin',
        },
        webHook: {
          _label: 'Webhook',
        },
        partnership: {
          _label: 'Partenariat',
        },
        quickBooks: {
          _label: 'QuickBooks',
        },
        activeCampaign: {
          _label: 'ActiveCampaign',
        },
        subscription: {
          _label: 'Abonnement bsport',
        },
        quicksale: {
          _label: 'Interface de vente rapide',
        },
      },
      tutorial: {
        _label: 'Tutoriel',
      },
    },
    franchiseMenu: {
      _label: 'Menu de navigation',
      franchises: {
        _label: 'Franchisés',
      },
      members: {
        _label: 'Membres',
      },
      products: {
        _label: 'Produits',
        paymentPackTemplates: {
          _label: 'Carte de cours',
        },
        privatePassTemplates: {
          _label: 'Carte de RDV',
        },
        couponTemplates: {
          _label: 'Promotions',
        },
        giftcardTemplates: {
          _label: 'Carte cadeau',
        },
      },
      emailTemplates: {
        _label: 'Emails',
      },
      notificationRules: {
        _label: 'Emails transactionnels ',
      },
      reporting: {
        _label: 'Rapports',
      },
      widgets: {
        _label: 'Widgets',
      },
      staff: {
        _label: 'Staff',
      },
      settings: {
        _label: 'Paramètres',
      },
      tag: { _label: 'Tags' },
    },
  },
  roleDescription: {
    [CHECKIN_APP_ROLE]: {
      name: 'Checkin tablette',
      description:
        // eslint-disable-next-line
        "Compte pour application d'auto-checkin (contactez votre chargé de compte bsport)",
    },
    [RESTRICTED_STAFF_ROLE]: {
      name: 'Checkin restreint',
      description: 'Accès seulement au checkin.',
    },

    [ADMIN_ROLE]: {
      name: 'Admin',
      description:
        // eslint-disable-next-line
        'Admin, même accès que Owner mais peut être supprimé/créé',
    },

    [STAFF_ROLE]: {
      name: 'Checkin étendu',
      description:
        'Accès à la gestion de la séance (modification et annulation), aux membres, et au checkin.',
    },

    [OWNER_ROLE]: {
      description:
        'Accès admin, aucune restriction, peut créer des comptes staff',
      name: 'Owner',
    },
    [REPORT_ROLE]: {
      description:
        'Accès uniquements aux rapports, utile pour vos comptables par exemple',
      name: 'Rapports',
    },
    [RoleType.USER_ROLE_QUICKSALE]: {
      description: "Accès uniquement à l'interface de vente rapide",
      name: 'Checkin interface de vente',
    },
  },
  objectLevelPermissions: {
    session: {
      _label: 'Gestion des séances',
      activity: {
        _label: 'Activités',
        allowed_actions: {
          create: { _label: 'Créer' },
          edit: { _label: 'Modifier' },
          delete: { _label: 'Supprimer' },
        },
      },
      workshop: {
        _label: 'Ateliers',
        allowed_actions: {
          create: { _label: 'Créer' },
          edit: { _label: 'Modifier' },
          delete: { _label: 'Supprimer' },
        },
      },
      privateSlot: {
        _label: 'Créneaux de rendez-vous',
        allowed_actions: {
          create: { _label: 'Créer' },
          edit: { _label: 'Modifier' },
          delete: { _label: 'Supprimer' },
        },
      },
    },
    member: {
      _label: 'Actions sur les membres',
      allowed_actions: {
        create: { _label: 'Ajouter un member' },
        readInfo: { _label: 'Voir les données personnelles' },
        editInfo: { _label: 'Editer les données personnelles' },
        delete: { _label: 'Supprimer un membre' },
        search: { _label: 'Rechercher des membres' },
        accessProfile: { _label: 'Accéder au profil des membres' },
        readBalance: { _label: 'Voir le solde des membres' },
        communication: { _label: 'Communiquer avec les membres' },
        manageNotification: { _label: 'Gérer les notications des membres' },
      },
    },
    billing: {
      _label: 'Facturation',
      allowed_actions: {
        takePayment: { _label: 'Encaisser un membre' },
        editBalance: { _label: 'Ajuster le solde des membres' },
        readInvoices: { _label: 'Voir les factures' },
        createInvoice: { _label: 'Facturer un membre' },
        readPaymentLink: { _label: 'Générer des liens de paiement' },
        cancelInvoice: { _label: 'Annuler des factures' },
        addPaymentMethod: { _label: 'Ajouter une méthode de paiement' },
        deletePaymentMethod: { _label: 'Supprimer une méthode de paiement' },
        partialRefundAsDiscount: {
          _label: 'Appliquer une réduction (remboursement)',
        },
        partialRefundAsCredit: {
          _label: 'Transformer en solde (remboursement)',
        },
        createManualDiscount: { _label: 'Appliquer des réductions manuelles' },
      },
    },
    reservation: {
      _label: 'Gestion des réservations',
      activity: {
        _label: 'Gestion des cours collectifs',
        allowed_actions: {
          rollcall: { _label: "Valider l'appel" },
          addToWaitlist: {
            _label: "Ajouter des membres dans la file d'attente",
          },
          create: { _label: 'Créer des réservations' },
          delete: { _label: 'Annuler des réservations' },
          removeFromWaitlist: {
            _label: "Supprimer des membres de la file d'attente",
          },
          attendance: { _label: 'Editer les présences / absences' },
          editSpot: { _label: 'Editer les spots des membres' },
          editPerformance: { _label: 'Editer les performances du programme' },
        },
      },
      workshop: {
        _label: 'Gestion des ateliers',
        allowed_actions: {
          rollcall: { _label: "Valider l'appel" },
          addToWaitlist: {
            _label: "Ajouter des membres dans la file d'attente",
          },
          create: { _label: 'Créer des réservations' },
          delete: { _label: 'Annuler des réservations' },
          removeFromWaitlist: {
            _label: "Supprimer des membres de la file d'attente",
          },
          attendance: { _label: 'Editer les présences / absences' },
          editSpot: { _label: 'Editer les spots des membres' },
          editPerformance: { _label: 'Editer les performances du programme' },
        },
      },
      privateBooking: {
        _label: 'Gestion des rendez-vous',
        allowed_actions: {
          create: { _label: 'Créer des réservations' },
          edit: { _label: 'Editer des réservations' },
          cancel: { _label: 'Annuler des réesrvations' },
          editPerformance: { _label: 'Editer les performances du programme' },
        },
      },
    },
    export: {
      _label: 'Exports',
      allowed_actions: {
        planning: { _label: 'Exporter le calendrier' },
        invoice: { _label: 'Exporter des factures' },
        subscription: { _label: 'Exporter des abonnements' },
        payroll: { _label: 'Exporter les rémunérations des professeurs' },
        attendance: { _label: 'Exporter les présences / absences' },
        smartlist: { _label: 'Exporter les smartlists' },
        memberDocument: { _label: 'Exporter les documents des membres' },
        report: { _label: 'Exporter les rapports' },
      },
    },
    planning: {
      _label: 'Calendrier et disponibilités',
      calendar: {
        _label: 'Calendrier',
        allowed_actions: {
          bulkCancellation: { _label: 'Annuler plusieurs séances' },
          readCancellations: { _label: 'Voir les séances annulées' },
          readWeeklyOverview: { _label: "Voir l'aperçu de la semaine" },
        },
      },
      schedule: {
        _label: 'Disponibilités',
        allowed_actions: {
          createAvailability: { _label: 'Voir les disponibilités' },
          deleteAvailability: { _label: 'Supprimer les disponibilités' },
          readAvailabilityDetail: {
            _label: 'Voir le détail des disponibilités',
          },
        },
      },
    },
    report: {
      _label: 'Rapports',
      Payments: {
        _label: 'Paiements',
        basket: {
          _label: 'Panier',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        cashbook: {
          _label: 'Livret de caisse',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        credit: {
          _label: 'Crédit',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        expense: {
          _label: 'Dépenses',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        invoices: {
          _label: 'Achats',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        unpaid_invoices: {
          _label: 'Factures impayées',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        payments: {
          _label: 'Paiements',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        payment_sumup: {
          _label: 'Totaux paiements',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        on_spot_payments: {
          _label: 'Paiements sur place',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        dispute: {
          _label: 'Litige de paiements',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        payment_installments: {
          _label: 'Paiements en plusieurs fois',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        video_purchase: {
          _label: 'Achat vidéo',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
      },
      Club: {
        _label: 'Studio',
        billing_plan: {
          _label: 'Souscription',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        members_purchase: {
          _label: 'Achats des membres',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        members: {
          _label: 'Membres',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        activities: {
          _label: 'Activités',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        activityByEst: {
          _label: 'Activités et ateliers par salle',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        activityByCoach: {
          _label: 'Activités et ateliers par professeur',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        workshop: {
          _label: 'Atelier',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        offers: {
          _label: 'Séances',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        subscription: {
          _label: 'Factures souscriptions',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        privateService: {
          _label: 'Rendez-vous',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
      },
      Bookings: {
        _label: 'Réservations',
        dayBookings: {
          _label: 'Réservations (cours collectif) par jour',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        first_booking: {
          _label: 'Première séance (collectif)',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        bookings: {
          _label: 'Réservations (cours collectif)',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        first_attendance: {
          _label: 'Première présence (collectif)',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        first_privatebooking: {
          _label: 'Premier RDV',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        private_bookings: {
          _label: 'Réservations (rendez-vous)',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        unpaid_private_bookings: {
          _label: 'Réservations Impayées (rendez-vous)',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
      },
      Products: {
        _label: 'Produits',
        private_cpasses_expired: {
          _label: 'Crédits RDV expirés',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        expired_pass: {
          _label: 'Crédits carte de cours expirés',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        memberships: {
          _label: 'Cartes de cours',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        private_cpasses: {
          _label: 'Carte RDV',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        universal_passes: {
          _label: 'Cartes Universelles',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        discount: {
          _label: 'Promotions',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        giftcard: {
          _label: 'Carte cadeau',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        consumer_giftcard: {
          _label: 'Cartes cadeaux achetées',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        shop: {
          _label: 'Magasin',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
        video: {
          _label: 'Vidéo',
          allowed_actions: {
            create: { _label: 'Créer' },
            read: { _label: 'Voir' },
            edit: { _label: 'Éditer' },
            delete: { _label: 'Supprimer' },
          },
        },
      },
    },
    product: {
      _label: 'Gestion des produits',
      paymentPack: {
        _label: 'Cartes de cours',
        allowed_actions: {
          create: { _label: 'Créer' },
          edit: { _label: 'Editer' },
          delete: { _label: 'Supprimer' },
          manageExtension: { _label: 'Ajouter des extensions de validité' },
          manageCredit: { _label: 'Gérer les crédits des membres' },
          compatibility: { _label: 'Gérer les compatibilités' },
        },
      },
      privatePass: {
        _label: 'Cartes de RDV',
        allowed_actions: {
          create: { _label: 'Créer' },
          edit: { _label: 'Editer' },
          delete: { _label: 'Supprimer' },
          manageExtension: { _label: 'Ajouter des extensions de validité' },
          manageCredit: { _label: 'Gérer les crédits des membres' },
          compatibility: { _label: 'Gérer les compatibilités' },
        },
      },
      contract: {
        _label: 'Souscriptions',
        allowed_actions: {
          create: { _label: 'Créer un contrat' },
          edit: { _label: 'Éditer un contrat' },
          delete: { _label: 'Supprimer un contrat' },
          pause: {
            _label: "Mettre en pause toutes les souscriptions d'un contrat",
          },
          createBillingPlan: { _label: 'Souscrire un contrat pour une membre' },
          createCustomBillingPlan: {
            _label: 'Créer une souscription personnalisée',
          },
          pauseBillingPlan: { _label: 'Mettre une souscription en pause' },
          endBillingPlan: { _label: 'Mettre fin à une souscription' },
          editPassBillingPlan: {
            _label: "Modifier les cartes d'une souscription",
          },
          editInvoiceDateBillingPlan: {
            _label: 'Éditer les dates de facturation',
          },
          editInvoicePriceBillingPlan: {
            _label: 'Éditer les montants de facturation',
          },
          endAfterInvoiceBillingPlan: { _label: "Programmer l'arrêt" },
        },
      },
    },
    management: {
      _label: 'Gestion du studio',
      activity: {
        _label: 'Gestion des activités',
        allowed_actions: {
          create: { _label: 'Créer' },
          edit: { _label: 'Éditer' },
          delete: { _label: 'Supprimer' },
        },
      },
      workshop: {
        _label: 'Gestion des ateliers',
        allowed_actions: {
          create: { _label: 'Créer' },
          edit: { _label: 'Éditer' },
          delete: { _label: 'Supprimer' },
        },
      },
      privateService: {
        _label: 'Gestion des RDV',
        allowed_actions: {
          create: { _label: 'Créer' },
          edit: { _label: 'Éditer' },
          delete: { _label: 'Supprimer' },
        },
      },
      coach: {
        _label: 'Gestion des professeurs',
        allowed_actions: {
          create: { _label: 'Créer' },
          edit: { _label: 'Éditer' },
          delete: { _label: 'Supprimer' },
          readPayroll: { _label: 'Voir la rémunération' },
          substitution: { _label: 'Gérer les remplacements' },
        },
      },
    },
  },
};
