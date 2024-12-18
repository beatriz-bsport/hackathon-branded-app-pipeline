import React from 'react';

import { ComponentStory, ComponentMeta, Meta } from '@storybook/react';
import { BadgeStorybook } from '.';
import { fakerEN as faker } from '@faker-js/faker';
import { BadgeColorEnum } from './constants';

const BadgeStorybookTemplate: ComponentStory<typeof BadgeStorybook> = (
  args,
) => <BadgeStorybook {...args} />;

BadgeStorybook.displayName = 'Badge';

export const Badgeonstrong = BadgeStorybookTemplate.bind({});
Badgeonstrong.args = {
  color: BadgeColorEnum.ONSTRONG,
  value: faker.number.int({ min: 0, max: 999 }),
};

export const Badgemain = BadgeStorybookTemplate.bind({});
Badgemain.args = {
  // Default value
  color: BadgeColorEnum.MAIN,
  value: faker.number.int({ min: 0, max: 999 }),
};

export const Badgewarning = BadgeStorybookTemplate.bind({});
Badgewarning.args = {
  color: BadgeColorEnum.WARNING,
  value: faker.number.int({ min: 0, max: 999 }),
};

export const Badgegrey = BadgeStorybookTemplate.bind({});
Badgegrey.args = {
  color: BadgeColorEnum.GREY,
  value: faker.number.int({ min: 0, max: 999 }),
};

export const Badgeover999 = BadgeStorybookTemplate.bind({});
Badgeover999.args = {
  value: faker.number.int({ min: 1000, max: 10000 }),
};

export const Badgesingleunit = BadgeStorybookTemplate.bind({});
Badgesingleunit.args = {
  value: faker.number.int({ min: 0, max: 9 }),
};

export default {
  title: 'Fabrique/Badge/Stories',
  component: BadgeStorybook,
  argTypes: {
    color: {
      description: 'The badge color theme',
      control: { type: 'inline-radio' },
      options: [
        BadgeColorEnum.GREY,
        BadgeColorEnum.MAIN,
        BadgeColorEnum.ONSTRONG,
        BadgeColorEnum.WARNING,
      ],
    },
  },
} as ComponentMeta<typeof BadgeStorybook>;
