import React from 'react';
import { OfferSummaryForStorybook } from './OfferSummary.component';
import type { Props } from './OfferSummary.component';
import { offerFactory } from '#libs/offer/factory';

const offer = offerFactory();
const meta_activity = { name: offer.name };
const meta_activity_online = { name: offer.name, is_broadcast: true };
const establishment = offer.establishment;
const coach = offer.coach;
const price = (Math.random() * 100 + 100).toFixed(2);
const tax = Math.random() * 20;
const spotId = Math.floor(Math.random() * 10);

const OfferSummaryTemplate = (args: Props) => {
  // @ts-expect-error
  return <OfferSummaryForStorybook {...args} />;
};

export const DefaultOfferSummary = OfferSummaryTemplate.bind({});

DefaultOfferSummary.args = {
  metaActivity: meta_activity,
  establishment: establishment,
  offer: offer,
  coach: coach,
  coachOverride: null,
  price: price,
  spotId: spotId,
  onConfirm: () => {},
  variant: 'default',
  theme: {
    hideCoach: false,
    is_tax_excluded_in_marketplace: true,
    show_establishment: true,
  },
};

export const ShowTaxDetailOfferSummary = OfferSummaryTemplate.bind({});

ShowTaxDetailOfferSummary.args = {
  metaActivity: meta_activity,
  establishment: establishment,
  offer: offer,
  coach: coach,
  coachOverride: null,
  price: price,
  spotId: spotId,
  onConfirm: () => {},
  variant: 'default',
  tax: tax,
  theme: {
    hideCoach: false,
    is_tax_excluded_in_marketplace: false,
    show_establishment: true,
  },
};

export const OnlineOfferSummary = OfferSummaryTemplate.bind({});

OnlineOfferSummary.args = {
  metaActivity: meta_activity_online,
  establishment: establishment,
  offer: offer,
  coach: coach,
  coachOverride: null,
  price: price,
  spotId: spotId,
  onConfirm: () => {},
  variant: 'default',
  theme: {
    hideCoach: false,
    is_tax_excluded_in_marketplace: true,
    show_establishment: true,
  },
};

export const DisabledOfferSummary = OfferSummaryTemplate.bind({});

DisabledOfferSummary.args = {
  metaActivity: meta_activity,
  establishment: establishment,
  offer: offer,
  coach: coach,
  coachOverride: null,
  price: '0.00',
  spotId: spotId,
  onConfirm: () => {},
  variant: 'default',
  disableButton: false,
  offerStatus: { bookable_status: 3 },
  theme: {
    hideCoach: false,
    is_tax_excluded_in_marketplace: true,
    show_establishment: true,
  },
};

export const LoadingButtonOfferSummary = OfferSummaryTemplate.bind({});

LoadingButtonOfferSummary.args = {
  metaActivity: meta_activity_online,
  establishment: establishment,
  offer: offer,
  coach: coach,
  coachOverride: null,
  price: price,
  spotId: spotId,
  onConfirm: () => {},
  variant: 'default',
  confirmLoading: true,
  theme: {
    hideCoach: false,
    is_tax_excluded_in_marketplace: true,
    show_establishment: true,
  },
};

export const WaitlistOfferSummary = OfferSummaryTemplate.bind({});

WaitlistOfferSummary.args = {
  metaActivity: meta_activity_online,
  establishment: establishment,
  offer: offer,
  coach: coach,
  price: price,
  offerStatus: { bookable_status: 3, waiting_list_status: 0 },
  onConfirm: () => {},
  variant: 'default',
  theme: {
    hideCoach: false,
    is_tax_excluded_in_marketplace: true,
    show_establishment: true,
  },
};

export const WaitlistFullOfferSummary = OfferSummaryTemplate.bind({});

WaitlistFullOfferSummary.args = {
  metaActivity: meta_activity,
  establishment: establishment,
  offer: offer,
  coach: coach,
  price: price,
  offerStatus: { bookable_status: 3, waiting_list_status: 1 },
  onConfirm: () => {},
  variant: 'default',
  theme: {
    hideCoach: false,
    is_tax_excluded_in_marketplace: true,
    show_establishment: true,
  },
};

export const LoadingOfferSummary = OfferSummaryTemplate.bind({});

LoadingOfferSummary.args = {
  onConfirm: () => {},
  loading: true,
  variant: 'default',
  theme: {
    hideCoach: false,
    is_tax_excluded_in_marketplace: true,
    show_establishment: true,
  },
};

export const BasketOfferSummary = OfferSummaryTemplate.bind({});

BasketOfferSummary.args = {
  metaActivity: meta_activity,
  establishment: establishment,
  coach: coach,
  offer: offer,
  variant: 'basket',
  theme: {
    hideCoach: true,
    is_tax_excluded_in_marketplace: true,
    show_establishment: true,
  },
};

export default {
  title: 'Library/Booking/OfferSummary',
  component: OfferSummaryForStorybook,
  argTypes: {
    metaActivity: {
      description: 'Details on the meta activity corresponding to the offer.',
    },
    establishment: {
      description: 'Details on the establishment corresponding to the offer.',
    },
    coach: {
      description: 'Details on the coach associated to the offer.',
    },
    coachOverride: {
      description: 'If there is coach override, details on this coach.',
    },
    offer: {
      description: 'Details on the offer displayed.',
    },
    spotId: {
      description:
        'If there is spot scheduling enabled, id of the spot of the booking.',
    },
    price: {
      description: 'The final price of the booking.',
    },
    onConfirm: {
      description: 'Callback function called on button click.',
    },
    disableButton: {
      description:
        "True when the button should be disabled (e.g. when the member hasn't selected payment pass or pack yet).",
    },
    confirmLoading: {
      description: 'True when `onChange` has been called and is processing.',
    },
    loading: {
      description: 'True when the page is loading.',
    },
    offerStatus: {
      description:
        'Status of the offer. What is used here is: is the offer full or is it still bookable, is the waiting list open or full.',
    },
    variant: {
      description:
        'Either `default` (when displaying on the pricing page), or `basket` (when displaying within the basket component).',
    },
  },
  parameters: {
    docs: {
      page: null,
      description: {
        component:
          'The `Offer Summary` is part of the new checkout page. During the selection of payment passes or packs, the member will be able to see this component which is a recap of the main information of their booking.',
      },
    },
  },
};
