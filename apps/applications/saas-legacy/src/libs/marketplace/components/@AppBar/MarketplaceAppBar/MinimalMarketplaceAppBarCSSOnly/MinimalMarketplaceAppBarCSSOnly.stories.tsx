import React from 'react';
import { MinimalMarketplaceAppBarCSSOnlyStorybook as MinimalMarketplaceAppBarCSSOnly } from '.';
import type { ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

const CustomMinimalMarketplaceAppBarCSSOnlyTemplate = (
  args: React.ComponentProps<typeof MinimalMarketplaceAppBarCSSOnly>,
) => <MinimalMarketplaceAppBarCSSOnly {...args} />;

export const DefaultWithPhoto =
  CustomMinimalMarketplaceAppBarCSSOnlyTemplate.bind({});
DefaultWithPhoto.args = {
  auth: {
    name: 'Client name',
    username: 'client@email.io',
    authenticated: true,
  },
  photo: faker.image.urlPicsumPhotos(),
};

export const Unauthenticated =
  CustomMinimalMarketplaceAppBarCSSOnlyTemplate.bind({});
Unauthenticated.args = {
  auth: {
    name: '',
    username: '',
    authenticated: false,
  },
  photo: '',
};

export const LongUserName = CustomMinimalMarketplaceAppBarCSSOnlyTemplate.bind(
  {},
);

LongUserName.args = {
  auth: {
    name: 'Client with very long name to shorten',
    username: 'client@email.io',
    authenticated: true,
  },
  photo: '',
};

export default {
  title: 'Library/Marketplace/MinimalMarketplaceAppBarCSSOnly',
  component: MinimalMarketplaceAppBarCSSOnly,
  argTypes: {
    auth: {
      description: 'Auth of the member.',
    },
    photo: {
      control: 'text',
      description: 'SVG profile picture of the member.',
    },
    requestLogin: {
      action: 'requestLogin',
      description: 'Function to be called when the profile menu is opened.',
    },
    disconnect: {
      action: 'disconnect',
      description:
        'Function to be called when the logout button of the profile menu is clicked.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "This component is an abstract app bar. It gets displayed on a 'no pop-up' widget. It is minimal in order to increase loading speed.",
      },
    },
  },
} as ComponentMeta<typeof MinimalMarketplaceAppBarCSSOnly>;
