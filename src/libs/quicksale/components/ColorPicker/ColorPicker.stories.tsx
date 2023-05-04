import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import ColorPicker from '.';
import { QuicksaleItemColor } from '../../constants';

export default {
  title: 'Components/Quicksale/ColorPicker',
  component: ColorPicker,
  args: {
    colorChoices: Object.values(QuicksaleItemColor),
    selectedColor: QuicksaleItemColor.Gray,
  },
} as ComponentMeta<typeof ColorPicker>;

const ColorPickerTemplate: ComponentStory<typeof ColorPicker> = (args) => {
  // Adding a state to make the component usable in the storybook
  const [color, setColor] = React.useState(args.selectedColor);
  return (
    <ColorPicker {...args} selectedColor={color} onColorChange={setColor} />
  );
};

export const ColorPickerDefault = ColorPickerTemplate.bind({});
