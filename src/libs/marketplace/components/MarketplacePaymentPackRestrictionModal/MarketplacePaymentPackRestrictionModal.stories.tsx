import React from 'react'
import MarketplacePaymentPackRestrictionModal, {Props} from '.';
import FactoryBotPaymentPack from '#libs/payment-packs/factory'

const fakePaymentPack = FactoryBotPaymentPack.PaymentPackFullDetails.create()


const Template = (args: Props) => {
    return <MarketplacePaymentPackRestrictionModal {...args} />
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
    component: MarketplacePaymentPackRestrictionModal,
    parameters: {
        docs: {
            page: null,
        },
    },
};
