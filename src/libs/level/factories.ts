import { Level } from './types';

function random_int(max: number) {
  return Math.floor(Math.random() * max);
}

const hexa_list = '0123456789ABCDEF';

function randomColor() {
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    const number_decimal = random_int(16);
    color += hexa_list[number_decimal];
  }
  return color;
}

const level_names = ['Beginner', 'Confirmed', 'Expert', 'Death mode'];

export function levelFactory(): Level {
  return {
    id: random_int(50),
    company: random_int(999),
    name: level_names[random_int(4)],
    color: randomColor(),
    enabled: true,
  };
}
