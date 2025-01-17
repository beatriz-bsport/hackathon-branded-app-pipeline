import React, { useState } from 'react';
import { faker } from '@faker-js/faker';

import { CheckboxForStorybook, Props } from './Checkbox.component';

const CheckboxTemplate = (args: Props) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleOnChange = () => setIsChecked((prevState) => !prevState);
  return (
    //@ts-expect-error
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
