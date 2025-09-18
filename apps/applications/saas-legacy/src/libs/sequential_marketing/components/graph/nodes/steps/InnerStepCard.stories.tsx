import React from 'react';

import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { fakerEN as faker } from '@faker-js/faker';

import InnerStepCard, { InnerStepCardProps } from './InnerStepCard.component';

import {
  cadenceStepFactory,
  stepMarketingActionFactory,
} from '#src/libs/sequential_marketing/factories';
import {
  MarketingActionKind,
  MarketingActions,
} from '#src/libs/sequential_marketing/constants';
import { tagWithoutGroupFactory } from '#src/libs/tag/factory';
import { companyEmailListFactory } from '#src/libs/email-editor/factories/EmailTemplateSummary';

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
  argTypes: {
    step: {
      description: 'The StoredStep corresponding.',
    },
    disableAddMarketingAction: {
      control: 'boolean',
      description:
        '(Optional) Boolean abling or not the add of marketing action by user.',
    },
    disabled: {
      control: 'boolean',
      description:
        '(Optional) Boolean abling or not the step to be edited by user.',
    },
    isSelected: {
      control: 'boolean',
      description:
        '(Optional) Boolean telling if the step is selected by the user in edit mode.',
    },
    stepMemberCount: {
      description:
        '(Optional) Number of members in the step. Only displayed when step not disabled, i.e. user not in edit mode.',
    },
    marketingActionList: {
      description:
        '(Optional) Marketing actions added to the step by the user.',
    },
    onDelete: {
      description:
        'Action to be triggered when the step is deleted by the user.',
    },
    handleConvertIntoExit: {
      description:
        'Action to be triggered when the step is converted into exit by the user.',
    },
    onCardClick: {
      description:
        'Action to be triggered when the step gets clicked by the user.',
    },
    addNextStep: {
      description:
        'Action to be triggered when the button to add flow after the step is clicked by the user.',
    },
    addMarketingAction: {
      description:
        '(Optional) Action to be triggered when user clicks on "add an action" button.',
    },
    editMarketingAction: {
      description:
        '(Optional) Action to be triggered when user clicks on a marketing action to edit.',
    },
    getEmailTemplate: {
      description:
        '(Optional) Action to be triggered when user clicks on email template action to retrieve the templates.',
    },
    getTag: {
      description:
        '(Optional) Action to be triggered when user clicks on tag action to retrieve the tags.',
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

// -------- STEPS --------

const basicStep = cadenceStepFactory({ name: '{Step name}' });
const longNameStep = cadenceStepFactory({
  name: '{Step with looooooong name}',
});

// -------- NOTIFICATIONS ---------

const tag = tagWithoutGroupFactory();
const emailTemplateSummary = companyEmailListFactory(1, 1)[0];

// -------- MARKETING ACTIONS ---------

const emailMarketingAction = stepMarketingActionFactory({
  kind: MarketingActionKind.COMMUNICATION,
  communication_kind: MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
});
const smsMarketingAction = stepMarketingActionFactory({
  kind: MarketingActionKind.COMMUNICATION,
  communication_kind: MarketingActions.CADENCE_MARKETING_ACTION_SMS,
});
const pushNotificationMarketingAction = stepMarketingActionFactory({
  kind: MarketingActionKind.COMMUNICATION,
  communication_kind:
    MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
});
const emailTemplateMarketingAction = stepMarketingActionFactory({
  kind: MarketingActionKind.COMMUNICATION,
  communication_kind: MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
  email_design: emailTemplateSummary.id,
});
const tagMarketingAction = stepMarketingActionFactory({
  kind: MarketingActionKind.TAG,
  tag_id: tag.id,
});

const marketingActionList = [
  emailMarketingAction,
  smsMarketingAction,
  pushNotificationMarketingAction,
];

const marketingActionFullList = [
  emailMarketingAction,
  smsMarketingAction,
  pushNotificationMarketingAction,
  emailTemplateMarketingAction,
  tagMarketingAction,
];

// -------- ACTIONS ---------

const actionData = {
  addMarketingAction: action('addMarketingAction'),
  addNextStep: action('addNextStep'),
  editMarketingAction: action('editMarketingAction'),
  getEmailTemplate: action('getEmailTemplate'),
  getTag: action('getTag'),
  handleConvertIntoExit: action('handleConvertIntoExit'),
  onCardClick: action('onCardClick'),
  onDelete: action('onDelete'),
};

// -------- VARIANTS ---------

const InnerStepCardTemplate: ComponentStory<typeof InnerStepCard> = (
  args: InnerStepCardProps,
) => <InnerStepCard {...args} />;

export const Empty = InnerStepCardTemplate.bind({});
Empty.args = {
  step: basicStep,
  addMarketingAction: actionData.addMarketingAction,
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
  addMarketingAction: actionData.addMarketingAction,
  disableAddMarketingAction: true,
};

export const Common = InnerStepCardTemplate.bind({});
Common.args = {
  step: basicStep,
  marketingActionList: marketingActionList,
  addMarketingAction: actionData.addMarketingAction,
};

export const Full = InnerStepCardTemplate.bind({});
Full.args = {
  step: basicStep,
  marketingActionList: marketingActionFullList,
  addMarketingAction: actionData.addMarketingAction,
  getTag: actionData.getTag,
  getEmailTemplate: actionData.getEmailTemplate,
};

export const WithAddStep = InnerStepCardTemplate.bind({});
WithAddStep.args = {
  step: basicStep,
  marketingActionList: marketingActionList,
  addMarketingAction: actionData.addMarketingAction,
  addNextStep: actionData.addNextStep,
};

export const WithMembersCountChipStep = InnerStepCardTemplate.bind({});
WithMembersCountChipStep.args = {
  step: basicStep,
  stepMemberCount: faker.number.int(),
  disabled: true,
  marketingActionList: marketingActionList,
  addMarketingAction: actionData.addMarketingAction,
  addNextStep: actionData.addNextStep,
};
