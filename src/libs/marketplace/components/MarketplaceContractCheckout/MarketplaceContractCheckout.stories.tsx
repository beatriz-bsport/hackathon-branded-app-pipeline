// @ts-nocheck
import React from 'react';
import FactoryBot from '#libs/subscription/factory'
import {
  MarketplaceContractCheckoutForStorybook,
    Props,
} from '.';

const fakeContract = FactoryBot.Contract.create();

const ContractCheckoutTemplate = (args: Props) => (
    <MarketplaceContractCheckoutForStorybook {...args} />
);

export const BasicContractCheckout = ContractCheckoutTemplate.bind({});
BasicContractCheckout.args = {
    contract: fakeContract,
    addToCart: () => { },
    onOpenDetailDialog: () => { },
}

export const ContractCheckoutWithUndefinedSubscription = ContractCheckoutTemplate.bind({});
ContractCheckoutWithUndefinedSubscription.args = {
    contract: undefined,
    addToCart: () => { },
    onOpenDetailDialog: () => { },
}

export default {
    title: 'Components/Marketplace/PassCards/Modals/MarketplaceContractCheckout',
    component: MarketplaceContractCheckoutForStorybook,
    parameters: {
        docs: {
            page: null,
        },
        layout: 'centered',
    },
};
