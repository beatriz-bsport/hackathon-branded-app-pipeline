import React from 'react';
import BookingConfirmButton, { Props } from './BookingConfirmButton.component';

const BookingConfirmButtonTemplate = (args: Props) => (
  <BookingConfirmButton {...args} />
);

export const ClickableBookingButton = BookingConfirmButtonTemplate.bind({});

ClickableBookingButton.args = {
  value: 'Confirm',
  disabled: false,
  buttonLoading: false,
};

export default {
  title: 'Library/Booking/BookingConfirmButton',
  component: BookingConfirmButton,
  argTypes: {
    value: {
      description: 'The text to appear on the button.',
    },
    disabled: {
      control: 'boolean',
      description: 'True if the button should be disabled.',
    },
    onClick: {
      action: 'onClick',
      description: 'Function to be called when the button is clicked.',
    },
    buttonLoading: {
      control: 'boolean',
      description: 'True if the onClick function was called and is processing.',
    },
  },
  parameters: {
    docs: {
      page: null,
      description: {
        component:
          'Default button to use in the booking activity summary/basket.',
      },
    },
  },
};
