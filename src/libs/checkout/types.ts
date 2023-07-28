export type AddItemToBasketParams = {
  check_offer_unicity?: boolean;
};

export type Basket<C = number, PPL = number> = {
  member: number;
  id: string; // uuid
  is_finalized: boolean;
  total_price: string;
  total_price_cts: number;
  total_price_prepaid_lines: string;
  total_price_prepaid_lines_cts: number;
  checkout_items: CheckoutItem[];
  company?: C;
  need_address: boolean;
  first_name?: string;
  last_name?: string;
  address_line_1?: string;
  address_line_2?: string;
  zipcode?: string;
  state?: string;
  city?: string;
  country?: string;
  available_payment_methods: number[];
  instalment_payment?: number;
  prepaid_lines: PPL[];
  date_created: string;
  date_updated: string;
  invoice?: string;
  is_fully_paid?: boolean;
};

export type BasketAddress = {
  first_name: string;
  last_name: string;
  address_line_1: string;
  address_line_2?: string;
  zipcode: string;
  state: string;
  country: string;
  city: string;
};

export type CheckoutItem = {
  quantity: number;
  id: string;
  unit_price: number;
  name: string;
  buyable_item_identifier: number;
  buyable_item_id: number;
  sub_items?: string[];
  editable: boolean;
  clearable: boolean;
  tax: number;
  extra_data: CheckoutItemExtraData;
};

type ExtraData = {
  [key: string]: string | string[] | number | boolean | ExtraData;
};

export type CheckoutItemData = {
  buyable_item_id: number;
  buyable_item_identifier: number;
  quantity: number;
  extra_data: ExtraData;
};

export type CheckoutItemAnalytics = {
  objectToTrack: {
    name: string;
    id: number | string;
    price: number;
  };
  buyable_item_identifier: number;
};

export type HandleAddCheckoutItemData = {
  buyable_item_id: number;
  buyable_item_identifier: number;
  quantity: number;
  extra_data: { [key: string]: string | number };
  name: string;
  price: number;
};

export type CheckoutItemExtraData = {
  offers_data?: CheckoutItemOfferData[];
};

export type CheckoutItemOfferData = {
  offer_id: number;
  extra_data: { [key: string]: any };
};

export type CheckoutState = {
  basket: {
    history: {
      items: Basket[];
      loading: boolean;
      error: Error | null;
    };
    allIds: string[];
    byId: { [id: string]: Basket };
    current: {
      data?: Basket;
      loading: boolean;
      error?: Error;
      updating: boolean;
    };
    loading: boolean;
    error?: Error;
    generatedObjects: {
      data: GeneratedObject[];
      loading: boolean;
      error?: Error;
    };
  };
};

export type OnRemoveCheckoutItemData = {
  checkout_item: string;
  quantity: number;
};

export type PrepaidLine = {
  id: string;
  unit_value: string; // decimal price as string
  extra_data: any;
  name: string;
};

export type GeneratedObject = {
  buyable_item_identifier: number;
  id: number;
  extra_data: { [key: string]: string | number };
};

export const SUBMIT_BUTTONS = {
  NEXT_BUTTON: { id: 0, textPath: 'forms.delivery.actions.submit' },
  PAY_NOW_BUTTON: { id: 1, textPath: 'validation.actions.payNow' },
  PAY_LATER_BUTTON: { id: 2, textPath: 'payLater.submit' },
  CONFIRM_BUTTON: { id: 3, textPath: 'validation.actions.confirmPriceNull' },
};

export const STEPS = {
  ADDRESS_STEP: {
    id: 0,
    label: 'address',
    submitButtonTextPath: 'forms.delivery.actions.submit',
  },
  PAYMENT_STEP: {
    id: 1,
    label: 'payment',
    submitButtonTextPath: 'validation.actions.payNow',
  },
};

export type StepType = typeof STEPS[keyof typeof STEPS];

export type QuicksaleMemberUpdateResponse = {
  updated_member: boolean;
  has_removed_incompatible_items: boolean;
  new_basket?: Basket;
};

export type QuicksaleMemberUpdateSuccess = {
  updated_member: boolean;
  newBasket: Basket;
  previousBasketId: string;
};
