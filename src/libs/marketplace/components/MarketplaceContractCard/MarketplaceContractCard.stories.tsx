import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import FactoryBotSubscription from '#libs/subscription/factory'
import MarketplaceSubscriptionCard, {
    Props,
} from '.';

export default {
    title: 'Components/Marketplace/PassCards/Cards/Contract',
    component: MarketplaceSubscriptionCard,
    parameters: {
        docs: {
            page: null,
        },
        layout: 'centered',
    },
} as ComponentMeta<typeof MarketplaceSubscriptionCard>;

const fakeContract = FactoryBotSubscription.Contract.create()

const SubscriptionTemplate: ComponentStory<typeof MarketplaceSubscriptionCard> = (args: Props) => (
    <MarketplaceSubscriptionCard {...args} />
);

export const BasicSubscriptionCard = SubscriptionTemplate.bind({});
BasicSubscriptionCard.args = {
    contract: fakeContract,
    addToCart: () => { },
    onOpenDetailDialog: () => { },
}
