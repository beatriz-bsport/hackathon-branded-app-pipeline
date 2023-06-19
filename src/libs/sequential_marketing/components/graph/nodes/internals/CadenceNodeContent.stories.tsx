import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceNodeContent, {
  CadenceNodeContentProps,
} from './CadenceNodeContent.component';

export default {
  title: 'Components/Cadences/CadenceNodes/Content',
  component: CadenceNodeContent,
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '3em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '30em' }}>
          <Story />
        </div>
      </div>
    ),
  ],
} as ComponentMeta<typeof CadenceNodeContent>;

const Template: ComponentStory<typeof CadenceNodeContent> = (
  args: CadenceNodeContentProps,
) => <CadenceNodeContent {...args} />;

export const OneMarketingAction = Template.bind({});
OneMarketingAction.args = {
  marketingActionChipList: [
    {
      name: '{ Email object }',
      icon: 'Email',
    },
  ],
};

export const MultipleMarketingAction = Template.bind({});
MultipleMarketingAction.args = {
  marketingActionChipList: [
    {
      name: '{ Email object }',
      icon: 'Email',
    },
    {
      name: '{ Message preview... }',
      icon: 'Textsms',
    },
    {
      name: '{ Notification title... }',
      icon: 'Notifications',
    },
  ],
};

export const AddMarketingAction = Template.bind({});
AddMarketingAction.args = { addMarketingAction: () => {} };
