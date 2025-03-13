export const colors = {
  link: 'rgb(255, 90, 90)',
  white: 'rgb(255, 255, 255)',
  backgroundGray: '#EEEEEE',
  backgroundLightGray: '#F8F8F8',
  textGray: 'rgb(118,122,130)',
  textLightGray: '#DDDDDD',
  primaryLight: 'rgb(92, 232, 196)',
  primary: 'rgb(20, 158, 122)', // vert
  primaryDark: 'rgb(46, 117, 128)',
  greenGradientRight: 'rgba(20,157,123, 1.0)',
  greenGradientLeft: 'rgba(45,118,127, 1.0)',
  flashyGreen: '#5CE7C4',
  secondary: 'rgb(36, 54, 92)',
  secondaryDark: 'rgb(8, 23, 46)',
  secondaryDarkAlpha: 'rgb(8, 23, 46, 0.9)',
  orange: 'rgb(255, 89, 89)',
  orangeDisabled: 'rgba(255, 89, 89, 0.5)',
  disabled: '#E8EAF2',
  disabledDark: '#BAC1D3',
};

export const levelColors = {
  all: 'rgb(200,120,0)',
  beginner: 'rgb(0, 183, 152)',
  intermediary: 'rgb(0,96,106)',
  advanced: 'rgb(28, 55, 91)',
};

export function getLevelColor(level: string): string {
  switch (level) {
    case 'Tous niveaux':
      return levelColors.all;
    case 'Débutant':
      return levelColors.beginner;
    case 'Intermédiaire':
      return levelColors.intermediary;
    case 'Confirmé':
      return levelColors.advanced;
    default:
      return levelColors.all;
  }
}

export function getLevelColorById(level?: number) {
  switch (level) {
    case 1:
      return levelColors.beginner;
    case 2:
      return levelColors.beginner;
    case 3:
      return levelColors.intermediary;
    case 4:
      return levelColors.advanced;
    default:
      return levelColors.beginner;
  }
}
