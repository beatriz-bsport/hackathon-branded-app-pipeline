import React from 'react';

import { NumbersComparatorInputProps, NumbersComparatorInput } from '.';
import { Story, ComponentMeta } from '@storybook/react';

export default {
  title: 'components/Smartlists/filters/NumbersComparatorInput',
  component: NumbersComparatorInput,
  argTypes: {
    filterData: {
      description: 'The filter object values stored in database',
    },
    keys: {
      description: 'Mapper between the filterData keys and the input fields',
    },
    onChange: {
      description:
        'The function used to update the filterData with the backend',
    },
    translationsPrefix: {
      description: 'Optional prefix used for translation keys',
    },
    hideTranslation: {
      description: 'Object that indicates which translations should be removed',
    },
    defaultComparatorValue: {
      description: 'The default value for the comparator',
    },
    paramsTranslation: {
      description:
        'Object used to add parameters to the translation function `t`',
    },
    showToolTip: {
      description:
        'Boolean that indicates if a tooltip should be shown at the end',
    },
  },
} as ComponentMeta<typeof NumbersComparatorInput>;

const Template: Story<NumbersComparatorInputProps> = (args) => (
  <NumbersComparatorInput {...args} />
);

export const Default = Template.bind({});
Default.args = {
  keys: {
    comparatorKey: 'comparator',
    valueKey: 'value',
    valueSecondKey: 'valueSecond',
  },
  filterData: { comparator: 'gte', value: 10, valueSecond: 20 },
  onChange: (dict: any) => console.log(dict),
  translationsPrefix: 'example',
  hideTranslation: { before: false, after: false },
  defaultComparatorValue: 1,
  paramsTranslation: { before: { param: 'value' }, after: { param: 'value' } },
  showToolTip: true,
};
