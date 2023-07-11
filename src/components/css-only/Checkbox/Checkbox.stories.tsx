import React, { useState } from 'react';
// @ts-ignore
import { faker } from '@faker-js/faker';

import { CheckboxForStorybook, Props } from './Checkbox.component';

const CheckboxTemplate = (args: Props) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleOnChange = () => setIsChecked((prevState) => !prevState);
  const label = faker.hacker.phrase();
  return (
    // @ts-ignore
    <CheckboxForStorybook
      name="idle-checkbox"
      isChecked={isChecked}
      onChange={handleOnChange}
      {...args}
    />
  );
};

export const IdleCheckbox = CheckboxTemplate.bind({});

IdleCheckbox.args = {
  label: <span>{faker.hacker.phrase()}</span>,
};

export default {
  title: 'Components/CssOnly/Checkbox',
  component: CheckboxForStorybook,
  parameters: {
    docs: {
      page: null,
    },
  },
};
