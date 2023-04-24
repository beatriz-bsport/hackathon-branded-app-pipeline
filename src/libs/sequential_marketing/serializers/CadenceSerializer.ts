// @ts-nocheck
import type {
  Cadence,
  CadenceConnectedTriggerConfig,
} from '#libs/sequential_marketing/types';
import { BackEndConnectedTriggerPayload } from './types';

import {
  matchTriggerConfig,
  matchFilteringIdentifier,
  getSmartlistFilteringId,
  matchStepDestinationKind,
  matchStepStatus,
} from './utils';

export default class CadenceSerializer {
  cadences: Cadence | Cadence[];

  constructor(cadences: Cadence | Cadence[]) {
    this.cadences = cadences;
  }

  serializeBackEndData() {
    if (Array.isArray(this.cadences)) {
      return this.cadences.map((cadence) => ({
        ...cadence,
        entries: cadence.entries.map((entry) =>
          convertCadenceConnectedTrigger(entry),
        ),
        exits: cadence.cadence_exits.map((ex) =>
          convertCadenceConnectedTrigger(ex),
        ),
      }));
    }
    if (!Array.isArray(this.cadences)) {
      return {
        ...this.cadences,
        entries: this.cadences.entries.map((entry) =>
          convertCadenceConnectedTrigger(entry),
        ),
        exits: this.cadences.cadence_exits.map((ex) =>
          convertCadenceConnectedTrigger(ex),
        ),
      };
    }
    return this.cadences;
  }
}

export const convertCadenceConnectedTrigger = (
  BackEndConnectedTrigger: BackEndConnectedTriggerPayload,
): CadenceConnectedTriggerConfig => {
  return {
    uuid: BackEndConnectedTrigger.trigger_config.uuid,
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
  };
};
