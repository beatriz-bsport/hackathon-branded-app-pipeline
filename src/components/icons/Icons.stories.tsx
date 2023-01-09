import React from 'react';
import CalendarIcon from './CalendarIcon.component';
import ErrorIcon from './ErrorIcon.component';
import FemaleIcon from './FemaleIcon.component';
import IntercomIcon from './IntercomIcon.component';
import MaleIcon from './MaleIcon.component';
import SadSmileyIcon from './SadSmileyIcon.component';
import StripeIcon from './StripeIcon.component';
import SuccessIcon from './SuccessIcon.component';
import ValidationIcon from './ValidationIcon.component';
import CardRefusedIcon from './CardRefusedIcon.component';

const CalendarTemplate = () => <CalendarIcon />;
export const Calendar = CalendarTemplate.bind({});

const ErrorTemplate = () => <ErrorIcon />;
export const Error = ErrorTemplate.bind({});

const FemaleTemplate = () => <FemaleIcon />;
export const Female = FemaleTemplate.bind({});

const IntercomTemplate = () => <IntercomIcon />;
export const Intercom = IntercomTemplate.bind({});

const MaleTemplate = () => <MaleIcon />;
export const Male = MaleTemplate.bind({});

const SadSmileyTemplate = () => <SadSmileyIcon />;
export const SadSmiley = SadSmileyTemplate.bind({});

const StripeTemplate = () => <StripeIcon />;
export const Stripe = StripeTemplate.bind({});

const SuccessTemplate = () => <SuccessIcon />;
export const Success = SuccessTemplate.bind({});

const ValidationTemplate = (args: { color?: string }) => (
  <ValidationIcon {...args} />
);
export const Validation = ValidationTemplate.bind({});
Validation.args = {
  color: 'red',
};

const CardRefusedTemplate = () => <CardRefusedIcon />;
export const CardRefused = CardRefusedTemplate.bind({});

export default {
  title: 'Components/Icons',
  parameters: {
    docs: {
      page: null,
    },
  },
};
