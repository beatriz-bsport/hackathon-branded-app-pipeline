exports.default = {
  relationship: {
    delete: {
      content:
        'Attention cette action est irréversible, les cartes partagées ne seront plus partagées.',
      cancel: 'Annuler',
      submit: 'Supprimer',
      title: 'Suppression relation',
    },
  },
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
      shareEmail: 'Toujours envoyer une copie email',
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
  },
  private_consumer_pass_links: {
    list: {
      title: 'Cartes RDV partagées',
      create: 'Partager une carte RDV',
      isEmpty: 'Aucun partage de carte RDV',
    },
    form: {
      create: {
        title: 'Partage de carte RDV',
        explain:
          "Cette carte RDV sera partagée entre les deux membres, les crédits sont utilisables par l'un ou par l'autre.",
        cancel: 'Annuler',
        previous: 'Précédent',
        submit: 'Partager',
        linkButton: 'Partager',
        noConsumerPackToLink: 'Aucune carte partageable',
      },
      unlink: {
        title: 'Arrêt du partage',
        explain: 'Le partage sera arrété. La carte RDV maître reste valable',
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
  },
};
