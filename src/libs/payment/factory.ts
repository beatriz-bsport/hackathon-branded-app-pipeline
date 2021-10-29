import { PaymentMethod } from './types';

function random_int(max: number): number {
  return Math.floor(Math.random() * max);
}

function random_choice(arr: Array<any>): any {
  return arr[random_int(arr.length)];
}

const payment_method_types: Array<string> = ['card', 'sepa_debit'];

export function payment_method_type_factory(): string {
  return random_choice(payment_method_types);
}

const payment_method_brands = ['mastercard', 'visa'];

function generate_identifier(num: number): string {
  let identifier = random_int(num).toString();
  while (identifier.length < 4) {
    identifier += `0`;
  }
  return identifier;
}

function generateId(num: number): string {
  const charList =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < num; i += 1) {
    id += charList.charAt(Math.floor(Math.random() * charList.length));
  }

  return id.toString();
}

export function card_list_factory(num: number): Array<PaymentMethod> {
  const card_ids: Array<number> = [...Array(random_int(num) + 2).keys()];
  return card_ids.map((id) => {
    return {
      additional_info: '10/23',
      brand: random_choice(payment_method_brands),
      id: `pm_${generateId(25)}`,
      payment_backend_identifier: id + 1,
      readable_identifier: generate_identifier(9999),
      type: 'card',
    };
  });
}

export function sepa_list_factory(num: number): Array<PaymentMethod> {
  const card_ids: Array<number> = [...Array(random_int(num) + 2).keys()];
  return card_ids.map((id) => {
    return {
      additional_info: 'Jean Durand',
      brand: generate_identifier(99999),
      id: `pm_${generateId(25)}`,
      payment_backend_identifier: id + 1,
      readable_identifier: generate_identifier(9999),
      type: 'sepa_debit',
    };
  });
}

export function payment_method_list_factory(
  num1: number,
  num2: number,
): Array<PaymentMethod> {
  return card_list_factory(num1).concat(sepa_list_factory(num2));
}

export function payment_method_list_by_type(num: number): Array<any> {
  const result = [random_choice(payment_method_types)];
  result.push(
    result[0] === 'card' ? card_list_factory(num) : sepa_list_factory(num),
  );
  return result;
}
