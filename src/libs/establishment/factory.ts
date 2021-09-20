import {
  EasyAccess,
  Establishment,
  EstablishmentGroup,
  Location,
} from './types';

function random_int(max: number): number {
  return Math.floor(Math.random() * max);
}

const TITLES: Array<string> = [
  'Boxing Club',
  'Yoga Club',
  'Gym',
  'Swim Club',
  'Football Club',
  'Tennis Club',
  'Basket C',
  'Fitness Club',
  'Ping Pong',
  'Gym 5',
  'Fast Food',
];

const COVERS: Array<string> = [
  'https://assets.staging.bsport',
  'https://assets.dev.bsport',
  'https://assets.pro.bsport',
  'https://assets.io.bsport',
  'https://assets.staging.bwellness',
];

const LOCATION_ADDRESSES: Array<string> = [
  '19 Rue Saint Rémy',
  '23 Rue Saint-Barthélémy',
  '19 Quai de la Seine',
  '10 Quai du Rhones',
  '7 Boulevard Vivier Merle',
  '4 Square Henri Regnault',
  '58 Rue Saint Michel',
  '99 Rue de Lyon',
];

const LOCATION_LATITUDES: Array<string> = [
  '2.5626',
  '2.2394',
  '1.9523',
  '3.2538',
];

const LOCATION_LONGITUDES: Array<string> = [
  '25.22626',
  '22.61394',
  '19.63523',
  '32.26538',
];

const SPECIFIC_INFOS: Array<string> = [
  'Very beautifull',
  'Handsome',
  'Small',
  'Big',
  'Far away',
  'Expensive',
  'Good rates',
];

const EASY_ACCESS_LINES: Array<Array<string>> = [
  ['RER D', 'Ligne 5'],
  ['Ligne 2', 'Ligne 3', 'Ligne 1'],
  ['Ligne 4'],
  ['Ligne 6', 'RER A', 'RER B'],
  ['RER C'],
];

const EASY_ACCESS_NAMES: Array<string> = [
  'Melun',
  'Val',
  'Boulogne',
  'Barcelone',
  'Rungis',
];

const TZNAMES: Array<string> = [
  'Europe/Paris',
  'Europe/Barcelone',
  'Europe/Londres',
  'Amérique/NewYork',
  'Amérique/Vancouver',
];

function random_choice(arr: Array<any>): any {
  return arr[random_int(arr.length)];
}

function location_factory(num_el: number): Array<Location> {
  const addresses = [...Array(num_el)].map(
    (_, i) => LOCATION_ADDRESSES[i % LOCATION_ADDRESSES.length],
  );
  return [...Array(num_el)].map((i) => ({
    address: addresses[i],
    latitude: random_choice(LOCATION_LATITUDES),
    longitude: random_choice(LOCATION_LONGITUDES),
  }));
}

function easy_access_factory(num_el: number): Array<EasyAccess> {
  const EASY_ACCESS_IDS = [...Array(num_el).keys()];
  const names = [...Array(num_el)].map(
    (_, i) => EASY_ACCESS_NAMES[i % EASY_ACCESS_NAMES.length],
  );
  return EASY_ACCESS_IDS.map((id) => ({
    id: id + 1,
    lines: random_choice(EASY_ACCESS_LINES),
    name: names[id],
  }));
}

export function establishment_factory(num_el: number): Array<Establishment> {
  const ESTABLISHMENT_IDS = [...Array(num_el).keys()];
  const titles = [...Array(num_el)].map((_, i) => TITLES[i % TITLES.length]);
  const locations = location_factory(num_el);
  const easy_accesses = easy_access_factory(num_el);
  return ESTABLISHMENT_IDS.map((id) => ({
    id: id + 1,
    title: titles[id],
    cover: random_choice(COVERS),
    location: locations[id],
    specific_info: random_choice(SPECIFIC_INFOS),
    easy_access: easy_accesses[id],
    disabled: false,
    associatedestablishment_set: [],
    tzname: random_choice(TZNAMES),
  }));
}

export function establishmentGroup_factory(
  num_el: number,
): Array<EstablishmentGroup> {
  const ESTABLISHMENTGROUP_IDS = [...Array(num_el).keys()];
  const names = [...Array(num_el)].map((_, i) => TITLES[i % TITLES.length]);
  return ESTABLISHMENTGROUP_IDS.map((id) => ({
    id: id + 1,
    name: names[id],
    company_id: id,
    establishment: [],
  }));
}
