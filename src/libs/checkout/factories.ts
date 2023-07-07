import { generateRandomInt } from '../../utils/factories';

const names = [
  'Pass Orange',
  'Pass Blue',
  'Pass Purple',
  'Pass Yellow',
  'Pass Green',
  'Pass Red',
  'Pass Dark',
  'Pass White',
  'Pass Brown',
  'Pass Grey',
];

function random_string(length: number) {
  let text = '';
  for (let i = 0; i < length; i += 1) {
    text += String.fromCharCode(generateRandomInt(122, 97));
  }
  return text;
}

function random_boolean() {
  return [true, false][generateRandomInt(2)];
}

export const checkoutItemFactory = () => {
  return {
    quantity: generateRandomInt(5, 1),
    id: random_string(16),
    unit_price: generateRandomInt(50),
    name: names[generateRandomInt(names.length)],
    buyable_item_identifier: generateRandomInt(9999),
    buyable_item_id: random_string(16),
    editable: random_boolean(),
    tax: 0.2,
  };
};

export const checkoutItemsFactory = (length: number) => {
  const items = [];
  for (let i = 0; i < length; i += 1) {
    items.push(checkoutItemFactory());
  }
  return items;
};

export const basketFactory = (nb_items: number) => {
  const checkout_items = checkoutItemsFactory(nb_items);
  return {
    member: generateRandomInt(9999),
    id: random_string(16),
    is_finalized: false,
    total_price: checkout_items.reduce(
      (previous, current) => previous + current.unit_price,
      0,
    ),
    total_price_cts: checkout_items.reduce(
      (previous, current) => previous + current.unit_price,
      0,
    ),
    checkout_items,
    company: 'Bsport company',
    need_address: false,
    first_name: 'Jean',
    last_name: 'Test',
    address_line_1: '15 Paris Street',
    address_line_2: 'Third floor',
    zipcode: '75013',
    state: 'Paris',
    country: 'France',
    city: 'Paris',
    available_payment_methods: [0],
    total_price_prepaid_lines: 0,
    prepaid_lines: [] as number[],
    invoice: generateRandomInt(2) === 1 ? '123456' : undefined,
    is_fully_paid: generateRandomInt(2) === 1 ? true : undefined,
    date_created: new Date().toISOString(),
    date_updated: new Date().toISOString(),
  };
};

export const createManyBaskets = (amount = 1) => {
  const basketsIds = [...Array(amount).keys()];
  return basketsIds.map(() => {
    return basketFactory(generateRandomInt(10, 1));
  });
};
