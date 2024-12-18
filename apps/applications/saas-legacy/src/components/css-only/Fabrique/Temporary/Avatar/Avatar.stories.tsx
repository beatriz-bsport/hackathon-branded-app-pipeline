import React from 'react';
import { fakerEN as faker } from '@faker-js/faker';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import Avatar, {
  AvatarSizeEnum,
  AvatarStorybook,
  AvatarTypeEnum,
  type AvatarProps,
} from '.';

AvatarStorybook.displayName = 'Avatar';

const fakePicture = faker.image.urlLoremFlickr();

export default {
  title: 'Fabrique/Avatar/Stories',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    picture: {
      description: "The picture's path you want to use for the Avatar",
      control: { type: 'text' },
    },
    size: {
      description: 'The size of the avatar',
      control: { type: 'inline-radio' },
      options: [
        AvatarSizeEnum.SM,
        AvatarSizeEnum.MD,
        AvatarSizeEnum.LG,
        AvatarSizeEnum.XL,
      ],
    },
    className: {
      description: 'Extend the styles applied to the component.',
    },
    type: {
      description: 'The value that will define the default picture',
      control: { type: 'inline-radio' },
      options: [AvatarTypeEnum.USER, AvatarTypeEnum.PLACE],
    },
  },
} as ComponentMeta<typeof AvatarStorybook>;

const Template: ComponentStory<typeof Avatar> = (args: AvatarProps) => (
  <AvatarStorybook {...args} />
);

export const Mediumavatar = Template.bind({});
Mediumavatar.args = {
  size: AvatarSizeEnum.MD,
};
export const Smallavatar = Template.bind({});
Smallavatar.args = {
  size: AvatarSizeEnum.SM,
};
export const Largeavatar = Template.bind({});
Largeavatar.args = {
  size: AvatarSizeEnum.LG,
};

export const Extralargeavatar = Template.bind({});
Extralargeavatar.args = {
  size: AvatarSizeEnum.XL,
};

export const Avatarwithpicture = Template.bind({});
Avatarwithpicture.args = {
  picture: fakePicture,
  size: AvatarSizeEnum.XL,
};

export const EstablishmentPlaceholder = Template.bind({});
EstablishmentPlaceholder.args = {
  size: AvatarSizeEnum.XL,
  type: 'place',
};
