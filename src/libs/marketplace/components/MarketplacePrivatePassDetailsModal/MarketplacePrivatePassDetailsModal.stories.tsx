// @ts-nocheck
import React from 'react'
import MarketplacePrivatePassDetailsModal, {Props} from './MarketplacePrivatePassDetailsModal.component';

import { private_services_passes_factory } from '#libs/private-service/factory';

const fakePrivatePassDetails = private_services_passes_factory(1)

const Template = (args: Props) => {
    return (
        <MarketplacePrivatePassDetailsModal {...args} />
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
    component: MarketplacePrivatePassDetailsModal,
    parameters: {
        docs: {
            page: null,
        },
    },
};
