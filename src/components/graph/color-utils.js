import chroma from 'chroma-js';

//  colors from https://gka.github.io/palettes/

const palettes = [
  // red / green
  [
    '#1b5e20',
    '#317a34',
    '#4d974e',
    '#70b26f',
    '#99cd97',
    '#ffa9a3',
    '#f98376',
    '#eb5f51',
    '#d53c31',
    '#b71c1c',
  ],
  // purple / yellow
  [
    '#4a148c',
    '#792ba2',
    '#9b4db5',
    '#b671c6',
    '#ce97d7',
    '#ffe478',
    '#ffcc4f',
    '#fdb335',
    '#f99a22',
    '#f57f17',
  ],
  // blue / orange
  [
    '#0d47a1',
    '#2464be',
    '#4582d6',
    '#69a0e8',
    '#91bff5',
    '#ffc680',
    '#ffa953',
    '#fa8d2e',
    '#f1700f',
    '#e65100',
  ],
  // teal - brown
  [
    '#004d40',
    '#116a5d',
    '#31887b',
    '#57a59a',
    '#82c2ba',
    '#baa7a0',
    '#9d847b',
    '#7e6259',
    '#5f433b',
    '#3e2723',
  ],

  // indigo / amber
  [
    '#1a237e',
    '#3b419c',
    '#5e61b4',
    '#8182c8',
    '#a3a6da',
    '#ffd77c',
    '#ffc151',
    '#ffa82d',
    '#ff8e0f',
    '#ff6f00',
  ],
  // grey / blue-grey
  [
    '#455a64',
    '#5d727c',
    '#778a94',
    '#93a4ac',
    '#b0bec4',
    '#c6c6c6',
    '#989898',
    '#6e6e6e',
    '#454545',
    '#212121',
  ],
];

export const getPalette = (color) => {
  // for each palette, we compute the distances between the color and the start / end
  // we select the palette with min distance to color
  // if the min is reached by end of the palette, we reverse the order of the array
  const distances = [];

  for (let i = 0; i < palettes.length; i += 1) {
    distances.push(chroma.distance(color, palettes[i][0]));
    distances.push(chroma.distance(color, palettes[i][palettes[i].length - 1]));
  }
  const posMin = distances.indexOf(Math.min(...distances));
  const result = palettes[parseInt(posMin / 2, 10)];
  if (posMin % 2 === 1) {
    result.reverse();
  }
  return result;
};

export const getAnalogColors = (baseColor) => {
  const distanceToBlack = (color) => chroma.distance(color, '#000');
  const distanceToWhite = (color) => chroma.distance(color, '#fff');
  let result = [];
  if (Math.abs(distanceToBlack(baseColor) - distanceToWhite(baseColor)) <= 30) {
    result = [
      chroma(baseColor).brighten(),
      baseColor,
      chroma(baseColor).darken(),
      chroma(baseColor).darken(2),
    ];
  } else if (distanceToBlack(baseColor) > distanceToWhite(baseColor)) {
    result = [
      baseColor,
      chroma(baseColor).darken(),
      chroma(baseColor).darken(2),
      chroma(baseColor).darken(3),
    ];
  } else {
    result = [
      baseColor,
      chroma(baseColor).brighten(),
      chroma(baseColor).brighten(2),
      chroma(baseColor).brighten(3),
    ];
  }
  return result;
};
