import { v4 as uuidv4 } from 'uuid';
import { CadenceEventsEnum } from '#libs/sequential_marketing/constants';
import type { Values } from '#libs/sequential_marketing/components/form/Trigger/components';
import {
  BackEndTriggerConfigDict,
  BackEndDestinationConfigDict,
  BackEndFilteringConfigDict,
  BackendFiltering,
  BackEndDestinationKind,
  BackEndDestinationStatus,
  BackEndTriggerIdentifier,
  ConnectedTriggerCreationBackEndPayload,
} from './types';
import { CadenceStep } from '../types';

export default class StepSubscriptionSerializer {
  sourceStep: CadenceStep;

  stepDestinationId: number | null;

  formValues: Values;

  constructor(
    sourceStep: CadenceStep,
    stepDestinationId: number | null,
    formValues: Values,
  ) {
    this.sourceStep = sourceStep;
    this.stepDestinationId = stepDestinationId;
    this.formValues = formValues;
  }

  serializeBackEndData() {
    return convertSubscribeStepToStepPayload(
      this.sourceStep,
      this.stepDestinationId,
      this.formValues,
    );
  }
}

export const convertSubscribeStepToStepPayload = (
  sourceStep: CadenceStep,
  stepDestinationId: number | null,
  data: Values,
): ConnectedTriggerCreationBackEndPayload => {
  const {
    trigger_has_event,
    trigger_event_kind,
    trigger_has_smartlist,
    trigger_smartlist_selected,
    is_exit_success,
    is_exit_fail,
  } = data;
  // /!\ In this case no bullshit, if the trigger has an event and smartlist the smartlist IS a filter
  // if no event then the smartlist is defining an emptty trigger with smartlist filter

  return {
    ...((is_exit_fail || is_exit_success) ?? false
      ? {}
      : {
          step: {
            id: stepDestinationId,
            ...(!stepDestinationId ? { name: 'autostep' } : {}),
            ...(!stepDestinationId
              ? {
                  canvas: {
                    position: {
                      x:
                        sourceStep?.canvas?.positions?.x &&
                        typeof sourceStep?.canvas?.positions?.x === 'string'
                          ? parseFloat(sourceStep?.canvas?.positions?.x)
                          : 0,
                      y:
                        sourceStep?.canvas?.positions?.x &&
                        typeof sourceStep?.canvas?.positions?.x === 'string'
                          ? parseFloat(sourceStep?.canvas?.positions?.x) + 400
                          : 0,
                    },
                  },
                }
              : {}),
          },
        }),
    connected_trigger: {
      trigger_config: getTriggerConfig(trigger_has_event, trigger_event_kind),
      destination_config: getDestinationConfig(
        sourceStep.id,
        stepDestinationId,
        is_exit_success,
        is_exit_fail,
      ),
      filtering_config: getFilteringConfig(
        trigger_has_smartlist,
        trigger_smartlist_selected,
      ),
      disabled: false,
      canvas: {
        position: {
          x:
            sourceStep?.canvas?.positions?.x &&
            typeof sourceStep?.canvas?.positions?.x === 'string'
              ? parseFloat(sourceStep?.canvas?.positions?.x)
              : 0,
          y:
            sourceStep?.canvas?.positions?.x &&
            typeof sourceStep?.canvas?.positions?.x === 'string'
              ? parseFloat(sourceStep?.canvas?.positions?.x) + 200
              : 0,
        },
      },
    },
  };
};

const getStatus = (is_exit_success: boolean, is_exit_fail: boolean) => {
  if (is_exit_success) {
    return BackEndDestinationStatus.WIN;
  }
  if (is_exit_fail) {
    return BackEndDestinationStatus.FAIL;
  }
  return '';
};

const getDestinationConfig = (
  stepId: number,
  stepDestinationId: number | null,
  is_exit_success: boolean,
  is_exit_fail: boolean,
): BackEndDestinationConfigDict => {
  const is_exit = (is_exit_fail || is_exit_success) ?? false;
  const status = getStatus(is_exit_success, is_exit_fail);
  return {
    destination_id: stepDestinationId || null,
    kind: is_exit
      ? BackEndDestinationKind.STEP_TO_OUTSIDE
      : BackEndDestinationKind.STEP_TO_STEP,
    source_id: stepId,
    ...(status ? { status } : {}),
    uuid: uuidv4(),
  };
};
const getTriggerConfig = (
  trigger_has_event: boolean,
  trigger_event_kind: CadenceEventsEnum,
): BackEndTriggerConfigDict => {
  if (trigger_has_event && trigger_event_kind) {
    return {
      uuid: uuidv4(),
      identifier: BackEndTriggerIdentifier.EVENT,
      event_type: trigger_event_kind,
    };
  }
  return {
    uuid: uuidv4(),
    identifier: BackEndTriggerIdentifier.EMPTY,
  };
};

const getFilteringConfig = (
  trigger_has_smartlist: boolean,
  trigger_smartlist_selected: number,
): BackEndFilteringConfigDict => {
  if (trigger_has_smartlist && trigger_smartlist_selected) {
    return {
      identifier: BackendFiltering.SMARTLIST,
      uuid: uuidv4(),
      smartlist_pk: trigger_smartlist_selected,
    };
  }
  return {
    identifier: BackendFiltering.EMPTY,
    uuid: uuidv4(),
  };
};
