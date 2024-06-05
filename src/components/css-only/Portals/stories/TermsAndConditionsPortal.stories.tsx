import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import TermsAndConditionsPortal, {
  TermsAndConditionsPortalStorybook,
} from '#src/components/css-only/Portals/TermsAndConditions';

import type { TermsPortalProps } from '#src/components/css-only/Portals/types';

const baseArgs: TermsPortalProps = {
  terms: faker.lorem.paragraphs(3),
  isMobile: false,
  isOpen: true,
  onClose: () => {},
  subtitle: 'Test',
  title: 'Terms and conditions',
  cancelLabel: 'Close',
};

export default {
  title: 'Components/CssOnly/Portals/TermsAndConditionsPortal',
  component: TermsAndConditionsPortal,
} as ComponentMeta<typeof TermsAndConditionsPortalStorybook>;

const TermsAndConditionsPortalTemplate: ComponentStory<
  typeof TermsAndConditionsPortal
> = (args: TermsPortalProps) => <TermsAndConditionsPortalStorybook {...args} />;

export const ConsumerProfileBarcodeModal =
  TermsAndConditionsPortalTemplate.bind({});
ConsumerProfileBarcodeModal.args = baseArgs;

export const ConsumerProfileBarcodeBottomDrawer =
  TermsAndConditionsPortalTemplate.bind({});
ConsumerProfileBarcodeBottomDrawer.args = { ...baseArgs, isMobile: true };
