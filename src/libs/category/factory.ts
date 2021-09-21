import AVAILABLE_CATEGORY from '@bsport/common/lib/master-data/sports';
import { SCT } from './types';

function random_int(max: number): number {
  return Math.floor(Math.random() * max);
}

const NAMES: Array<string> = [
  'yoga',
  'fitness',
  'bodybuilding',
  'climbing',
  'gymnastic',
  'basketball',
  'soccer',
  'boxing',
  'karate',
  'swimming',
  'fencing',
  'riding',
  'tennis',
  'ping pong',
  'hiking',
  'ski',
];

const SCS_NAMES: Array<string> = [
  'Aerobic',
  'African Dance',
  'Martial Art',
  'Other',
  'Yoga',
  'Boxing',
  'Ball Sport',
];

function random_choice(arr: Array<any>): any {
  return arr[random_int(arr.length)];
}

export function factory_scts(num_el: number): Array<SCT> {
  const NMS = [...Array(num_el)].map((_, i) => NAMES[i % NAMES.length]);
  const SCT_IDS = [...Array(num_el).keys()];
  const SCS_NMS = [...Array(num_el)].map(
    (_, i) => SCS_NAMES[i % SCS_NAMES.length],
  );
  return SCT_IDS.map((id) => ({
    id: id + 1,
    name: NMS[id],
    SCS: {
      id: random_choice(AVAILABLE_CATEGORY).id,
      name: SCS_NMS[id],
      slug: SCS_NMS[id],
    },
  }));
}
