// @ts-nocheck
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import FactoryBotSubscription from '#libs/subscription/factory'
import {
  MarketplaceContractCardForStorybook,
    Props,
} from '.';

export default {
    title: 'Components/Marketplace/PassCards/Cards/Contract',
    component: MarketplaceContractCardForStorybook,
    parameters: {
        docs: {
            page: null,
        },
        layout: 'centered',
    },
} as ComponentMeta<typeof MarketplaceContractCardForStorybook>;

const fakeContract = FactoryBotSubscription.Contract.create()

const SubscriptionTemplate: ComponentStory<typeof MarketplaceContractCardForStorybook> = (args: Props) => (
    <MarketplaceContractCardForStorybook {...args} />
);

export const BasicSubscriptionCard = SubscriptionTemplate.bind({});
BasicSubscriptionCard.args = {
    contract: fakeContract,
    addToCart: () => { },
    onOpenDetailDialog: () => { },
}
