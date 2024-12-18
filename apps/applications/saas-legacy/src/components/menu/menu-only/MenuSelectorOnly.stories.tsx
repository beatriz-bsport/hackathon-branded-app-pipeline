import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import MenuSelectorOnly from '.';

export default {
  title: 'Components/Buttons/MenuSelectorOnly',
  component: MenuSelectorOnly,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component:
        'Selector menu button open when anchorElement props is passed and not null, made for cadence usage',
    },
  },
  argTypes: {
    customColor: {
      control: 'color',
      description: 'Color of the icons in the list',
    },
    customHoverBackgroundColor: {
      control: 'color',
      description: 'Color of the background color on hover of the menu items',
    },
    actionList: {
      description: 'List of actions',
    },
    informationText: {
      control: 'text',
      description: 'Texte displayed above the list',
    },
  },
} as ComponentMeta<typeof MenuSelectorOnly>;

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const actions = [
  {
    label: capitalize(faker.word.verb()),
    icon: 'Delete',
    onClick: () => {},
  },
  {
    label: capitalize(faker.word.verb()),
    icon: 'Add',
    onClick: () => {},
  },
  {
    label: capitalize(faker.word.verb()),
    icon: 'Circle',
    onClick: () => {},
  },
];

const Template: ComponentStory<typeof MenuSelectorOnly> = (
  args: React.ComponentProps<typeof MenuSelectorOnly>,
) => {
  // @ts-expect-error
  const anchorRef = React.useRef<HTMLDivElement>(<div />);
  return <MenuSelectorOnly {...args} anchorElement={anchorRef.current} />;
};

export const Default = Template.bind({});
Default.args = {
  actionList: actions,
  informationText: faker.lorem.sentence({ min: 3, max: 5 }),
};
