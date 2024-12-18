import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { fakerEN as faker } from '@faker-js/faker';

import InfoButton, { InfoButtonStorybook } from '.';
import { InfoButtonSeverityEnum } from './constants';

// displayName must be overriden for preview code to actually work on mdx document.
InfoButtonStorybook.displayName = 'InfoButton';

const title = faker.lorem.word(10);
const text = faker.lorem.text();

export default {
  title: 'Components/CssOnly/InfoButton',
  component: InfoButton,
  argTypes: {
    isMobile: {
      control: {
        type: 'boolean',
      },
    },
    text: {
      control: {
        type: 'text',
      },
    },
    title: {
      control: {
        type: 'text',
      },
    },
    severity: {
      control: {
        type: 'select',
        options: [
          InfoButtonSeverityEnum.INFO,
          InfoButtonSeverityEnum.ERROR,
          InfoButtonSeverityEnum.WARNING,
        ],
      },
    },
  },
  parameters: {
    layout: 'centered',
  },
} as ComponentMeta<typeof InfoButtonStorybook>;

const defaultArgs = {
  text,
  title,
};

const Template: ComponentStory<typeof InfoButton> = (args) => (
  <InfoButtonStorybook {...args} />
);

export const Infotooltip = Template.bind({});
Infotooltip.args = defaultArgs;

export const Infodrawer = Template.bind({});
Infodrawer.args = { ...defaultArgs, isMobile: true };

export const Warningtooltip = Template.bind({});
Warningtooltip.args = {
  ...defaultArgs,
  severity: InfoButtonSeverityEnum.WARNING,
};

export const Warningdrawer = Template.bind({});
Warningdrawer.args = {
  ...defaultArgs,
  severity: InfoButtonSeverityEnum.WARNING,
  isMobile: true,
};

export const Errortooltip = Template.bind({});
Errortooltip.args = { ...defaultArgs, severity: InfoButtonSeverityEnum.ERROR };

export const Errordrawer = Template.bind({});
Errordrawer.args = {
  ...defaultArgs,
  severity: InfoButtonSeverityEnum.ERROR,
  isMobile: true,
};
