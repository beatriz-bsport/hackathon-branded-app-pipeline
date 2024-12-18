import React from 'react';

import AddIcon from '@material-ui/icons/Add';
import { fakerEN as faker } from '@faker-js/faker';

import {
  ButtonColor,
  ButtonForStorybook,
  ButtonSize,
  ButtonVariant,
  type Props,
} from '.';

import './styles-storybook.css';

const ButtonTemplate = (args: Props) => (
  <ButtonForStorybook {...args}>{faker.lorem.word(10)}</ButtonForStorybook>
);

const ButtonTextWithIconTemplate = (args: Props) => (
  <ButtonForStorybook {...args}>
    {faker.lorem.word(10)} <AddIcon />
  </ButtonForStorybook>
);

const ButtonIconTemplate = (args: Props) => {
  return (
    <ButtonForStorybook {...args}>
      <AddIcon />
    </ButtonForStorybook>
  );
};

const baseArgs = {
  isLoading: false,
  isDisabled: false,
  classes: {
    root: '',
    text: '',
  },
};

export const ButtonIdle = ButtonTemplate.bind({});
ButtonIdle.args = baseArgs;

export const ButtonLoading = ButtonTemplate.bind({});
ButtonLoading.args = {
  ...baseArgs,
  isLoading: true,
};

export const ButtonDisabled = ButtonTemplate.bind({});
ButtonDisabled.args = {
  ...baseArgs,
  isDisabled: true,
};

export const ButtonStyled = ButtonTemplate.bind({});
ButtonStyled.args = {
  ...baseArgs,
  classes: {
    root: 'bs-button-storybook__container',
    text: 'bs-button-storybook__text',
  },
};

export const ButtonTextWithIcon = ButtonTextWithIconTemplate.bind({});
ButtonTextWithIcon.args = {
  ...baseArgs,
};

export const ButtonIcon = ButtonIconTemplate.bind({});
ButtonIcon.args = {
  ...baseArgs,
  variant: 'icon',
  classes: {
    // root: 'bs-button-icon-storybook__container',
  },
};

export const ButtonOutlined = ButtonTemplate.bind({});
ButtonOutlined.args = {
  ...baseArgs,
  variant: 'outlined',
};

export const ButtonPrimary = ButtonTemplate.bind({});
ButtonPrimary.args = {
  ...baseArgs,
  color: ButtonColor.PRIMARY,
};

export const ButtonSecondary = ButtonTemplate.bind({});
ButtonSecondary.args = {
  ...baseArgs,
  color: ButtonColor.SECONDARY,
};

export const ButtonSmall = ButtonTemplate.bind({});
ButtonSmall.args = {
  ...baseArgs,
  size: ButtonSize.SMALL,
};

export const ButtonLarge = ButtonTemplate.bind({});
ButtonLarge.args = {
  ...baseArgs,
  size: ButtonSize.LARGE,
};

export default {
  title: 'Components/CssOnly/Button',
  component: ButtonForStorybook,
  argTypes: {
    color: {
      control: {
        type: 'select',
        options: [ButtonColor.PRIMARY, ButtonColor.SECONDARY],
      },
    },
    variant: {
      control: {
        type: 'select',
        options: [ButtonVariant.ICON, ButtonVariant.OUTLINED],
      },
    },
    size: {
      control: {
        type: 'select',
        options: [ButtonSize.SMALL, ButtonSize.MEDIUM, ButtonSize.LARGE],
      },
    },
    onClick: {
      action: 'onClick',
    },
  },
  parameters: {
    docs: {
      page: null,
    },
    layout: 'centered',
  },
};
