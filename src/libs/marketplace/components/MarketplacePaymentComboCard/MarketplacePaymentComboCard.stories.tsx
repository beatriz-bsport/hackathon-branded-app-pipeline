// @ts-nocheck
import React from 'react';
import FactoryBotPaymentCombo from '#libs/payment-combo/factory'
import MarketplacePaymentComboCard, {
    Props,
} from '.';

const fakePaymentCombo = FactoryBotPaymentCombo.PaymentCombo.create()

const PackCardTemplate = (args: Props) => (
    <MarketplacePaymentComboCard {...args} />
);

export const BasicPackCard = PackCardTemplate.bind({});
BasicPackCard.args = {
    paymentCombo: fakePaymentCombo,
}

export const PricingPagePackCard = PackCardTemplate.bind({});
PricingPagePackCard.args = {
    paymentCombo: fakePaymentCombo,
    variant: 'pricing_page'
}

export default {
    title: 'Components/Marketplace/PassCards/PaymentComboCard',
    component: MarketplacePaymentComboCard,
    parameters: {
        docs: {
            page: null,
        },
        layout: 'centered',
    },
};
