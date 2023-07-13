import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import CadenceNodeContent, {
  CadenceNodeContentProps,
} from './CadenceNodeContent.component';
import { stepMarketingActionFactory } from '#libs/sequential_marketing/factories';
import {
  MarketingActionKind,
  MarketingActions,
} from '#libs/sequential_marketing/constants';

export default {
  title: 'Components/Cadences/CadenceNodes/Content',
  component: CadenceNodeContent,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component:
        "This component represents the core structure of a cadence card's content, its skeletal framework.",
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

const emailMarketingAction = stepMarketingActionFactory({
  kind: MarketingActionKind.COMMUNICATION,
  communication_kind: MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
});

const marketingActionList = [
  stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind: MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
  }),
  stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind: MarketingActions.CADENCE_MARKETING_ACTION_SMS,
  }),
  stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind:
      MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
  }),
];

export const OneMarketingAction = Template.bind({});
OneMarketingAction.args = {
  marketingActionList: [emailMarketingAction],
};

export const MultipleMarketingAction = Template.bind({});
MultipleMarketingAction.args = {
  marketingActionList: marketingActionList,
};

export const AddMarketingAction = Template.bind({});
AddMarketingAction.args = { addMarketingAction: () => {} };
