// @ts-nocheck
import { v4 as uuidv4 } from 'uuid';
import type { Values } from '#libs/sequential_marketingDEPRECATED/components/form/Trigger/components';
import {
  CADENCE_STEPPER_ENTRY_STEP,
  CADENCE_STEPPER_WIN_STEP,
  CADENCE_STEPPER_LOSE_STEP,
} from '#libs/sequential_marketingDEPRECATED/components/form/CadenceSettingsFormStepper.component';

import type {
  BackEndConnectedTriggerPayload,
  FormValues,
  BackEndTriggerIdentifier,
  BackEndDestinationKind,
  BackendFiltering,
  BackEndDestinationStatus,
} from './types';
import { getCadenceConfigurationInformation } from './utils';

export default class CadenceConfigurationSerializer {
  formValues: FormValues;

  constructor(formValues: FormValues) {
    this.formValues = formValues;
  }

  serializeBackEndData() {
    return convertFormValuesToBackEndPayload(this.formValues);
  }
}

export const convertFormValuesToBackEndPayload = (
  formValues: FormValues,
): {
  entry_list?: BackEndConnectedTriggerPayload[];
  win_exit_list?: BackEndConnectedTriggerPayload[];
  lose_exit_list?: BackEndConnectedTriggerPayload[];
} => {
  const entryFormValues = formValues?.[CADENCE_STEPPER_ENTRY_STEP];
  const winFormValues = formValues?.[CADENCE_STEPPER_WIN_STEP];
  const loseFormValues = formValues[CADENCE_STEPPER_LOSE_STEP];

  return {
    entry_list: entryFormValues
      ? convertEntryFormValuesToBackEndPayload(entryFormValues)
      : [],
    win_exit_list: convertWinFormValuesToBackEndPayload(winFormValues),
    lose_exit_list: convertLoseFormValuesToBackEndPayload(loseFormValues),
  };
};

const convertEntryFormValuesToBackEndPayload = (values: Values) => {
  if (!values) {
    return [];
  }

  const {
    trigger_has_event,
    trigger_event_kind,
    trigger_has_smartlist,
    trigger_smartlist_selected,
    trigger_logic_between_event_and_smartlist,
  } = values;

  // Type '{ uuid: string; identifier: BackEndTriggerIdentifier; event_type: CadenceEventsEnum; }' is not assignable to type 'BackEndTriggerConfigDict'.
  const payload = [];

  // Defining boolean values
  const {
    TRIGGER_HAS_EVENT_SET,
    TRIGGER_HAS_SMARTLIST_AS_EVENT_FILTERING,
    TRIGGER_HAS_SMARTLIST_AS_TRIGGER,
  } = getCadenceConfigurationInformation({
    trigger_has_event,
    trigger_event_kind,
    trigger_has_smartlist,
    trigger_smartlist_selected,
    trigger_logic_between_event_and_smartlist,
  });

  if (TRIGGER_HAS_EVENT_SET) {
    if (TRIGGER_HAS_SMARTLIST_AS_EVENT_FILTERING) {
      // ConnectedTrigger event filtered by a smartlist coming form outside going into the first step.
      payload.push({
        trigger_config: {
          uuid: uuidv4(),
          identifier: BackEndTriggerIdentifier.EVENT,
          event_type: trigger_event_kind,
        },
        destination_config: {
          destination_id: null, // Back must be able to do cadence.get_entry_point().id
          kind: BackEndDestinationKind.OUTSIDE_TO_STEP,
          source_id: null,
          uuid: uuidv4(),
        },
        filtering_config: {
          uuid: uuidv4(),
          smartlist_pk: trigger_smartlist_selected,
          identifier: BackendFiltering.SMARTLIST,
        },
      });
    } else {
      // ConnectedTrigger event unfiltered by a smartlist coming form outside going into the first step.
      payload.push({
        trigger_config: {
          uuid: uuidv4(),
          identifier: BackEndTriggerIdentifier.EVENT,
          event_type: trigger_event_kind,
        },
        destination_config: {
          destination_id: null, // Back must be able to do cadence.get_entry_point().id
          kind: BackEndDestinationKind.OUTSIDE_TO_STEP,
          source_id: null,
          uuid: uuidv4(),
        },
        filtering_config: {
          uuid: uuidv4(),
          smartlist_pk: null,
          identifier: BackendFiltering.EMPTY,
        },
      });
      if (TRIGGER_HAS_SMARTLIST_AS_TRIGGER) {
        // ConnectedTrigger smartlist coming form outside going into the first step with the event ConnectedTrigger.
        payload.push({
          trigger_config: {
            uuid: uuidv4(),
            identifier: BackEndTriggerIdentifier.EMPTY,
            event_type: trigger_event_kind,
          },
          destination_config: {
            destination_id: null, // Back must be able to do cadence.get_entry_point().id
            kind: BackEndDestinationKind.OUTSIDE_TO_STEP,
            source_id: null,
            uuid: uuidv4(),
          },
          filtering_config: {
            uuid: uuidv4(),
            smartlist_pk: trigger_smartlist_selected,
            identifier: BackendFiltering.SMARTLIST,
          },
        });
      }
    }
  }
  if (!TRIGGER_HAS_EVENT_SET && TRIGGER_HAS_SMARTLIST_AS_TRIGGER) {
    // ConnectedTrigger smartlist coming form outside going into the first step.
    payload.push({
      trigger_config: {
        uuid: uuidv4(),
        identifier: BackEndTriggerIdentifier.EMPTY,
        event_type: trigger_event_kind,
      },
      destination_config: {
        destination_id: null, // Back must be able to do cadence.get_entry_point().id
        kind: BackEndDestinationKind.OUTSIDE_TO_STEP,
        source_id: null,
        uuid: uuidv4(),
      },
      filtering_config: {
        uuid: uuidv4(),
        smartlist_pk: trigger_smartlist_selected,
        identifier: BackendFiltering.SMARTLIST,
      },
    });
  }
  return payload;
};

const convertWinFormValuesToBackEndPayload = (values: Values) => {
  if (!values) {
    return [];
  }

  const {
    trigger_has_event,
    trigger_event_kind,
    trigger_has_smartlist,
    trigger_smartlist_selected,
    trigger_logic_between_event_and_smartlist,
  } = values;

  const payload = [];

  // Defining boolean values
  const {
    TRIGGER_HAS_EVENT_SET,
    TRIGGER_HAS_SMARTLIST_AS_EVENT_FILTERING,
    TRIGGER_HAS_SMARTLIST_AS_TRIGGER,
  } = getCadenceConfigurationInformation({
    trigger_has_event,
    trigger_event_kind,
    trigger_has_smartlist,
    trigger_smartlist_selected,
    trigger_logic_between_event_and_smartlist,
  });

  if (TRIGGER_HAS_EVENT_SET) {
    if (TRIGGER_HAS_SMARTLIST_AS_EVENT_FILTERING) {
      // ConnectedTrigger event filtered by a smartlist coming from inside going outside.
      payload.push({
        trigger_config: {
          uuid: uuidv4(),
          identifier: BackEndTriggerIdentifier.EVENT,
          event_type: trigger_event_kind,
        },
        destination_config: {
          destination_id: null,
          kind: BackEndDestinationKind.CADENCE_TO_OUTSIDE,
          reason: '',
          source_id: null,
          status: BackEndDestinationStatus.WIN,
          uuid: uuidv4(),
        },
        filtering_config: {
          uuid: uuidv4(),
          smartlist_pk: trigger_smartlist_selected,
          identifier: BackendFiltering.SMARTLIST,
        },
      });
    } else {
      // ConnectedTrigger event unfiltered by a smartlist coming form inside going outside.
      payload.push({
        trigger_config: {
          uuid: uuidv4(),
          identifier: BackEndTriggerIdentifier.EVENT,
          event_type: trigger_event_kind,
        },
        destination_config: {
          destination_id: null,
          kind: BackEndDestinationKind.CADENCE_TO_OUTSIDE,
          reason: '',
          source_id: null,
          status: BackEndDestinationStatus.WIN,
          uuid: uuidv4(),
        },
        filtering_config: {
          uuid: uuidv4(),
          smartlist_pk: null,
          identifier: BackendFiltering.EMPTY,
        },
      });
    }
    if (TRIGGER_HAS_SMARTLIST_AS_TRIGGER) {
      // ConnectedTrigger smartlist coming form inside going outside.
      payload.push({
        trigger_config: {
          uuid: uuidv4(),
          identifier: BackEndTriggerIdentifier.EMPTY,
          event_type: trigger_event_kind,
        },
        destination_config: {
          destination_id: null,
          kind: BackEndDestinationKind.CADENCE_TO_OUTSIDE,
          reason: '',
          source_id: null,
          status: BackEndDestinationStatus.WIN,
          uuid: uuidv4(),
        },
        filtering_config: {
          uuid: uuidv4(),
          smartlist_pk: trigger_smartlist_selected,
          identifier: BackendFiltering.SMARTLIST,
        },
      });
    }
  }
  if (!TRIGGER_HAS_EVENT_SET && TRIGGER_HAS_SMARTLIST_AS_TRIGGER) {
    // ConnectedTrigger smartlist coming form inside going outside.
    payload.push({
      trigger_config: {
        uuid: uuidv4(),
        identifier: BackEndTriggerIdentifier.EMPTY,
        event_type: trigger_event_kind,
      },
      destination_config: {
        destination_id: null,
        kind: BackEndDestinationKind.CADENCE_TO_OUTSIDE,
        reason: '',
        source_id: null,
        status: BackEndDestinationStatus.WIN,
        uuid: uuidv4(),
      },
      filtering_config: {
        uuid: uuidv4(),
        smartlist_pk: trigger_smartlist_selected,
        identifier: BackendFiltering.SMARTLIST,
      },
    });
  }
  return payload;
};

const convertLoseFormValuesToBackEndPayload = (values: Values) => {
  if (!values) {
    return [];
  }

  const {
    trigger_has_event,
    trigger_event_kind,
    trigger_has_smartlist,
    trigger_smartlist_selected,
    trigger_logic_between_event_and_smartlist,
    trigger_destination_timeout_days,
  } = values;

  const payload = [];

  // Defining boolean values
  const {
    TRIGGER_HAS_EVENT_SET,
    TRIGGER_HAS_SMARTLIST_AS_EVENT_FILTERING,
    TRIGGER_HAS_SMARTLIST_AS_TRIGGER,
  } = getCadenceConfigurationInformation({
    trigger_has_event,
    trigger_event_kind,
    trigger_has_smartlist,
    trigger_smartlist_selected,
    trigger_logic_between_event_and_smartlist,
  });

  if (TRIGGER_HAS_EVENT_SET) {
    if (TRIGGER_HAS_SMARTLIST_AS_EVENT_FILTERING) {
      // ConnectedTrigger event filtered by a smartlist coming from inside going outside.
      payload.push({
        trigger_config: {
          uuid: uuidv4(),
          identifier: BackEndTriggerIdentifier.EVENT,
          event_type: trigger_event_kind,
        },
        destination_config: {
          destination_id: null,
          kind: BackEndDestinationKind.CADENCE_TO_OUTSIDE,
          reason: '',
          source_id: null,
          status: BackEndDestinationStatus.FAIL,
          uuid: uuidv4(),
        },
        filtering_config: {
          uuid: uuidv4(),
          smartlist_pk: trigger_smartlist_selected,
          identifier: BackendFiltering.SMARTLIST,
        },
      });
    } else {
      // ConnectedTrigger event unfiltered by a smartlist coming form inside going outside.
      payload.push({
        trigger_config: {
          uuid: uuidv4(),
          identifier: BackEndTriggerIdentifier.EVENT,
          event_type: trigger_event_kind,
        },
        destination_config: {
          destination_id: null,
          kind: BackEndDestinationKind.CADENCE_TO_OUTSIDE,
          reason: '',
          source_id: null,
          status: BackEndDestinationStatus.FAIL,
          uuid: uuidv4(),
        },
        filtering_config: {
          uuid: uuidv4(),
          smartlist_pk: null,
          identifier: BackendFiltering.EMPTY,
        },
      });
    }
    if (TRIGGER_HAS_SMARTLIST_AS_TRIGGER) {
      // ConnectedTrigger smartlist coming form inside going outside.
      payload.push({
        trigger_config: {
          uuid: uuidv4(),
          identifier: BackEndTriggerIdentifier.EMPTY,
          event_type: trigger_event_kind,
        },
        destination_config: {
          destination_id: null,
          kind: BackEndDestinationKind.CADENCE_TO_OUTSIDE,
          reason: '',
          source_id: null,
          status: BackEndDestinationStatus.FAIL,
          uuid: uuidv4(),
        },
        filtering_config: {
          uuid: uuidv4(),
          smartlist_pk: trigger_smartlist_selected,
          identifier: BackendFiltering.SMARTLIST,
        },
      });
    }
  }
  if (!TRIGGER_HAS_EVENT_SET && TRIGGER_HAS_SMARTLIST_AS_TRIGGER) {
    // ConnectedTrigger smartlist coming form inside going outside.
    payload.push({
      trigger_config: {
        uuid: uuidv4(),
        identifier: BackEndTriggerIdentifier.EMPTY,
        event_type: trigger_event_kind,
      },
      destination_config: {
        destination_id: null,
        kind: BackEndDestinationKind.CADENCE_TO_OUTSIDE,
        reason: '',
        source_id: null,
        status: BackEndDestinationStatus.FAIL,
        uuid: uuidv4(),
      },
      filtering_config: {
        uuid: uuidv4(),
        smartlist_pk: trigger_smartlist_selected,
        identifier: BackendFiltering.SMARTLIST,
      },
    });
  }
  if (trigger_destination_timeout_days) {
    // ConnectedTrigger timeout coming form inside going outside.
    payload.push({
      trigger_config: {
        uuid: uuidv4(),
        identifier: BackEndTriggerIdentifier.TIMEOUT,
        event_type: '',
        timeout: trigger_destination_timeout_days,
      },
      destination_config: {
        destination_id: null,
        kind: BackEndDestinationKind.CADENCE_TO_OUTSIDE,
        reason: '',
        source_id: null,
        status: BackEndDestinationStatus.FAIL,
        uuid: uuidv4(),
      },
      filtering_config: {
        uuid: uuidv4(),
        smartlist_pk: null,
        identifier: BackendFiltering.EMPTY,
      },
    });
  }
  return payload;
};
