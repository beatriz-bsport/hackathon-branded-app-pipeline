// @ts-nocheck
// FROM BackEndConnectedTriggerPayload TO StepConnectedTriggerConfig ||CadenceConnectedTriggerConfig

import {
  BackEndConnectedTriggerPayload,
  BackEndTriggerIdentifier,
  BackEndTriggerConfigDict,
  BackEndFilteringConfigDict,
  BackendFiltering,
  BackEndDestinationKind,
  BackEndDestinationStatus,
} from './types';
import type { StepConnectedTriggerConfig } from '#libs/sequential_marketing/types';

import {
  TriggerEnum,
  FiltersEnum,
  StepDestinationEnum,
  CadenceDestinationEnum,
} from '#libs/sequential_marketing/constants';

export const matchBakcEndTriggerIdentifierToFront = (
  triggerIdentifier: BackEndTriggerIdentifier,
): TriggerEnum => {
  switch (triggerIdentifier) {
    case BackEndTriggerIdentifier.TIMEOUT:
      return TriggerEnum.TIMEOUT_TRIGGER_IDENTIFIER;
    case BackEndTriggerIdentifier.EVENT:
      return TriggerEnum.EVENT_TRIGGER_IDENTIFIER;
    default:
      return TriggerEnum.EMPTY_TRIGGER_IDENTIFIER;
  }
};

const getTimeOut = (BackEndtriggerConfig: BackEndTriggerConfigDict) => {
  switch (BackEndtriggerConfig.identifier) {
    case BackEndTriggerIdentifier.TIMEOUT:
      return { timeout: BackEndtriggerConfig.timeout };
    default:
      return {};
  }
};

const getEventType = (BackEndtriggerConfig: BackEndTriggerConfigDict) => {
  switch (BackEndtriggerConfig.identifier) {
    case BackEndTriggerIdentifier.EVENT:
      return { event_type: BackEndtriggerConfig.event_type };
    default:
      return {};
  }
};
export const matchTriggerConfig = (
  BackEndtriggerConfig: BackEndTriggerConfigDict,
) =>
  // : TriggerConfig
  {
    return {
      uuid: BackEndtriggerConfig.uuid,
      identifier: matchBakcEndTriggerIdentifierToFront(
        BackEndtriggerConfig.identifier,
      ),
      ...getTimeOut(BackEndtriggerConfig),
      ...getEventType(BackEndtriggerConfig),
    };
  };

export const matchFilteringIdentifier = (
  BackEndConnectedTriggerFilterConfig: BackEndFilteringConfigDict,
) => {
  switch (BackEndConnectedTriggerFilterConfig.identifier) {
    case BackendFiltering.SMARTLIST:
      return FiltersEnum.FILTERING_SMARTLIST;

    default:
      return FiltersEnum.FILTERING_EMPTY;
  }
};
export const getSmartlistFilteringId = (
  BackEndConnectedTriggerFilterConfig: BackEndFilteringConfigDict,
) => {
  if (BackEndConnectedTriggerFilterConfig.smartlist_pk) {
    return {
      smartlist_pk: BackEndConnectedTriggerFilterConfig.smartlist_pk,
    };
  }
  return {};
};

export const matchStepDestinationKind = (
  BackendDestinationKind: BackEndDestinationKind,
) => {
  switch (BackendDestinationKind) {
    case BackEndDestinationKind.OUTSIDE_TO_STEP:
      return StepDestinationEnum.EXIT_DESTINATION_KIND;

    default:
      return StepDestinationEnum.STEP_DESTINATION_KIND;
  }
};

export const matchStepStatus = (
  BackEndConnectedTriggerDestinationStatus: BackEndDestinationStatus,
) => {
  switch (BackEndConnectedTriggerDestinationStatus) {
    case BackEndDestinationStatus.WIN:
      return CadenceDestinationEnum.CADENCE_DESTINATION_STATUS_EXIT_SUCCESS_STATUS;
    case BackEndDestinationStatus.FAIL:
      return CadenceDestinationEnum.CADENCE_DESTINATION_STATUS_EXIT_FAIL_STATUS;
    default:
      return '';
  }
};

export const convertStepConnectedTrigger = (
  BackEndConnectedTrigger: BackEndConnectedTriggerPayload,
): StepConnectedTriggerConfig => {
  return {
    uuid: BackEndConnectedTrigger.uuid,
    identifier: matchBakcEndTriggerIdentifierToFront(
      BackEndConnectedTrigger.trigger_config.identifier,
    ),
    disabled: BackEndConnectedTrigger.disabled,
    trigger_config: matchTriggerConfig(BackEndConnectedTrigger.trigger_config),
    filtering_config: {
      uuid: BackEndConnectedTrigger.filtering_config.uuid,
      identifier: matchFilteringIdentifier(
        BackEndConnectedTrigger.filtering_config,
      ),
      ...getSmartlistFilteringId(BackEndConnectedTrigger.filtering_config),
    },
    destination_config: {
      id: BackEndConnectedTrigger.destination_config.destination_id,
      kind: matchStepDestinationKind(
        BackEndConnectedTrigger.destination_config.kind,
      ),
      source_id: BackEndConnectedTrigger.destination_config.source_id,
      status: matchStepStatus(
        BackEndConnectedTrigger.destination_config.status,
      ),
    },
    canvas: BackEndConnectedTrigger.canvas,
  };
};
