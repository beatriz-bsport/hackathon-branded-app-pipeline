import { PaymentPack } from './types';

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const paymentPackNames = ['Cours offert', 'Carte gold', '3 cours par semaine'];

function randomBoolean() {
  const table = [true, false];
  return table[randomInt(2)];
}

export function PaymentPackFactory(id: number): PaymentPack {
  return {
    id,
    unlimited: randomBoolean(),
    name: paymentPackNames[randomInt(paymentPackNames.length - 1)],
    credits: randomInt(20),
  };
}
