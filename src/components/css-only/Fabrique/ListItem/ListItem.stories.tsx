import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ListItemStorybook } from '.';
import { ListItemSizeEnum, ListItemTypeEnum } from './constants';
import { ArrowBlockLeft } from '#components/untitledui';

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
  icon: <ArrowBlockLeft />,
};

export const Listitemradio = ListItemStorybookNotTextTemplate.bind({});
Listitemradio.args = {
  ...defaultArgs,
  type: ListItemTypeEnum.RADIO,
  inputId: 'radioId',
};

export const Listitemcheckbox = ListItemStorybookNotTextTemplate.bind({});
Listitemcheckbox.args = {
  ...defaultArgs,
  type: ListItemTypeEnum.CHECKBOX,
  inputId: 'checkboxId',
};

export const Listitemclickabletext = ListItemStorybookTemplate.bind({});
Listitemclickabletext.args = {
  ...defaultArgs,
  type: ListItemTypeEnum.CLICKABLETEXT,
};

export const Listitemclickabletexticon = ListItemStorybookTemplate.bind({});
Listitemclickabletexticon.args = {
  ...defaultArgs,
  type: ListItemTypeEnum.CLICKABLETEXT,
  icon: <ArrowBlockLeft />,
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
    type: {
      description: 'Type of the component',
      control: 'inline-radio',
      options: [
        ListItemTypeEnum.CHECKBOX,
        ListItemTypeEnum.RADIO,
        ListItemTypeEnum.TEXT,
        ListItemTypeEnum.CLICKABLETEXT,
      ],
    },
  },
} as ComponentMeta<typeof ListItemStorybook>;
