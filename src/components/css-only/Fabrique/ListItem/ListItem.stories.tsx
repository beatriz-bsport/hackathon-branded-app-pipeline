import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ListItemStorybook } from '.';
import { ListItemSizeEnum } from './constants';

const Icon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 23 34"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.980749 15.4319L19.7586 0.566112C21.0697 -0.471871 23 0.461933 23 2.1342L23 17L23 31.8658C23 33.5381 21.0697 34.4719 19.7586 33.4339L0.980749 18.5681C-0.0307105 17.7674 -0.0307104 16.2326 0.980749 15.4319Z"
      id="Arrow"
    />
  </svg>
);

const ListItemStorybookTemplate: ComponentStory<typeof ListItemStorybook> = (
  args,
) => <ListItemStorybook {...args}>{args.children}</ListItemStorybook>;

const ListItemStorybookNotTextTemplate: ComponentStory<
  typeof ListItemStorybook
> = (args) => {
  const [isSelected, setIsSelected] = React.useState(false);
  return (
    <ListItemStorybook
      onClick={() => {
        setIsSelected((prevState) => !prevState);
      }}
      isSelected={isSelected}
      {...args}
    />
  );
};

ListItemStorybook.displayName = 'ListItem';

const defaultArgs = { label: 'Label' };

export const Listitemdefault = ListItemStorybookTemplate.bind({});
Listitemdefault.args = defaultArgs;

export const Listitemcaptiontext = ListItemStorybookTemplate.bind({});
Listitemcaptiontext.args = { ...defaultArgs, captionText: 'captionText' };

export const Listitemsm = ListItemStorybookTemplate.bind({});
Listitemsm.args = { ...defaultArgs, size: ListItemSizeEnum.SM };

export const Listitemlg = ListItemStorybookTemplate.bind({});
Listitemlg.args = { ...defaultArgs, size: ListItemSizeEnum.LG };

export const Listitemicon = ListItemStorybookTemplate.bind({});
Listitemicon.args = {
  ...defaultArgs,
  icon: <Icon />,
};

export const Listitemradio = ListItemStorybookNotTextTemplate.bind({});
Listitemradio.args = {
  ...defaultArgs,
  type: 'radio',
  inputId: 'radioId',
};

export const Listitemcheckbox = ListItemStorybookNotTextTemplate.bind({});
Listitemcheckbox.args = {
  ...defaultArgs,
  type: 'checkbox',
  inputId: 'checkboxId',
};

export default {
  title: 'Fabrique/List&ListItem/ListItemStories',
  component: ListItemStorybook,
  argTypes: {
    isDisabled: {
      description: 'Whether or not the button is disabled',
      control: 'boolean',
    },
    size: {
      description: 'Size of the component',
      control: 'inline-radio',
      options: [ListItemSizeEnum.SM, ListItemSizeEnum.LG],
    },
    captionText: {
      description: 'Caption text',
      control: 'text',
    },
  },
} as ComponentMeta<typeof ListItemStorybook>;
