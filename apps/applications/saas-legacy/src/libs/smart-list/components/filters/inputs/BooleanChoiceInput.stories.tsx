import React from 'react';
import { Story, ComponentMeta } from '@storybook/react';
import { BooleanChoiceInputComponent } from '.';
import type { BooleanChoiceInputProps } from '.';

const Template: Story<BooleanChoiceInputProps> = (args) => (
  <BooleanChoiceInputComponent {...args} />
);

export const Default = Template.bind({});

Default.args = {
  filterData: {
    filter_identifier: 'string',
    yourFieldName: true,
  },
  fieldName: 'yourFieldName',
  onChange: (dict: any) => dict,
  additionalTranslationPrefix: 'yourOptionalPrefix',
  hideTranslation: { before: false, after: false },
  showToolTip: true,
};

export default {
  title: 'components/Smartlists/filters/BooleanChoiceInput',
  component: BooleanChoiceInputComponent,
  argTypes: {
    filterData: {
      description: 'The filter object values stored in database',
    },
    fieldName: {
      description:
        'The name of the input field that will be used to control the switch state',
    },
    onChange: {
      description:
        'The function used to update the filterData with the backend',
    },
    additionalTranslationPrefix: {
      description: 'Optional prefix used for translation keys',
    },
    hideTranslation: {
      description: 'Object that indicates which translations should be removed',
    },
    showToolTip: {
      description: 'Boolean that indicates if a tooltip should be shown',
    },
  },
} as ComponentMeta<typeof BooleanChoiceInputComponent>;
