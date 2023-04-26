// @ts-nocheck
import React from 'react'
import { MarketplacePrivatePassDetailsModalForStorybook, Props } from './MarketplacePrivatePassDetailsModal.component';

import { private_services_passes_factory } from '#libs/private-service/factory';

const fakePrivatePassDetails = private_services_passes_factory(1)

const Template = (args: Props) => {
    return (
        <MarketplacePrivatePassDetailsModalForStorybook {...args} />
    );
};

export const privatePassDetailsModal = Template.bind({})
privatePassDetailsModal.args = {
    privatePass: fakePrivatePassDetails[0],
    isOpen:true,
    onDialogClose: () => {},
    onAddToCart: () => {},
    onShowCompatibilityDialog: () => {},
}

export default {
    title: 'Components/Marketplace/PassCards/Modals/PrivatePassDetailsModal',
    component: MarketplacePrivatePassDetailsModalForStorybook,
    parameters: {
        docs: {
            page: null,
        },
    },
};
