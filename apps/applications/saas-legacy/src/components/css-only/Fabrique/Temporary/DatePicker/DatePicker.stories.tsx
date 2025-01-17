import React, { useCallback } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DatePicker, { DatePickerStorybook, type DatePickerProps } from '.';
import { ButtonBaseStorybook } from '../../ButtonBaseV2';
import Typography from '#Fabrique/Typography';
import { DateTime } from 'luxon';

DatePickerStorybook.displayName = 'DatePicker';

export default {
  title: 'Fabrique/DatePicker/Stories',
  component: DatePicker,
} as ComponentMeta<typeof DatePickerStorybook>;

const Template: ComponentStory<typeof DatePicker> = (args: DatePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [date, setDate] = React.useState<string>(DateTime.now().toISODate());

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const currentTarget = event.currentTarget;
    const _id = currentTarget.getAttribute('id');
    setAnchorEl(currentTarget);
    setIsOpen(true);
  };

  const handleOnClose = useCallback(() => {
    setAnchorEl(null);
    setIsOpen(false);
  }, []);

  const handleSelect = useCallback((selectedDate: string) => {
    setDate(selectedDate);
  }, []);

  return (
    <div>
      <ButtonBaseStorybook
        aria-haspopup="true"
        aria-controls={isOpen && 'basic-menu'}
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

export const Enablepast = Template.bind({});
Enablepast.args = {
  disablePast: false,
};

export const Disablepast = Template.bind({});
Disablepast.args = {
  disablePast: true,
};
