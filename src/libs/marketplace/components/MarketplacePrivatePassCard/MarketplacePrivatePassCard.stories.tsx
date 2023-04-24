// @ts-nocheck
import React from 'react'

import MarketplacePrivatePassCard from '.'

import { private_services_passes_factory } from '#libs/private-service/factory';

import type { Props } from '.';

const fakePrivatePass = private_services_passes_factory(1)

const Template = (args: Props) => {
    return (
        <div className='pass-card'>
            <MarketplacePrivatePassCard {...args}/>
        </div>
    );
};

export const privatePassCard = Template.bind({})
privatePassCard.args = {
    privatePass: fakePrivatePass[0],
    description: "Ceci est une description normale",    
    addToCart: () => {},
    onOpenDetailDialog: () => {},
    
}

export default {
    title: 'Components/Marketplace/PassCards/Cards/PrivatePassCard',
    component: MarketplacePrivatePassCard,
    parameters: {
        layout: 'centered',
        docs: {
            page: null,
        },
    },
};
