import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import InnerStepCard, { InnerStepCardProps } from './InnerStepCard.component';

export default {
  title: 'Components/Cadences/CadenceNodes/InnerStep',
  component: InnerStepCard,
  decorators: [
    (Story) => (
      <div
        style={{
          margin: '3em',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof InnerStepCard>;

const InnerStepCardTemplate: ComponentStory<typeof InnerStepCard> = (
  args: InnerStepCardProps,
) => <InnerStepCard {...args} />;

export const Empty = InnerStepCardTemplate.bind({});
Empty.args = {
  stepName: '{Step name}',
  addMarketingAction: () => {},
};

export const WithMarketingAction = InnerStepCardTemplate.bind({});
WithMarketingAction.args = {
  stepName: '{Step name looooooong name}',
  marketingActionChipList: [{ name: '{ Email object }', icon: 'Email' }],
};

export const AddActionDisabled = InnerStepCardTemplate.bind({});
AddActionDisabled.args = {
  stepName: '{Step name}',
  marketingActionChipList: [{ name: '{ Email object }', icon: 'Email' }],
  addMarketingAction: () => {},
  disableAddMarketingAction: true,
};

export const Common = InnerStepCardTemplate.bind({});
Common.args = {
  stepName: '{Step name}',
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
  addMarketingAction: () => {},
};

export const Full = InnerStepCardTemplate.bind({});
Full.args = {
  stepName: '{Step name}',
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
    {
      name: '{ Tag name }',
      icon: 'Label',
    },
    {
      name: '{ Email title }',
      icon: 'LibraryBooks',
    },
  ],
  addMarketingAction: () => {},
};
