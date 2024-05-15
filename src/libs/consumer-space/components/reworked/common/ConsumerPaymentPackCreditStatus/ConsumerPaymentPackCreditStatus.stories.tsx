import React from 'react';

import { paymentPackFactory } from '#libs/payment-packs/factory';
import { consumerPaymentPackFactory } from '#libs/consumer-payment-pack/factories';
import { ConsumerPaymentPackCreditStatusForStorybook, type Props } from '.';
import './styles.css';
import { DateTime } from 'luxon';

const CreditStatusTemplate = (args: Props) => {
  // @ts-expect-error
  return <ConsumerPaymentPackCreditStatusForStorybook {...args} />;
};

export const IdleStatus = CreditStatusTemplate.bind({});
IdleStatus.args = {
  consumerPaymentPack: consumerPaymentPackFactory({
    availableCredits: 9,
    usedCredits: 1,
  }),
  paymentPack: paymentPackFactory({ isUnlimited: false, credits: 10 }),
};

export const StatusWithUndefinedPack = CreditStatusTemplate.bind({});
StatusWithUndefinedPack.args = {
  consumerPaymentPack: undefined,
  paymentPack: undefined,
};

export const LowCreditsStatus = CreditStatusTemplate.bind({});
LowCreditsStatus.args = {
  consumerPaymentPack: consumerPaymentPackFactory({
    availableCredits: 1,
    usedCredits: 9,
  }),
  paymentPack: paymentPackFactory({ isUnlimited: false, credits: 10 }),
};

export const PenaltyStatus = CreditStatusTemplate.bind({});
PenaltyStatus.args = {
  consumerPaymentPack: consumerPaymentPackFactory({
    availableCredits: 4,
    usedCredits: 6,
    penaltyDisabledFrom: DateTime.now().startOf('month').toISO(),
    penaltyDisabledUntil: DateTime.now().endOf('month').toISO(),
    isDisabled: true,
  }),
  paymentPack: paymentPackFactory({
    isUnlimited: false,
    credits: 10,
    isDisabled: true,
  }),
};

export default {
  title: 'Components/Marketplace/ConsumerPackCreditStatus',
  component: ConsumerPaymentPackCreditStatusForStorybook,
  argTypes: {
    onClick: {
      action: 'onClick',
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};
