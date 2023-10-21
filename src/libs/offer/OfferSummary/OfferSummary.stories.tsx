import React from 'react';
import { OfferSummaryForStorybook } from '.';
import type { Props } from '.';
import { offerFactory } from '#libs/offer/factory';
import { OFFER_BOOKABLE_STATUS_BOOKABLE } from '@bsport/common/lib/master-data/bookable-status';
import { OFFER_WAITING_LIST_STATUS_OPEN } from '@bsport/common/lib/master-data/waiting-list-status';
import { OFFER_WAITING_LIST_STATUS_FULL } from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';
import { MarketPlaceCoachDisplay } from '@bsport/common/lib/master-data/personalization';

const offer = offerFactory();
const meta_activity = { name: offer.name };
const meta_activity_online = { name: offer.name, is_broadcast: true };
const establishment = offer.establishment;
const coach = offer.coach;
const coachOverride = offer.coach_override;
const price = (Math.random() * 100 + 100).toFixed(2);
const tax = Math.random() * 20;
const spotId = Math.floor(Math.random() * 10);

const OfferSummaryTemplate = (args: Props) => {
  return (
    <OfferSummaryForStorybook
      metaActivity={meta_activity}
      offer={offer}
      establishment={establishment}
      coach={coach}
      price={price}
      tax={tax}
      spotId={spotId}
      coachOverride={coachOverride}
      variant="default"
      confirmLoading={false}
      theme={{
        hideCoach: false,
        is_tax_excluded_in_marketplace: true,
        show_establishment: true,
        coach_display: 1,
      }}
      {...args}
    />
  );
};

export const DefaultOfferSummary = OfferSummaryTemplate.bind({});

export const CoachFirstNameWithoutPhoto = OfferSummaryTemplate.bind({});

CoachFirstNameWithoutPhoto.args = {
  theme: {
    hideCoach: false,
    is_tax_excluded_in_marketplace: true,
    show_establishment: true,
    coach_display: MarketPlaceCoachDisplay.ONLY_FIRST_NAME,
  },
};

export const ShowTaxDetailOfferSummary = OfferSummaryTemplate.bind({});

ShowTaxDetailOfferSummary.args = {
  theme: {
    hideCoach: false,
    is_tax_excluded_in_marketplace: false,
    show_establishment: true,
  },
};

export const OnlineOfferSummary = OfferSummaryTemplate.bind({});

OnlineOfferSummary.args = {
  metaActivity: meta_activity_online,
};

export const WaitlistOfferSummary = OfferSummaryTemplate.bind({});

WaitlistOfferSummary.args = {
  metaActivity: meta_activity_online,
  offerStatus: {
    bookable_status: OFFER_BOOKABLE_STATUS_BOOKABLE,
    waiting_list_status: OFFER_WAITING_LIST_STATUS_OPEN,
  },
};

export const WaitlistFullOfferSummary = OfferSummaryTemplate.bind({});

WaitlistFullOfferSummary.args = {
  offerStatus: {
    bookable_status: OFFER_BOOKABLE_STATUS_BOOKABLE,
    waiting_list_status: OFFER_WAITING_LIST_STATUS_FULL,
  },
};

export const BasketOfferSummary = OfferSummaryTemplate.bind({});

BasketOfferSummary.args = {
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
      action: 'onClick',
      description: 'Callback function called on button click.',
    },
    disableButton: {
      control: 'boolean',
      description:
        "True when the button should be disabled (e.g. when the member hasn't selected payment pass or pack yet).",
    },
    confirmLoading: {
      control: 'boolean',
      description: 'True when `onConfirm` has been called and is processing.',
    },
    loading: {
      control: 'boolean',
      description: 'True when the page is loading.',
    },
    offerStatus: {
      description:
        'Status of the offer. What is used here is: is the offer still bookable or not, is the waiting list open or full.',
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
