// @ts-nocheck
import type {
  CadenceStep,
  StepConnectedTriggerConfig,
} from '#libs/sequential_marketing/types';
import { BackEndConnectedTriggerPayload } from './types';

import {
  matchTriggerConfig,
  matchFilteringIdentifier,
  getSmartlistFilteringId,
  matchStepDestinationKind,
  matchStepStatus,
  matchBakcEndTriggerIdentifierToFront,
} from './utils';

export default class StepSerializer {
  steps: CadenceStep | CadenceStep[];

  constructor(steps: CadenceStep | CadenceStep[]) {
    this.steps = steps;
  }

  serializeBackEndData() {
    if (Array.isArray(this.steps)) {
      return this.steps.map((step) => ({
        ...step,
        exits: step.exits.map((ex) => convertStepConnectedTrigger(ex)),
        is_entry_step: step.is_entrypoint,
        canvas: {
          ...step.canvas,
          positions: step.canvas.position,
        },
      }));
    }
    if (!Array.isArray(this.steps)) {
      return {
        ...this.steps,
        exits: this.steps.exits.map((ex) => convertStepConnectedTrigger(ex)),
        is_entry_step: this.steps.is_entrypoint,
        canvas: {
          ...this.steps.canvas,
          positions: this.steps.canvas.position,
        },
      };
    }
    return this.steps;
  }
}

export const convertStepConnectedTrigger = (
  BackEndConnectedTrigger: BackEndConnectedTriggerPayload,
): StepConnectedTriggerConfig => {
  return {
    // Only used for graph
    uuid: BackEndConnectedTrigger.trigger_config.uuid,
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
    canvas: {
      ...(BackEndConnectedTrigger.canvas
        ? {
            ...BackEndConnectedTrigger.canvas,
            positions: BackEndConnectedTrigger.canvas.position,
          }
        : { positions: { x: 0, y: 0 } }),
    },
  };
};
