export default {
  member: {
    item: {
      edit: 'Modifier',
      delete: 'Supprimer',
    },
    list: {
      title: 'Relations',
      isEmpty: "Aucune relation n'a encore été créée",
      pleaseSelectOne:
        'Sélectionnez une relation pour voir les abonnements partagés',
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
      title: 'Abonnements partagés',
      create: 'Partager un abonnement',
      isEmpty: "Aucun partage d'abonnement",
    },
    form: {
      create: {
        title: "Partage d'abonnement",
        explain:
          "Cet abonnement sera partagé entre les deux membres, les crédits sont utilisables par l'un ou par l'autre.",
        cancel: 'Annuler',
        previous: 'Précédent',
        submit: 'Partager',
        linkButton: 'Partager',
        noConsumerPackToLink: 'Aucun abonnement partageable',
      },
      unlink: {
        title: 'Arrêt du partage',
        explain: "Le partage sera arrété. L'abonnement maître reste valable",
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
        success: 'Abonnement partagé',
        error: 'Impossible de partager cet abonnement',
      },
      unlink: {
        success: 'Partage supprimé',
        error: 'Impossible de supprimer ce partage',
      },
      relink: {
        success: 'Partage enregistré',
        error: 'Impossible de partager cet abonnement',
      },
    },
  },
};
