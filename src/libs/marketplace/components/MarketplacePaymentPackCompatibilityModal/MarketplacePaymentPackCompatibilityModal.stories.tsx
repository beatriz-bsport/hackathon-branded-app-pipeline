// @ts-nocheck
import React from 'react';
import { MarketplacePaymentPackCompatibilityModalForStorybook, Props} from './index';

import { factory_scts } from '#libs/category/factory';
import {meta_activity_factory} from '#libs/meta-activity/factory'
import { establishment_factory } from '#libs/establishment/factory'

function random_int(max: number): number {
    return Math.floor(Math.random() * max);
}

const fakeCategories = factory_scts(random_int(5))
const fakeMetaActivities = meta_activity_factory(random_int(5))
const fakeEstablishments = establishment_factory(random_int(5))

const Template = (args: Props) => {
    return <MarketplacePaymentPackCompatibilityModalForStorybook {...args} />;
};

export const paymentPackWithCompatibilities = Template.bind({});
paymentPackWithCompatibilities.args = {
    isOpen: true,
    onDialogClose: () => {},
    categories: fakeCategories, 
    metaActivities: fakeMetaActivities,
    establishments: fakeEstablishments,
};

export default {
    title: 'Components/Marketplace/PassCards/Modals/PaymentPackCompatibilityModal',
    component: MarketplacePaymentPackCompatibilityModalForStorybook,
    parameters: {
        docs: {
            page: null,
        },
    },
};
