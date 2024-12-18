import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import OffPeakTimeSlotGroup from './PaymentPackOffPeak.component';
import withFormik from '@bbbtech/storybook-formik';
import { offPeakGroupDefault } from '#src/libs/payment-packs/utils';

const offPeakDefaultGroup = offPeakGroupDefault();

const actionsData = {
  onGroupDelete: action('onGroupDelete'),
};

export default {
  title: 'Library/PaymentPack/Payment Pack Form',
  component: OffPeakTimeSlotGroup,
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: {
        off_peak_schedule: [offPeakDefaultGroup],
      },
    },
  },
  argTypes: {
    onGroupDelete: actionsData.onGroupDelete,
  },
  args: {
    group: offPeakDefaultGroup,
    multipleGroups: false,
    index: 0,
  },
} as ComponentMeta<typeof OffPeakTimeSlotGroup>;

const PaymentPackOffPeakTemplate: ComponentStory<
  typeof OffPeakTimeSlotGroup
> = (args) => <OffPeakTimeSlotGroup {...args} />;

export const PaymentPackOffPeak = PaymentPackOffPeakTemplate.bind({});
