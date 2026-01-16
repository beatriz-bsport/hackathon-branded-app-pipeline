import {
  CoreBackendEnvironment,
  FeatureBranchIdentifier,
  getBackendEnvironment,
} from '#src/utils/environment';
import {
  DestinationKind,
  DestinationStatus,
  Events as SequentialMarketingEventListened,
  FilterIdentifier as FilteringIdentifier,
  TriggerIdentifier,
  MarketingActionKind,
  MarketingActions as MarketingActionCommunicationKind,
} from '#src/libs/sequential_marketing/constants';
import ABANDONED_CHECKOUT_COVER from '#src/libs/sequential_marketing/images/template-covers/abandoned-checkout-recovery-cover.png';

import type { TFunction } from 'i18next';
import type {
  CadenceConfigData,
  CadenceTemplate,
  CadenceTemplateEmailDesign,
  CadenceTemplateEmailDesignMap,
} from '../types';

const ENTRY_EMAIL_DESIGN_BY_ENV_AND_LANGUAGE: CadenceTemplateEmailDesignMap = {
  [CoreBackendEnvironment.LOCAL]: {
    // These local IDs correspond to email designs created in local environment
    // and must be configured for local development
    en: null,
    fr: null,
  },
  [CoreBackendEnvironment.DEV]: {
    en: 30989,
    fr: 30990,
  },
  [CoreBackendEnvironment.STAGING]: {
    en: 20336,
    fr: 20341,
  },
  [CoreBackendEnvironment.PRODUCTION]: {
    en: 153667,
    fr: 153669,
  },
  [FeatureBranchIdentifier.PIKACHU]: {
    en: null,
    fr: null,
  },
};

const getEntryEmailDesign = (): CadenceTemplateEmailDesign | null => {
  const backendEnvironment = getBackendEnvironment();
  if (!backendEnvironment) return null;

  const entryEmailDesignByLanguage =
    ENTRY_EMAIL_DESIGN_BY_ENV_AND_LANGUAGE[
      backendEnvironment as keyof CadenceTemplateEmailDesignMap
    ];
  return entryEmailDesignByLanguage ?? null;
};

const getAbandonedCheckoutConfig = (t: TFunction): CadenceConfigData => {
  return {
    name: t('audience.template.configs.abandonedCartRecovery.name'),
    is_multiple_visit_allowed: true,
    initial_config: {
      entry_list: [
        {
          trigger_config: {
            identifier: TriggerIdentifier.EVENT,
            timeout: null,
            timeout_hours: null,
            event_type:
              SequentialMarketingEventListened.CADENCE_EVENT_BASKET_ADD_ITEM,
            filtered_pks: null,
          },
          destination_config: {
            kind: DestinationKind.OUTSIDE_TO_STEP,
            source_id: null,
            destination_id: 100,
            status: null,
            reason: null,
          },
          filtering_config: {
            identifier: FilteringIdentifier.EMPTY,
            smartlist_pk: null,
          },
          canvas: null,
        },
      ],
      win_exit_list: [
        {
          trigger_config: {
            identifier: TriggerIdentifier.EVENT,
            timeout: null,
            timeout_hours: null,
            event_type:
              SequentialMarketingEventListened.CADENCE_EVENT_BASKET_FINALIZED,
            filtered_pks: null,
          },
          destination_config: {
            kind: DestinationKind.CADENCE_TO_OUTSIDE,
            source_id: null,
            destination_id: null,
            status: DestinationStatus.WIN,
            reason: null,
          },
          filtering_config: {
            identifier: FilteringIdentifier.EMPTY,
            smartlist_pk: null,
          },
          canvas: null,
        },
      ],
      lose_exit_list: [
        {
          trigger_config: {
            identifier: TriggerIdentifier.TIMEOUT,
            timeout: 2,
            timeout_hours: 0,
            event_type: null,
            filtered_pks: null,
          },
          destination_config: {
            kind: DestinationKind.CADENCE_TO_OUTSIDE,
            source_id: null,
            destination_id: null,
            status: DestinationStatus.FAIL,
            reason: null,
          },
          filtering_config: {
            identifier: FilteringIdentifier.EMPTY,
            smartlist_pk: null,
          },
          canvas: null,
        },
      ],
    },
    steps: [
      {
        id: 101,
        name: t(
          'audience.template.configs.abandonedCartRecovery.steps.reminder.name',
        ),
        is_entrypoint: false,
        exits: [],
        canvas: {
          position: { x: '505.68576218480985', y: '13.63685122388162' },
        },
        marketing_actions: [
          {
            name: 'Name by default', // No need for translation, not displayed to end user
            kind: MarketingActionKind.COMMUNICATION,
            action_spec: {
              subject: t(
                'audience.template.configs.abandonedCartRecovery.steps.reminder.actions.push_notification.subject',
              ),
              email_design: null,
              text_content: t(
                'audience.template.configs.abandonedCartRecovery.steps.reminder.actions.push_notification.text',
              ),
              communication_kind:
                MarketingActionCommunicationKind.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
            },
          },
        ],
      },
      {
        id: 100,
        name: 'entrypoint', // No need for translation, not displayed to end user
        is_entrypoint: true,
        exits: [
          {
            trigger_config: {
              identifier: TriggerIdentifier.TIMEOUT,
              timeout: 1,
              timeout_hours: 0,
              event_type: null,
              filtered_pks: null,
            },
            destination_config: {
              kind: DestinationKind.STEP_TO_STEP,
              source_id: 100,
              destination_id: 101,
              status: null,
              reason: null,
            },
            filtering_config: {
              identifier: FilteringIdentifier.EMPTY,
              smartlist_pk: null,
            },
            canvas: {
              position: { x: '127.898516415718', y: '38.32353176199638' },
            },
          },
        ],
        canvas: {
          position: { x: '-277.91503614791355', y: '-30.553033807272016' },
        },
        marketing_actions: [
          {
            name: 'Name by default', // No need for translation, not displayed to end user
            kind: MarketingActionKind.COMMUNICATION,
            action_spec: {
              subject: t(
                'audience.template.configs.abandonedCartRecovery.steps.entry.actions.push_notification.subject',
              ),
              email_design: null,
              text_content: t(
                'audience.template.configs.abandonedCartRecovery.steps.entry.actions.push_notification.text',
              ),
              communication_kind:
                MarketingActionCommunicationKind.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
            },
          },
          {
            name: 'Name by default', // No need for translation, not displayed to end user
            kind: MarketingActionKind.COMMUNICATION,
            action_spec: {
              subject: t(
                'audience.template.configs.abandonedCartRecovery.steps.entry.actions.email_design.subject',
              ),
              email_design: getEntryEmailDesign(),
              text_content: '',
              communication_kind:
                MarketingActionCommunicationKind.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
            },
          },
        ],
      },
    ],
  };
};

export const AbandonedCheckoutRecovery: CadenceTemplate = {
  description: 'audience.template.configs.abandonedCartRecovery.description',
  cover: ABANDONED_CHECKOUT_COVER,
  getConfig: getAbandonedCheckoutConfig,
};
