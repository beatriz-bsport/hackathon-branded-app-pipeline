import type { ArgTypes } from '@storybook/react';
import type { MarketingActionEssentials } from '#src/libs/sequential_marketing/types';

export enum MarketingActionKind {
  COMMUNICATION = 'COMMUNICATION',
  TAG = 'TAG',
}

export enum TagActionType {
  ADD = 'add',
  REMOVE = 'remove',
}

export enum MarketingActions {
  WRITTEN_EMAIL = 1,
  SMS = 2,
  PUSH_NOTIFICATION = 3,
  ADD_TAG = 4,
  EMAIL_TEMPLATE = 5,
  REMOVE_TAG = 6,
}

export const CADENCE_MARKETING_ACTION_CHOICES = [
  MarketingActions.WRITTEN_EMAIL,
  MarketingActions.SMS,
  MarketingActions.PUSH_NOTIFICATION,
  MarketingActions.EMAIL_TEMPLATE,
  MarketingActions.ADD_TAG,
  MarketingActions.REMOVE_TAG,
];

export const CADENCE_COMMUNICATION_FIELD_HEIGHT = 5;

export const CADENCE_MARKETING_ACTION_MAX_NUMBER = 5;

// FOR STORYBOOK ARGUMENTS DEFINITION
export const MarketingActionArgTypes: ArgTypes<MarketingActionEssentials> = {
  fetchEmailSummaryList: {
    action: 'fetchEmailSummaryList',
    description: 'Fetch email summary list action',
  },
  getEmailDetail: {
    action: 'getEmailDetail',
    description: 'Get email detail action',
  },
  emailDetailList: {
    description:
      'Dictionary of EmailTemplateDetail objects, indexed by template IDs, representing detailed email configurations for the company.',
    control: { type: 'object' },
  },
  emailDetailListLoading: {
    description:
      'Indicates whether the email detail list is currently being fetched.',
    control: { type: 'boolean' },
  },
  emailSummaryList: {
    description:
      'List of EmailTemplateSummary objects, providing a summary of all company email templates.',
    control: { type: 'object' },
  },
  emailSummaryListLoading: {
    description:
      'Indicates whether the email summary list is still being fetched.',
    control: { type: 'boolean' },
  },
  resolvedGenericTags: {
    description:
      'Set of resolved generic tags for content substitution in communications, including values for app URLs, company information, and social media URLs.',
    control: { type: 'object' },
  },
  tagCategories: {
    description:
      'Set of specific tags used in communications for content substitution, with values representing member or company information.',
    control: { type: 'object' },
  },
  tagList: {
    description:
      'List of tags used to categorize and identify members in various categories.',
    control: { type: 'object' },
  },
};
