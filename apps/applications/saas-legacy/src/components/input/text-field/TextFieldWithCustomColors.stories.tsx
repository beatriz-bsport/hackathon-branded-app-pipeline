import React from 'react';
import TextFieldWithCustomColors, {
  Props,
} from './TextFieldWithCustomColors.component';

const TextFieldWithCustomColorsTemplate = (args: Props) => (
  <TextFieldWithCustomColors {...args} />
);

export const TextFieldWithCustomColorsTemplateExample =
  TextFieldWithCustomColorsTemplate.bind({});

TextFieldWithCustomColorsTemplateExample.args = {
  name: 'my-name',
  placeholder: 'my-placeholder',
  label: 'my-label',
  minRows: 1,
  onFocus: () => {},
  colorsOverride: {
    borderColor: 'red',
    borderColorFocus: 'pink',
    borderColorHover: 'yellow',
    textColor: 'green',
    placeholderColor: 'brown',
    labelColor: 'cyan',
    labelColorFocus: 'black',
  },
  variant: 'outlined',
};

export default {
  title: 'Components/Input/Text-Field/TextFieldWithCustomColors',
  component: TextFieldWithCustomColors,
  parameters: {
    docs: {
      page: null,
    },
  },
};
