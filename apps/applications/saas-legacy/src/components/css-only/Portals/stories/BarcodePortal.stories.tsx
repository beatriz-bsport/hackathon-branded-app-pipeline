import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import BarcodePortal, {
  BarcodePortalStorybook,
} from '#src/components/css-only/Portals/BarcodePortal';

import type { BarcodePortalProps } from '#src/components/css-only/Portals/types';

const baseArgs: BarcodePortalProps = {
  barcode: faker.lorem.word(6),
  isMobile: false,
  isOpen: true,
  onClose: () => {},
  title: faker.lorem.word(6),
  subtitle: faker.lorem.sentence(6),
};

export default {
  title: 'Components/CssOnly/Portals/BarcodePortal',
  component: BarcodePortal,
} as ComponentMeta<typeof BarcodePortalStorybook>;

const BarcodePortalTemplate: ComponentStory<typeof BarcodePortal> = (
  args: BarcodePortalProps,
) => <BarcodePortalStorybook {...args} />;

export const BarcodeModal = BarcodePortalTemplate.bind({});
BarcodeModal.args = baseArgs;

export const BarcodeBottomDrawer = BarcodePortalTemplate.bind({});
BarcodeBottomDrawer.args = { ...baseArgs, isMobile: true };
