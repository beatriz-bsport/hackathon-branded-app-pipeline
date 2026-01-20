import * as Yup from 'yup';
import {
  CADENCE_EVENT_ALL_CHOICES,
  FilterIdentifier,
  MAX_TOTAL_TRIGGERS,
  TriggerIdentifier,
} from '#src/libs/sequential_marketing/constants';

/**
 * Trigger validation schema for day-only delays
 * Hours are optional and have no maximum limit (legacy behavior)
 */
const triggerValidationSchema = Yup.object().shape({
  trigger_config: Yup.object().shape({
    identifier: Yup.string().oneOf(Object.values(TriggerIdentifier)).required(),
    event_type: Yup.string()
      .nullable()
      .when('identifier', {
        is: TriggerIdentifier.EVENT,
        then: Yup.string().oneOf(CADENCE_EVENT_ALL_CHOICES).required(),
      }),
    timeout: Yup.number()
      .nullable()
      .when('identifier', {
        is: TriggerIdentifier.TIMEOUT,
        then: Yup.number()
          .required()
          .test(
            'Check For Timeout Value',
            'marketing:cadence.form.error.timeoutMustBeStrictPositive',
            (days) => {
              return (!days && days !== 0) || days > 0;
            },
          ),
      }),
    timeout_hours: Yup.number().nullable(), // Hours are not checked when the corresponding feature flag is off
  }),
  destination_config: Yup.object().shape({
    source_id: Yup.number().nullable(),
  }),
  filtering_config: Yup.object().shape({
    identifier: Yup.string().oneOf(Object.values(FilterIdentifier)).required(),
    smartlist_pk: Yup.number().nullable().when('identifier', {
      is: FilterIdentifier.SMARTLIST,
      then: Yup.number().required(),
    }),
  }),
});

export const uniqueTriggerValidationSchema = Yup.object().shape({
  trigger: triggerValidationSchema,
});

/**
 * @description Yup validation schema for an array of connected triggers in a workflow.
 *
 * @param {number} [max=5] The maximum allowed number of connected triggers.
 *                         It defaults to 5 but can be overridden in exceptional cases where additional mandatory
 *                         connected triggers are required, in addition to the ones that can be added.
 *
 * @returns {object} The Yup validation schema for the array of connected triggers within the 'connectedTriggers' field.
 */
export const multipleTriggersValidationSchema = (max?: number) =>
  Yup.object().shape({
    connectedTriggers: Yup.array()
      .of(triggerValidationSchema)
      .min(1, 'marketing:cadence.form.error.minimumConnectedTrigger')
      .max(
        max || MAX_TOTAL_TRIGGERS,
        'marketing:cadence.form.error.maximumConnectedTrigger',
      )
      .required(),
  });
