exports.default = {
  toolsMenu: {
    title: 'Boite à outils',

    sections: {
      edition: 'Édition',
      walls: 'Murs',
      place: 'Emplacement',
      elements: 'Éléments',
      custom: 'Personnalisation',
    },

    eraser: 'Gomme',
    undo: 'Précédent',
    redo: 'Suivant',
    rotation: 'Rotation',
    line: 'Trait',
    rect: 'Rectangle',
    spot: 'Place',
    teacher: 'Professeur',
    screen: 'Écran',
    door: 'Porte',
    pointer: 'Curseur',
    hand: 'Main',

    customStroke: 'Couleur des traits',
    customFill: 'Couleur de remplissage',

    customIconLabel: 'Icones des emplacements',
    customIconButton: 'Télécharger mes icones',
    showGrid: 'Afficher la grille',
  },
  spotImageDialog: {
    title: 'Personnaliser vos emplacements',
    helper:
      'Vous pouvez personnaliser la forme des emplacements en important vos propres images. Pour cela nous avons besoin de 2 icones différentes. Une pour indiquer que l’emplacement est disponible, une autre quand il est réservé. Assurez-vous qu’ils aient la même taille et merci de ne pas inclure de numéro sur vos icones.',
    freeImageLabel: 'Emplacement disponible',
    takenImageLabel: 'Emplacement réservé',
    imageUploadButton: 'Charger une image',
    free: 'Disponible',
    taken: 'Réservé',
    imageFormat: 'Format conseillé: .png, .jpg',
    actions: {
      cancel: 'Annuler',
      submit: 'Confirmer',
    },
  },
  toolbar: {
    save: 'Enregistrer',
    titleLabel: 'Nom du plan',
    exit: 'Quitter',
    loadExistingBlueprint: 'Charger un plan existant',
  },
  spotSelectorDialog: {
    title: 'Choisir une place',
    spot: 'Place {{count}}',
    cancel: 'Annuler',
    submit: 'Confirmer',
    takeSpotError:
      'La place que vous avez sélectionné pour ce cours n’est plus disponible. Merci d’en sélectionner une nouvelle.',
  },
  roomBlueprintSelectorTitle: 'Choisir un plan',
  search: 'Chercher un plan pour le spot scheduling',
  searchHelper:
    "Aide: permet à vos élèves de réserver l'emplacement qu'ils souhaitent dans la salle. Champs non obligatoire",
  effectifError:
    "Le nombre de place doit être supérieur ou égal à l'effectif de la séance",
  saved: 'Plan de salle enregistré',
  errorLessSpotThanEffectif:
    "Sauvegarde impossible. Le plan de salle doit contenir plus de place que l'effectif de la séance auxquelle il est associé",
  saveError: 'Erreur',
  roomBlueprints: 'Plan de salle',
  placeCount: '{{count}} places',
};
