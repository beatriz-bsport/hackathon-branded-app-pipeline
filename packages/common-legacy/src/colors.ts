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

type EasyAccessOptions = { bgColor: string, color: string, name: string };

export const METRO_COLORS: { [key: string]: EasyAccessOptions } = {
  M1: { bgColor: '#ffcd00', color: 'black', name: '1' },
  M2: { bgColor: '#003ca6', color: 'white', name: '2' },
  M3: { bgColor: '#837902', color: 'white', name: '3' },
  '3 bis': { bgColor: '#6ec4e8', color: 'white', name: '3' },
  M4: { bgColor: '#be418d', color: 'white', name: '4' },
  M5: { bgColor: '#ff7e2e', color: 'white', name: '5' },
  M6: { bgColor: '#6eca97', color: 'white', name: '6' },
  M7: { bgColor: '#fa9aba', color: 'black', name: '7' },
  '7 bis': { bgColor: '#6eca97', color: 'white', name: '7' },
  M8: { bgColor: '#e19bdf', color: 'black', name: '8' },
  M9: { bgColor: '#b6bd00', color: 'black', name: '9' },
  M10: { bgColor: '#c9910d', color: 'white', name: '10' },
  M11: { bgColor: '#704b1c', color: 'white', name: '11' },
  M12: { bgColor: '#007852', color: 'white', name: '12' },
  M13: { bgColor: '#6ec4e8', color: 'black', name: '13' },
  M14: { bgColor: '#62259d', color: 'white', name: '14' },
  M15: { bgColor: '#a60f31', color: 'white', name: '15' },
  M16: { bgColor: '#427b7b', color: 'white', name: '16' },
  M17: { bgColor: '#ec7cae', color: 'white', name: '17' },
  M18: { bgColor: '#95bf32', color: 'white', name: '18' },
  'RER C': { bgColor: '#FCD946', color: 'white', name: 'C' },
  'RER E': { bgColor: '#BD76A1', color: 'white', name: 'E' },
  'Ligne K': { bgColor: '#C7B300', color: 'white', name: 'K' },
  'Ligne N': { bgColor: '#00A092', color: 'white', name: 'N' },
  'RER A': { bgColor: '#D1302F', color: 'white', name: 'A' },
  'RER B': { bgColor: '#427DBD', color: 'white', name: 'B' },
  'RER D': { bgColor: '#5E9620', color: 'white', name: 'D' },
  'Ligne H': { bgColor: '#7B4339', color: 'white', name: 'H' },
  'Ligne L': { bgColor: '#7584BC', color: 'white', name: 'L' },
  'Ligne R': { bgColor: '#E4B4D1', color: 'white', name: 'R' },
  'Ligne U': { bgColor: '#D60058', color: 'white', name: 'U' },
  'Tram T4': { bgColor: '#F2AF00', color: 'white', name: 'T4' },
  'Ligne J': { bgColor: '#CDCD00', color: 'white', name: 'J' },
  'Ligne P': { bgColor: '#F0B600', color: 'white', name: 'P' },
};

export function getEasyAccessOptions(id: string) {
  return METRO_COLORS[id];
}
