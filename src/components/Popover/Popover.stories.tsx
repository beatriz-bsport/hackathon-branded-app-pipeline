// @ts-nocheck
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import Popover from '.';
import { expect } from '@storybook/jest';

const DefaultChildren = ({ margin }: { margin?: string }) => (
  <div
    style={{ padding: '5px', border: 'solid 1px', marginTop: margin ?? null }}
  >
    This is the text to hover on.
  </div>
);

export default {
  title: 'Components/Commons/Popover',
  component: Popover,
} as ComponentMeta<typeof Popover>;

const PopoverTemplate: ComponentStory<typeof Popover> = (args) => (
  <Popover {...args} />
);

export const DefaultPopover = PopoverTemplate.bind({});
DefaultPopover.args = {
  children: <DefaultChildren />,
  title: 'This is the title',
};
DefaultPopover.play = async ({ canvasElement }) => {
  const popoverTextAbsent = document.getElementById('popover');
  expect(popoverTextAbsent).toBeNull();

  const textToHover = within(canvasElement)
    .getByTestId('popover-container')
    .querySelector('#hovered-text');
  await userEvent.hover(textToHover);
  const popoverText = await document.getElementById('popover');
  await expect(popoverText.innerHTML).toEqual('This is the title');
};

export const HiddenPopover = PopoverTemplate.bind({});
HiddenPopover.args = {
  children: <DefaultChildren />,
  title: 'This should never be seen',
  hide: true,
};

export const PopoverWithLongTitle = PopoverTemplate.bind({});
PopoverWithLongTitle.args = {
  children: <DefaultChildren />,
  title:
    "This is a very long text, just to make sure that everything is going to be fine with such a text, because you wouldn't want your text to suddenly get out of the component when the title starts to be a bit long, right? We might never see a popover this long but let's test it anyway.",
};

export const PopoverAboveText = PopoverTemplate.bind({});
PopoverAboveText.args = {
  children: <DefaultChildren margin="75px" />,
  title: 'This is the title',
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'bottom',
    horizontal: 'left',
  },
};

export const PopoverCenteredBelowText = PopoverTemplate.bind({});
PopoverCenteredBelowText.args = {
  children: <DefaultChildren />,
  title: 'This is the title',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center',
  },
};

export const PopoverCenteredOnText = PopoverTemplate.bind({});
PopoverCenteredOnText.args = {
  children: <DefaultChildren margin="50px" />,
  title: 'This is the title',
  anchorOrigin: {
    vertical: 'center',
    horizontal: 'center',
  },
  transformOrigin: {
    vertical: 'center',
    horizontal: 'center',
  },
};
