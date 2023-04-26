// @ts-nocheck
import React from 'react'
import { MarketplacePaymentPackRestrictionModalForStorybook, Props } from '.';
import FactoryBotPaymentPack from '#libs/payment-packs/factory'

const fakePaymentPack = FactoryBotPaymentPack.PaymentPackFullDetails.create()


const Template = (args: Props) => {
    return <MarketplacePaymentPackRestrictionModalForStorybook {...args} />
    ;
};

export const restrictionsModal = Template.bind({})
restrictionsModal.args = {
    paymentPack:fakePaymentPack,
    onDialogClose: () => { },
    isOpen: true,   
}

export default {
    title: 'Components/Marketplace/PassCards/Modals/RestrictionModal',
    component: MarketplacePaymentPackRestrictionModalForStorybook,
    parameters: {
        docs: {
            page: null,
        },
    },
};
