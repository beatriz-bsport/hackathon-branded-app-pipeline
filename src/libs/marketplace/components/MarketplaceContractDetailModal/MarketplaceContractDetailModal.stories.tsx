import React from 'react';
import FactoryBotContract from '#libs/subscription/factory'
import MarketplaceContractDetailModal, {
    Props,
} from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

const fakeContract = FactoryBotContract.Contract.create()

export default {
    title: 'Components/Marketplace/PassCards/Modals/Contracts',
    component: MarketplaceContractDetailModal,
    parameters: {
        docs: {
            page: null,
        },
        layout: 'centered',
    },
} as ComponentMeta<typeof MarketplaceContractDetailModal>;

const ContractModalTemplate: ComponentStory<typeof MarketplaceContractDetailModal> = (args: Props) => (
    <MarketplaceContractDetailModal {...args} />
);

export const ContractModal = ContractModalTemplate.bind({});
ContractModal.args = {
    contract: fakeContract,
    isOpen: true,
    addToCart: () => {},
    onDialogClose: () => {},
}

export const ContractModalUndefinedSubscription = ContractModalTemplate.bind({});
ContractModalUndefinedSubscription.args = {
    contract: undefined,
    isOpen: true,
    addToCart: () => {},
    onDialogClose: () => {},
}

