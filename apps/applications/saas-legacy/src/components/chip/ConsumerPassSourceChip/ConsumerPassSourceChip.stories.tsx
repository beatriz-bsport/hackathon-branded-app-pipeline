import React from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import ConsumerPassSourceChip from './ConsumerPassSourceChip.component';
import { fakerEN as faker } from '@faker-js/faker';

export default {
  title: 'Components/Chip/ConsumerPassSourceChip',
  component: ConsumerPassSourceChip,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component:
        'Chip used to display the information related to the origin of the consumer pack or private pass, especially when it is shared from another studio within the same franchise.',
    },
    layout: 'centered',
  },
  argTypes: {
    companySourceName: {
      control: 'text',
      description: 'The name of the company source.',
    },
    companySourcePrimaryColor: {
      control: 'color',
      description: 'The primary color of the company source theme.',
    },
    tooltipText: {
      control: 'text',
      description: 'The text to display in the tooltip on hover.',
    },
  },
} as ComponentMeta<typeof ConsumerPassSourceChip>;

const Template: ComponentStory<typeof ConsumerPassSourceChip> = (
  args: React.ComponentProps<typeof ConsumerPassSourceChip>,
) => <ConsumerPassSourceChip {...args} />;

export const WithoutSourceInformation = Template.bind({});

export const WithoutSourceName = Template.bind({});
WithoutSourceName.args = {
  companySourcePrimaryColor: faker.color.rgb(),
};

export const WithoutSourceColor = Template.bind({});
WithoutSourceColor.args = {
  companySourceName: faker.company.name(),
  tooltipText: faker.company.catchPhrase(),
};

export const WithAllSourceInformation = Template.bind({});
WithAllSourceInformation.args = {
  companySourceName: faker.company.name(),
  companySourcePrimaryColor: faker.color.rgb(),
  tooltipText: faker.company.catchPhrase(),
};
