import React from 'react';
import { paymentComboFactory } from '#libs/payment-combo/factory';
import { Props, MarketplacePaymentComboDetailsModalForStorybook } from '.';

const fakePaymentCombo = paymentComboFactory();

const ComboCardModalTemplate = (args: Props) => (
  // @ts-expect-error
  <MarketplacePaymentComboDetailsModalForStorybook {...args} />
);

export const ComboCardModal = ComboCardModalTemplate.bind({});
ComboCardModal.args = {
  paymentCombo: fakePaymentCombo,
  isOpen: true,
  onDialogClose: () => {},
  onAddToCart: () => {},
};

export const ComboCardModalWithUndefinedPaymentCombo =
  ComboCardModalTemplate.bind({});
ComboCardModalWithUndefinedPaymentCombo.args = {
  paymentCombo: undefined,
  isOpen: true,
  onDialogClose: () => {},
  onAddToCart: () => {},
};

export default {
  title: 'Components/Marketplace/PassCards/PaymentComboCard/Modal',
  component: MarketplacePaymentComboDetailsModalForStorybook,
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};
