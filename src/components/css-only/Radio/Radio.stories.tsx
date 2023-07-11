import React, { useState } from 'react';
// @ts-ignore
import { faker } from '@faker-js/faker';

import { RadioForStorybook, Props } from './Radio.component';

const IDLE_RADIO_VALUE = 'radio1';

const RadioTemplate = (args: Props) => {
  const [selectedValue, setSelectedValue] = useState<string>(null);

  const handleClickRadio = (value: string) => {
    setSelectedValue(value);
  };

  return (
    // @ts-ignore
    <RadioForStorybook
      name="radio-css-only"
      isChecked={selectedValue == IDLE_RADIO_VALUE}
      onClick={handleClickRadio}
      {...args}
    />
  );
};

export const IdleRadio = RadioTemplate.bind({});
IdleRadio.args = {
  label: faker.hacker.phrase(),
  value: IDLE_RADIO_VALUE,
};

export const DisabledRadio = RadioTemplate.bind({});
DisabledRadio.args = {
  label: faker.hacker.phrase(),
  disabled: true,
};

export default {
  title: 'Components/CssOnly/Radio',
  component: RadioForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
};
