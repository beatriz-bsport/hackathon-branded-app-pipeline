import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { MarketplacePrivatePassCardForStorybook } from '.';
import type { Props } from '.';

import { privatePassFactory } from '#libs/private-service/factory';
import { generateRandomDescription } from '../../../../../utils/factories';

const fakePrivatePass = privatePassFactory();

const Template = (args: Props) => {
  return (
    <div className="pass-card">
      {/* @ts-expect-error */}
      <MarketplacePrivatePassCardForStorybook {...args} />
    </div>
  );
};

export const privatePassCard = Template.bind({});
privatePassCard.args = {
  privatePass: fakePrivatePass,
  description: generateRandomDescription(faker),
  addToCart: () => {},
  onOpenDetailDialog: () => {},
};

export default {
  title: 'Components/Marketplace/PassCards/Cards/PrivatePassCard',
  component: MarketplacePrivatePassCardForStorybook,
  parameters: {
    layout: 'centered',
    docs: {
      page: null,
    },
  },
};
