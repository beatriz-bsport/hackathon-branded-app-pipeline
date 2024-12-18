import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CommunicationSelectTemplate, {
  Props as CommunicationSelectTemplateProps,
} from './CommunicationSelectTemplate.component';

export default {
  title: 'Library/Communication-V2/TemplateSelector',
  component: CommunicationSelectTemplate,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Template email selector',
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '3em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div>
          <Story />
        </div>
      </div>
    ),
  ],
} as ComponentMeta<typeof CommunicationSelectTemplate>;

const Template: ComponentStory<typeof CommunicationSelectTemplate> = (
  args: CommunicationSelectTemplateProps,
) => <CommunicationSelectTemplate {...args} />;

export const SimpleSelector = Template.bind({});
