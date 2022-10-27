exports.default = {
  companyGroup: {
    explain:
      "Les catégories servent à grouper vos licences sous une appellation commune (e.g: Studios Paris) et sera affiché notamment dans l'application mobile",
    actions: {
      add: 'Ajouter une catégorie',
      submit: 'Valider',
      cancel: 'Annuler',
    },
    name: {
      label: 'Nom',
    },
  },
  membersList: {
    name: 'Nom',
    franchised: 'Franchisés',
    actions: 'Actions',
    see: 'Voir',
    pageTitle: 'Membres',
  },
  pagination: {
    previousPage: 'Page précedente',
    nextPage: 'Page suivante',
    rowPerPage: 'Element par page',
    outOf: '{{from}} - {{to}} sur {{count}}',
  },
  member: {
    franchises: 'Franchises',
    isVaccinated: 'Pass sanitaire valide',
    seeMembership: 'voir la fiche membre',
    pageTitle: 'Membre',
  },
  companies: {
    pageTitle: 'Franchisés',
    searchPlaceholder: 'Rechercher un franchisé',
    emptySelect: 'Sélectionner une franchise pour en voir le détail.',
    members: 'Membres',
    establishment: 'Etablissements',
    establishmentEmptyState: 'Aucun établissement dans cette compagnie',
    membersEmptyState: 'Aucun membre dans cette compagnie',
    navigateToCompany: 'Connexion au compte franchisé',
  },
  staff: {
    staffAccountTabTitle: 'Comptes staff',
    explainStaff:
      "Avec l'accès staff du master account, sélectionnez à quels franchisés ont accès vos staffs et quelles actions ils peuvent effectuer dans ceux-ci. L'accès staff ne permet pas de se connecter à l'application mobile.",
    roleTabTitle: 'Rôles',
  },
  emails: {
    emptyStateTitle: 'Aperçu du mail',
    emptyStateDescription: 'Sélectionner un template',
    franchiseEmails: 'Mes templates',
    create: 'Créer un modèle',
    companiesEmails: 'Templates franchisés',
    pageTitle: 'Template',
    groupBy: 'Grouper par',
    franchised: 'Franchisé',
    groupByPlaceholder: 'Grouper par',
    copy: 'copie',
    chooseGroup: 'Choisir un groupe',
    searchPlaceholder: 'Rechercher un template',
  },
  login: {
    disconnect: 'Me déconnecter',
    previous: 'Retour',
    connect: 'Me connecter',
    signUp: "M'inscrire",
  },
  genericProduct: {
    dialogs: {
      deleteTemplate: {
        title: 'Désactivation',
      },
      selectCompanies: {
        title: 'Configurer mes studios',
        content1:
          'Les studios suivants auront automatiquement cette carte disponible à la vente. Ils ne pourront pas en modifier le prix.',
        content2:
          "Les membres qui recevront cette carte pourront l'utiliser dans l'ensemble des studios compatibles.",
        allCompaniesShared:
          'Vous avez déjà partagé cette carte avec tous les studios franchisés auxquels vous avez accès.',
      },
      deleteTemplateInstance: {
        title: 'Stopper le partage',
        buttonValidate: 'Désactiver le partage',
      },
    },
    templateCard: {
      buttons: {
        update: 'Modifier',
        delete: 'Supprimer',
      },
      shareTemplate: {
        categoryName: 'Partagée avec les studios',
        emptyCompanyList:
          "Aucun studio n'est configuré pour accepter cette carte",
        addCompany: 'Ajouter un studio',
        seeAll: 'Voir tous',
        closeDialog: 'Fermer',
      },
    },
    list: {
      titleActive: 'Disponible à la vente',
      titleInactive: 'Indisponible à la vente',
      fuzzySearch: 'Rechercher une carte',
      shortMenu: {
        goTo: 'Detail',
        delete: 'Supprimer',
        edit: 'Modifier',
        restore: 'Restaurer',
      },
      visibility: 'Invisible pour les clients',
    },
  },
};
