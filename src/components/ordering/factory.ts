import { CategoryWithItems } from '#components/ordering/types';
import { generateRandomInt } from '../../utils/factories';


const EMAIL_SUBJECTS = [
  'some things',
  'buttons are crazy',
  'thanks bsport',
  'subjects',
];

const EMAIL_TITLES = [
  'Common email',
  'VIP email',
  'Yoga classes',
  'Boxing course',
  'Information',
  'Password reset',
];

const CATEGORY_NAMES = [
  'Subscriptions',
  'BirthDays',
  'New members',
  'Invitations',
];

function random_choice(arr: Array<any>): any {
  return arr[generateRandomInt(arr.length)];
}

// inspired by EmailListItem
function itemFactory(num_el: number): Array<{
  id: number;
  subject: string;
  title: string;
  ordering_in_category: number;
  company_id: number;
}> {
  const itemIds = [...Array(num_el).keys()];
  return itemIds.map(() => ({
    id: generateRandomInt(50000),
    subject: random_choice(EMAIL_SUBJECTS),
    title: random_choice(EMAIL_TITLES),
    ordering_in_category: generateRandomInt(10000),
    company_id: 555,
  }));
}

export function categoryListFactory(num_cat: number): Array<CategoryWithItems> {
  const categoryIds = [...Array(num_cat).keys()];
  return [
    ...categoryIds.map((id) => ({
      id: id + 1,
      name: random_choice(CATEGORY_NAMES),
      company: 555,
      category_ordering: generateRandomInt(1000),
      items: itemFactory(2),
    })),
    {
      id: null,
      category_ordering: 2000,
      name: '',
      company: 555,
      items: itemFactory(2),
    },
  ];
}
