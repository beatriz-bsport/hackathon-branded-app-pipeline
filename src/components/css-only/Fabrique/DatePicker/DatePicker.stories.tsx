import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DatePicker, { DatePickerStorybook, type DatePickerProps } from '.';
import { ButtonBaseStorybook } from '../ButtonBaseV2';
import Typography from '#Fabrique/Typography';
import moment, { Moment } from 'moment-timezone';

export default {
  title: 'Example/DatePicker',
  component: DatePicker,
} as ComponentMeta<typeof DatePickerStorybook>;

const Template: ComponentStory<typeof DatePicker> = (args: DatePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement>(null);
  const [date, setDate] = React.useState<string>(moment().format('YYYY-MM-DD'));

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const currentTarget = event.currentTarget;
    const id = currentTarget.getAttribute('id');
    setAnchorEl(currentTarget);
    setIsOpen(true);
  };

  const handleOnClose = () => {
    setAnchorEl(null);
    setIsOpen(false);
  };

  const handleSelect = (selectedDate: string) => {
    setDate(selectedDate);
  };

  return (
    <div>
      <ButtonBaseStorybook
        aria-haspopup="true"
        aria-controls={isOpen ? 'basic-menu' : undefined}
        onClick={handleOnClick}
        isDisabled={isOpen}
        style={{ border: '2px solid black', padding: '16px' }}
        id="basic-button-date-picker"
      >
        <Typography variant="body-lg">Open Date Picker</Typography>
      </ButtonBaseStorybook>

      <DatePickerStorybook
        {...args}
        isOpen={isOpen}
        anchorEl={anchorEl}
        id="basic-date-picker"
        onClose={handleOnClose}
        onSelect={handleSelect}
        dateSelected={date}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {};
