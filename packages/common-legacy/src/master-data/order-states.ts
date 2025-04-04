type OrderState = {
  id: number;
  text: string;
};

export const ORDER_STATE_INITIALIZED: OrderState = {
  id: 0,
  text: 'initialized',
};

export const ORDER_STATE_PAID: OrderState = {
  id: 700,
  text: 'paid',
};

export const ORDER_STATE_CANCELLED: OrderState = {
  id: 1100,
  text: 'cancelled',
};

export const ORDER_STATE_ONSITEDELIVERY: OrderState = {
  id: 1200,
  text: 'on site delivery',
};

export const ORDER_STATE_SENT: OrderState = {
  id: 9000,
  text: 'sent',
};

const ORDER_STATES: Array<OrderState> = [
  ORDER_STATE_INITIALIZED,
  ORDER_STATE_PAID,
  ORDER_STATE_CANCELLED,
  ORDER_STATE_ONSITEDELIVERY,
  ORDER_STATE_SENT,
];

export default ORDER_STATES;
