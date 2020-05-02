exports.default = {
  member: {
    item: {
      edit: 'Modifier',
      delete: 'Supprimer',
    },
    list: {
      title: 'Relations',
      isEmpty: "Aucune relation n'a encore été créée",
      pleaseSelectOne:
        'Sélectionnez une relation pour voir les cartes de cours partagées',
      actions: {
        create: 'Ajouter une relation',
      },
    },
    form: {
      is: ' est ',
      src_name: {
        placeholder: 'Mère',
      },
      dst_name: {
        placeholder: 'Fils',
      },
      title: 'Relation',
      cancel: 'Annuler',
      submit: 'Enregistrer',
    },
    messages: {
      edit: {
        success: 'Relation modifiée',
      },
      create: {
        success: 'Relation enregistrée',
      },
      createOrUpdate: {
        error: "Impossible d'enregistrer la relation",
      },
    },
  },
  consumer_payment_pack_links: {
    list: {
      title: 'Cartes partagées',
      create: 'Partager une carte de cours',
      isEmpty: 'Aucun partage de carte',
    },
    form: {
      create: {
        title: 'Partage de carte',
        explain:
          "Cette carte de cours sera partagée entre les deux membres, les crédits sont utilisables par l'un ou par l'autre.",
        cancel: 'Annuler',
        previous: 'Précédent',
        submit: 'Partager',
        linkButton: 'Partager',
        noConsumerPackToLink: 'Aucune carte partageable',
      },
      unlink: {
        title: 'Arrêt du partage',
        explain: 'Le partage sera arrété. La carte maître reste valable',
        submit: 'Arrêter',
        cancel: 'Annuler',
      },
      relink: {
        title: 'Partager de nouveau',
        explain: 'Le partage sera de nouveau activé.',
        submit: 'Partager',
        cancel: 'Annuler',
      },
    },
    messages: {
      create: {
        success: 'Carte partagée',
        error: 'Impossible de partager cette carte',
      },
      unlink: {
        success: 'Partage supprimé',
        error: 'Impossible de supprimer ce partage',
      },
      relink: {
        success: 'Partage enregistré',
        error: 'Impossible de partager cette carte',
      },
    },
  },
};
