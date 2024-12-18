import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import DetachPaymentPortal, {
  DetachPaymentPortalStorybook,
} from '#src/components/css-only/Portals/DetachPaymentPortal';

import type { PortalProps } from '#src/components/css-only/Portals/types';

const baseArgs: PortalProps = {
  isMobile: false,
  isOpen: true,
  onClose: () => {},
  onConfirm: () => {},
  title: faker.lorem.word(6),
  subtitle: faker.lorem.sentence(6),
  cancelLabel: 'Close',
  confirmLabel: 'Delete',
};

export default {
  title: 'Components/CssOnly/Portals/DetachPaymentPortal',
  component: DetachPaymentPortal,
} as ComponentMeta<typeof DetachPaymentPortalStorybook>;

const DetachPaymentPortalTemplate: ComponentStory<
  typeof DetachPaymentPortal
> = (args: PortalProps) => <DetachPaymentPortalStorybook {...args} />;

export const DetachPaymentModal = DetachPaymentPortalTemplate.bind({});
DetachPaymentModal.args = baseArgs;

export const DetachPaymentBottomDrawer = DetachPaymentPortalTemplate.bind({});
DetachPaymentBottomDrawer.args = { ...baseArgs, isMobile: true };
