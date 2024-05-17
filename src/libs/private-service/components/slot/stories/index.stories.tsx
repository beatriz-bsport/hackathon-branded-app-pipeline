import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

// @ts-expect-error
import PrivateSlotForm from '../PrivateSlotForm.component';

import {
  formRenderingTest,
  formWithInitialValuesRenderingTest,
} from './rendering-tests';

import {
  formValidationTest,
  formWithWrongValuesTest,
} from './interaction-tests';

import { initialData } from './constants';
import { formWithErrorTest } from './error-tests';

const actionsData = {
  onSubmit: action('onSubmit'),
  onCancel: action('onCancel'),
};

export default {
  title: 'Library/PrivateBooking/Form/PrivateSlotForm',
  component: PrivateSlotForm,
  args: {
    onSubmit: actionsData.onSubmit,
    onCancel: actionsData.onCancel,
  },
} as ComponentMeta<typeof PrivateSlotForm>;

const PrivateSlotFormTemplate: ComponentStory<typeof PrivateSlotForm> = (
  args,
) => <PrivateSlotForm {...args} />;

export const EmptyForm = PrivateSlotFormTemplate.bind({});

// 🎯 The purpose is to test if the component and its children are rendered correctly
export const FormRenderingTest = PrivateSlotFormTemplate.bind({});
FormRenderingTest.play = formRenderingTest;

export const FormWithInitialRenderingTest = PrivateSlotFormTemplate.bind({});
FormWithInitialRenderingTest.args = {
  initial: initialData,
};
FormWithInitialRenderingTest.play = formWithInitialValuesRenderingTest;

// 🎯 Tests to verify the value that the user inputs is the ones received in the form
export const FormValidationTest = PrivateSlotFormTemplate.bind({});
FormValidationTest.play = formValidationTest;

// 🎯 Tests to verify that the form doesn't crash if the user inputs wrong values
export const FormWithWrongValuesTest = PrivateSlotFormTemplate.bind({});
FormWithWrongValuesTest.play = formWithWrongValuesTest;

// 🎯 Tests to verify that the form behaves correctly when there is an error
export const FormWithErrorTest = PrivateSlotFormTemplate.bind({});
FormWithErrorTest.play = formWithErrorTest;
