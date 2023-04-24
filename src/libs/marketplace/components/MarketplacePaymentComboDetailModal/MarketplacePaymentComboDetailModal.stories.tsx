// @ts-nocheck
import React from 'react'
import FactoryBotPaymentCombo from '#libs/payment-combo/factory'
import MarketplacePaymentComboDetailsModal, {Props} from '.'

const fakePaymentCombo = FactoryBotPaymentCombo.PaymentCombo.create()

const ComboCardModalTemplate = (args: Props) => (
    <MarketplacePaymentComboDetailsModal {...args} />
);

export const ComboCardModal = ComboCardModalTemplate.bind({})
ComboCardModal.args = {
    paymentCombo: fakePaymentCombo,
    isOpen: true,
    onDialogClose: () => {},
    onAddToCart: () => {},
}

export const ComboCardModalWithUndefinedPaymentCombo = ComboCardModalTemplate.bind({})
ComboCardModalWithUndefinedPaymentCombo.args = {
    paymentCombo: undefined,
    isOpen: true,
    onDialogClose: () => {},
    onAddToCart: () => {},
}

export default {
    title: 'Components/Marketplace/PassCards/PaymentComboCard/Modal',
    component: MarketplacePaymentComboDetailsModal,
    parameters: {
        docs: {
            page: null,
        },
        layout: 'centered',
    },
};
