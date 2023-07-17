import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import InnerStepCard, { InnerStepCardProps } from './InnerStepCard.component';
import {
  cadenceStepFactory,
  stepMarketingActionFactory,
} from '#libs/sequential_marketing/factories';
import {
  MarketingActionKind,
  MarketingActions,
} from '#libs/sequential_marketing/constants';
import { tagWithoutGroupFactory } from '#libs/tag/factory';
import { companyEmailListFactory } from '#libs/email-editor/factories/EmailTemplateSummary';

export default {
  title: 'Components/Cadences/CadenceNodes/InnerStep',
  component: InnerStepCard,
  parameters: {
    docs: {
      page: null,
    },
    description: {
      component: 'Inner step card component for cadence graph',
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
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof InnerStepCard>;

const basicStep = cadenceStepFactory({ name: '{Step name}' });

const longNameStep = cadenceStepFactory({
  name: '{Step with looooooong name}',
});

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

const tag = tagWithoutGroupFactory();
const getTag = (_id: string) => tag;

const emailTemplateSummary = companyEmailListFactory(1, 1)[0];
const getEmailTemplate = (_id: string) => emailTemplateSummary;

const marketingActionFullList = [
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
  stepMarketingActionFactory({
    kind: MarketingActionKind.COMMUNICATION,
    communication_kind:
      MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
    email_design: emailTemplateSummary.id,
  }),
  stepMarketingActionFactory({
    kind: MarketingActionKind.TAG,
    tag_id: tag.id,
  }),
];

const InnerStepCardTemplate: ComponentStory<typeof InnerStepCard> = (
  args: InnerStepCardProps,
) => <InnerStepCard {...args} />;

export const Empty = InnerStepCardTemplate.bind({});
Empty.args = {
  step: basicStep,
  addMarketingAction: () => {},
};

export const WithMarketingAction = InnerStepCardTemplate.bind({});
WithMarketingAction.args = {
  step: longNameStep,
  marketingActionList: [emailMarketingAction],
};

export const AddActionDisabled = InnerStepCardTemplate.bind({});
AddActionDisabled.args = {
  step: basicStep,
  marketingActionList: [emailMarketingAction],
  addMarketingAction: () => {},
  disableAddMarketingAction: true,
};

export const Common = InnerStepCardTemplate.bind({});
Common.args = {
  step: basicStep,
  marketingActionList: marketingActionList,
  addMarketingAction: () => {},
};

export const Full = InnerStepCardTemplate.bind({});
Full.args = {
  step: basicStep,
  marketingActionList: marketingActionFullList,
  addMarketingAction: () => {},
  getTag: getTag,
  getEmailTemplate: getEmailTemplate,
};

export const WithAddStep = InnerStepCardTemplate.bind({});
WithAddStep.args = {
  step: basicStep,
  marketingActionList: marketingActionList,
  addMarketingAction: () => {},
  addNextStep: () => {},
};
