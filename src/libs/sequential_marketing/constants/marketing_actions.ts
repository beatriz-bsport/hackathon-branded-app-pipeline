import type { ArgTypes } from '@storybook/react';
import type { MarketingActionEssentials } from '#libs/sequential_marketing/types';

export enum MarketingActionKind {
  COMMUNICATION = 'COMMUNICATION',
  TAG = 'TAG',
}

export enum MarketingActions {
  CADENCE_MARKETING_ACTION_WRITTEN_EMAIL = 1,
  CADENCE_MARKETING_ACTION_SMS = 2,
  CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION = 3,
  CADENCE_MARKETING_ACTION_TAG_MANAGEMENT = 4,
  CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE = 5,
}

export const CADENCE_MARKETING_ACTION_CHOICES = [
  MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
  MarketingActions.CADENCE_MARKETING_ACTION_SMS,
  MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
  MarketingActions.CADENCE_MARKETING_ACTION_TAG_MANAGEMENT,
  MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
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
