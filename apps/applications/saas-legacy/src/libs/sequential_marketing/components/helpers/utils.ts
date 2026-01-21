import {
  EventsCategory,
  TriggerIdentifier,
  CADENCE_EVENT_GROUPED_BY_CATEGORY,
  Events,
  FilterIdentifier,
  TriggerKind,
  MarketingActionKind,
  MarketingActions,
  TRIGGER_TEMPORARY_ID,
  CADENCE_EVENT_CATEGORY_CHOICES,
  TRIGGER_DEFAULT_ICON,
} from '#src/libs/sequential_marketing/constants';

import type {
  ConnectedTrigger,
  StepMarketingActions,
  StepMarketingActionsCommunicationSpec,
  StepMarketingActionsTagSpec,
  TriggerEventConfig,
} from '#src/libs/sequential_marketing/types';
import type { EmailTemplateSummary } from '#src/libs/email-editor/types';
import type { Tag } from '#src/libs/tag/types';

/**
 * @description Dictionnary linking each cadence event category to its corresponding icon name
 */
const categoryStringIconDict = {
  [EventsCategory.CADENCE_EVENT_PURCHASE_CATEGORY]: 'ShoppingCart',
  [EventsCategory.CADENCE_EVENT_BOOKING_CATEGORY]: 'ConfirmationNumber',
  [EventsCategory.CADENCE_EVENT_BASKET_CATEGORY]: 'ShoppingBasket',
  [EventsCategory.CADENCE_EVENT_INVOICE_CATEGORY]: 'Receipt',
  [EventsCategory.CADENCE_EVENT_BILLING_PLAN_CATEGORY]: 'CreditCard',
};

/**
 * @description Dictionnary linking each cadence trigger kind to its corresponding icon name
 */
export const triggerIconByKind: { [key in TriggerKind]: string } = {
  [TriggerKind.ONLY_EVENT_TRIGGER]: 'OfflineBolt',
  [TriggerKind.ONLY_SMARTLIST_FILTERING]: 'People',
  [TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING]: 'TriggeredPerson',
  [TriggerKind.ONLY_TIMEOUT]: 'Timer',
};

/**
 * @description Dictionnary linking each MarketingAction to its corresponding icon name
 */
export const marketingActionIconDict: { [key in MarketingActions]: string } = {
  [MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL]: 'Mail',
  [MarketingActions.CADENCE_MARKETING_ACTION_SMS]: 'Textsms',
  [MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION]:
    'Notifications',
  [MarketingActions.CADENCE_MARKETING_ACTION_TAG_MANAGEMENT]: 'Label',
  [MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE]: 'LibraryBooks',
};

/** Get the icon name which corresponds to the eventType in parameter
 * @param {Events} eventType - Sequential marketing event type
 * @returns {string} - Return the corresponding icon name used to build a CustomMuiIcon
 */
export const getEventCategoryIconAsString = (eventType: Events): string => {
  for (const category of CADENCE_EVENT_CATEGORY_CHOICES) {
    if (CADENCE_EVENT_GROUPED_BY_CATEGORY[category]?.includes(eventType)) {
      return categoryStringIconDict[category];
    }
  }
  return TRIGGER_DEFAULT_ICON;
};

/** Get the trigger kind of the connected trigger in parameter
 * @param {ConnectedTrigger} connected_trigger_config - Cadence connected trigger config
 * @returns {string} - Return the kind of the trigger passed in paramater or TriggerKind.ONLY_EVENT_TRIGGER if not recognized
 */
export const getTriggerKind = (connected_trigger_config: ConnectedTrigger) => {
  switch (connected_trigger_config?.trigger_config?.identifier) {
    case TriggerIdentifier.EVENT:
      if (
        connected_trigger_config?.filtering_config?.identifier ===
        FilterIdentifier.SMARTLIST
      ) {
        return TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING;
      }
      return TriggerKind.ONLY_EVENT_TRIGGER;
    case TriggerIdentifier.TIMEOUT:
      return TriggerKind.ONLY_TIMEOUT;
    case TriggerIdentifier.EMPTY:
      if (
        connected_trigger_config?.filtering_config?.identifier ===
        FilterIdentifier.SMARTLIST
      ) {
        return TriggerKind.ONLY_SMARTLIST_FILTERING;
      }
      return TriggerKind.ONLY_EVENT_TRIGGER;
    default:
      return TriggerKind.ONLY_EVENT_TRIGGER;
  }
};

/** Get the icon name which corresponds to the ConnectedTrigger in parameter
 * @param {ConnectedTrigger} connected_trigger_config - Cadence ConnectedTrigger config
 * @returns {string} - Return the icon name of the trigger passed in paramater depending on the trigger kind.
 *                     If the trigger kind is not recognized, return the EVENT icon name.
 */
export const getTriggerIcon = (connected_trigger_config: ConnectedTrigger) => {
  const kind = getTriggerKind(connected_trigger_config);
  return triggerIconByKind[kind];
};

/** Get the icon name which corresponds to the StepMarketingAction in parameter
 * @param {StepMarketingActions} marketingAction - Cadence StepMarketingAction
 * @returns {string} - Return the icon name of the StepMarketingAction passed in paramater.
 *                     If the StepMarketingAction kind is not recognized, return the SMS icon name.
 */
export const getMarketingActionChipIcon = (
  marketingAction: StepMarketingActions,
) => {
  let actionSpec = marketingAction?.action_spec;

  switch (marketingAction?.kind) {
    case MarketingActionKind.TAG:
      return marketingActionIconDict[
        MarketingActions.CADENCE_MARKETING_ACTION_TAG_MANAGEMENT
      ];
    case MarketingActionKind.COMMUNICATION:
      actionSpec =
        marketingAction?.action_spec as StepMarketingActionsCommunicationSpec;
      return marketingActionIconDict[actionSpec.communication_kind];
    default:
      return marketingActionIconDict[
        MarketingActions.CADENCE_MARKETING_ACTION_SMS
      ];
  }
};

/** Function returning the naming for the StepMarketingAction in parameter
 * @param {StepMarketingActions} marketingAction - Cadence StepMarketingAction
 * @param {(id: string) => Tag} getTag - Tag getter for the marketingAction if kind is MarketingActionKind.TAG
 * @param {(id: string) => EmailTemplateSummary} getEmailTemplate - EmailTemplate getter for the marketingAction
 * @returns {string} - Return the corresponding naming for the chip
 */
export const getMarketingActionChipName = ({
  marketingAction,
  getTag,
  getEmailTemplate,
}: {
  marketingAction: StepMarketingActions;
  getTag: (id: string) => Tag;
  getEmailTemplate: (id: string) => EmailTemplateSummary;
}) => {
  let actionSpec = marketingAction?.action_spec;

  switch (marketingAction?.kind) {
    case MarketingActionKind.TAG:
      actionSpec = marketingAction.action_spec as StepMarketingActionsTagSpec;
      return !!getTag && getTag(actionSpec?.tag_id?.toString())?.name;
    case MarketingActionKind.COMMUNICATION:
      actionSpec =
        marketingAction.action_spec as StepMarketingActionsCommunicationSpec;
      switch (actionSpec.communication_kind) {
        case MarketingActions.CADENCE_MARKETING_ACTION_WRITTEN_EMAIL:
        case MarketingActions.CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION:
          return actionSpec?.subject;
        case MarketingActions.CADENCE_MARKETING_ACTION_SMS:
          return actionSpec?.text_content;
        case MarketingActions.CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE:
          return (
            !!getEmailTemplate &&
            getEmailTemplate(actionSpec?.email_design?.toString())?.title
          );
        default:
          return null;
      }
    default:
      return null;
  }
};

/** Function testing if a trigger is valid (not faker trigger or other error)
 * @param {ConnectedTrigger} trigger - Cadence trigger
 * @returns {boolean} - Return whether or not the trigger is valid
 */
export const isTriggerValid = (trigger: ConnectedTrigger) => {
  const triggerKind = getTriggerKind(trigger);

  switch (triggerKind) {
    case TriggerKind.ONLY_EVENT_TRIGGER:
      return (
        trigger?.trigger_config?.identifier === TriggerIdentifier.EVENT &&
        !!trigger?.trigger_config?.event_type
      );
    case TriggerKind.ONLY_SMARTLIST_FILTERING:
      return (
        trigger?.filtering_config?.identifier === FilterIdentifier.SMARTLIST &&
        !!trigger?.filtering_config?.smartlist_pk
      );
    case TriggerKind.ONLY_TIMEOUT:
      return (
        trigger?.trigger_config?.identifier === TriggerIdentifier.TIMEOUT &&
        (!!trigger?.trigger_config?.timeout ||
          !!trigger?.trigger_config?.timeout_hours)
      );
    case TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING:
      return (
        trigger?.trigger_config?.identifier === TriggerIdentifier.EVENT &&
        !!trigger?.trigger_config?.event_type &&
        trigger?.filtering_config?.identifier === FilterIdentifier.SMARTLIST &&
        !!trigger?.filtering_config?.smartlist_pk
      );
    default:
      return false;
  }
};

/** Function testing if a trigger is a faker one used in step creation or not
 * @param {ConnectedTrigger} trigger - Cadence trigger
 * @returns {boolean} - Return whether or not the trigger is fake
 */
export const isTriggerFake = (trigger: ConnectedTrigger) =>
  trigger?.trigger_config?.uuid.includes(TRIGGER_TEMPORARY_ID);

/** Get the specific icon name which corresponds to the ConnectedTrigger in parameter for the ConnectedTriggerChip
 * @param {ConnectedTrigger} connected_trigger_config - Cadence ConnectedTrigger config
 * @returns {string} - Return the icon name of the trigger passed in paramater depending on the trigger kind.
 *                     If the trigger kind is not recognized or is EVENT_TRIGGER_AND_SMARTLIST_FILTERING, return null.
 */
export const getTriggerSpecificIcon = (
  connectedTrigger: ConnectedTrigger,
): string => {
  switch (getTriggerKind(connectedTrigger)) {
    case TriggerKind.ONLY_EVENT_TRIGGER:
      return getEventCategoryIconAsString(
        (connectedTrigger?.trigger_config as TriggerEventConfig)?.event_type,
      );
    case TriggerKind.ONLY_SMARTLIST_FILTERING:
      return 'People';
    case TriggerKind.ONLY_TIMEOUT:
      return 'Timer';
    default:
      return null;
  }
};
