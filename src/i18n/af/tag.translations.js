exports.default = {
  memberStatus: 'Statut du membre : ',
  panel: {
    title: 'Mes tags',
    noTagAvailable: 'Aucun tag créé',
  },
  filter: {
    addATagFilter: 'Filtrer par tag...',
  },
  tag: {
    noTagAttributed: 'Sélectionnez un tag',
  },
  select: 'Sélectionner un tag',
  form: {
    filter: {
      title: 'Filtre',
      includeLabel: 'Type',
      include: 'Inclut le tag',
      exclude: "N'inclut pas le tag",
      tagGroupLabel: 'Tag (catégorie)',
      tagLabel: 'Tag (valeur)',
      cancel: 'Annuler',
      addFilter: 'Filtrer',
    },
    group: {
      delete: {
        title: 'Suppression',
        explain:
          'Attention, la suppression de cette catégorie affectera tous les membres. Cette opération est irréversible',
        submit: 'Supprimer',
        cancel: 'Annuler',
      },
      namePlaceholder: 'Nom de la catégorie',
      addTagGroup: 'Créer une catégorie',
      edit: 'Modifier les tags',
      deleteCategory: 'Supprimer la catégorie',
    },
    tag: {
      icon: 'Icône (facultatif)',
      searchIcon: 'Rechercher une icone (recherche en anglais)',
      selectIcon: 'Selectionner une icône',
      info: 'Si vous sélectionné une icône, elle apparaitra en tant que badge à coté de la photo de profil pour l’ensemble des membres taggués avec ce tag.',
      namePlaceholder: 'Nom du tag',
      color: 'Couleur',
      name: 'Nom du Tag',
      submit: 'Enregistrer',
      delete: {
        title: 'Suppression',
        explain:
          'Attention, ce tag sera supprimé chez TOUS les membres. Cette opération est irréversible',
        submit: 'Supprimer',
        cancel: 'Annuler',
      },
    },
  },
  management: {
    addGroup: 'Créer une categorie',
    addTag: 'Ajouter un tag',
    rename: 'Renommer',
    delete: 'Supprimer',
    form: {
      groupRename: 'Catégorie',
      tagGroupName: 'Nom',
      tagGroupEmpty: 'Aucun tag dans cette catégorie',
    },
    cancel: 'Annuler',
    submit: 'Confirmer',
    tagColumn: {
      tag: 'Tag',
      member_count: 'Membres taggés',
      coupon_count: '', // 'Code promo liés',
      smartlist_count: 'Règles de tagging',
      actions: 'Actions ',
    },
    deleteTagGroupDialog: {
      title: 'Suppression catégorie',
      text: 'Êtes vous sûr de vouloir supprimer cette catégorie ? L’ensemble des tags compris dans la catégorie seront aussi supprimés. ',
    },
    deleteTagDialog: {
      title: 'Suppression tag',
      text: 'Êtes vous sûr de vouloir supprimer ce tag ? L’ensemble des règles liées à ce tag seront supprimées.',
    },
    createGroupDialog: {
      title: 'Catégorie',
      field: 'Nom',
      helper:
        'Créez une catégorie pour identifier une famille de membres. Par exemple “VIP”, vous pourrez ensuite créer les tags “oui” et “non” pour indiquer si le membre appartient à cette famille.',
    },
    tagDetail: {
      noTag: 'Sélectionner un tag pour voir les détails',
    },
    tagKind: {
      toolbar: 'Affichage par',
      member: 'Membres',
      coupon: 'Code promo',
      smartlist: 'Smartlists',
    },
    memberDetail: {
      memberWithTag: 'Membres taggés',
      removeTagFromAll: 'Retirer le tag à tous',
      removeTag: 'Dé-tagger',
      memberWithoutTag: 'Membres non taggés',
      addTagToAll: 'Ajouter le tag à tous',
      addTag: 'Tagger',
    },
    couponDetail: {
      title: 'Codes promos liés au tag',
      whitelist: 'Utilisable par les membres disposant du tag',
      blacklist: 'Non utilisable par les membres disposant du tag',
      removeTag: 'Retirer le tag',
      empty: "Aucun code promo n'est lié au tag {{- tag }}",
      createViaCoupon: 'Accéder aux codes promo',
    },
    smartlistDetail: {
      title: 'Règle de tagging (Smartlist)',
      removeTag: 'Supprimer',
      empty: "Aucune règle de tagging n'est liée au tag {{ tag }}",
      createViaSmartlist: 'Accéder aux Smartlists',
    },
  },
};
