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
  BackEndConnectedTriggerPayload,
} from './types';
import { GraphCanvas } from '../types';

export default class ConnectedTriggerFormSerializer {
  stepId: number;

  stepDestinationId: number | null;

  canvas: GraphCanvas;

  formValues: Values;

  constructor(
    stepId: number,
    stepDestinationId: number | null,
    canvas: GraphCanvas,
    formValues: Values,
  ) {
    this.stepId = stepId;
    this.stepDestinationId = stepDestinationId;
    this.canvas = canvas;
    this.formValues = formValues;
  }

  serializeBackEndData() {
    return convertUpdateTriggerPayloadToBackEnd(
      this.stepId,
      this.stepDestinationId,
      this.canvas,
      this.formValues,
    );
  }
}

export const convertUpdateTriggerPayloadToBackEnd = (
  stepId: number,
  stepDestinationId: number | null,
  canvas: GraphCanvas,
  data: Values,
): BackEndConnectedTriggerPayload => {
  const {
    trigger_has_event,
    trigger_event_kind,
    trigger_has_smartlist,
    trigger_smartlist_selected,
    is_exit_success,
    is_exit_fail,
  } = data;
  return {
    step: stepId,
    uuid: uuidv4(),
    trigger_config: getTriggerConfig(trigger_has_event, trigger_event_kind),
    destination_config: getDestinationConfig(
      stepId,
      stepDestinationId,
      is_exit_success,
      is_exit_fail,
    ),
    filtering_config: getFilteringConfig(
      trigger_has_smartlist,
      trigger_smartlist_selected,
    ),
    canvas,
    disabled: false,
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
