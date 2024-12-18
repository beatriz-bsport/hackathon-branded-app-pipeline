import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import SessionNotePad, { SessionNotePadProps } from '.';

const ActionData = {
  onSubmit: action('onSumbit'),
};

SessionNotePad.displayName = 'SessionNotePad';

const baseArgs = {
  onSubmit: ActionData.onSubmit,
  isLoading: false,
  initialValue: 'Custom session note',
};

const Template: ComponentStory<typeof SessionNotePad> = (
  args: SessionNotePadProps,
) => <SessionNotePad {...args} />;

export const OfferVersion = Template.bind({});
OfferVersion.args = {
  ...baseArgs,
  permissionType: 'activity',
  withPaper: true,
  noDivider: false,
};

export const PrivateSlotVersion = Template.bind({});
PrivateSlotVersion.args = {
  ...baseArgs,
  permissionType: 'privateSlot',
  withPaper: false,
  noDivider: true,
};

export default {
  title: 'Library/Offer/SessionNotePad',
  component: SessionNotePad,
  argTypes: {
    permissionType: {
      control: 'select',
      options: ['activity', 'workshop', 'privateSlot'],
      required: true,
      description:
        "The kind of permission the component needs to check. This prop has to be set either to `activity`, `workshop` or `privateSlot`, unless the component won't be displayed.",
    },
    initialValue: {
      control: 'text',
      description:
        'Enter here the `internal_note` property of the offer/private booking.',
    },
    isLoading: {
      control: 'boolean',
      description:
        'Indicates if the offer/private booking is loading. In that case the component displays a custom placeholder',
    },
    withPaper: {
      control: 'boolean',
      description:
        "Indicates if the component should or shoudnl't be wrapped in a Paper component.",
    },
    noDivider: {
      control: 'boolean',
      description: 'Hide the default divider between title and content.',
    },
    onSubmit: {
      action: 'onSubmit',
      description:
        'Callback function called when the user submits the form. The function receives the new value of the internal note as a parameter.',
    },
  },
} as ComponentMeta<typeof SessionNotePad>;
