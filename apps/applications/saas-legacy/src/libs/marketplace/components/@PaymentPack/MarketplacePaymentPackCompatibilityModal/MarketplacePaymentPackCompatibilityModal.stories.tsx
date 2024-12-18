import React from 'react';
import {
  MarketplacePaymentPackCompatibilityModalForStorybook,
  Props,
} from './index';

import { generateRandomInt } from '../../../../../utils/factories';
import { factory_scts } from '#src/libs/category/factory';
import { meta_activity_factory } from '#src/libs/meta-activity/factory';
import { establishment_factory } from '#src/libs/establishment/factory';

const fakeCategories = factory_scts(generateRandomInt(5));
const fakeMetaActivities = meta_activity_factory(generateRandomInt(5));
const fakeEstablishments = establishment_factory(generateRandomInt(5));

const Template = (args: Props) => {
  // @ts-expect-error
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
  title:
    'Components/Marketplace/PassCards/Modals/PaymentPackCompatibilityModal',
  component: MarketplacePaymentPackCompatibilityModalForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
};
