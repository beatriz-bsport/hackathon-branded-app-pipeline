import * as Yup from 'yup';
import {
  CADENCE_EVENT_ALL_CHOICES,
  FilterIdentifier,
  TriggerIdentifier,
} from '#src/libs/sequential_marketing/constants';

/**
 * Trigger validation schema with hourly timeout support (0-23 hours)
 * Use this schema when AUDIENCE_HOURLY_TIMEOUT feature flag is enabled
 */
const triggerValidationSchemaWithHourlyTimeout = Yup.object().shape({
  trigger_config: Yup.object()
    .shape({
      identifier: Yup.string()
        .oneOf(Object.values(TriggerIdentifier))
        .required(),
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
              'Check For Timeout Days Value',
              'marketing:cadence.form.error.timeoutDaysMustBePositive',
              (days) => {
                return !days || days >= 0;
              },
            ),
        }),
      timeout_hours: Yup.number()
        .nullable()
        .when('identifier', {
          is: TriggerIdentifier.TIMEOUT,
          then: Yup.number()
            .min(0, 'marketing:cadence.form.error.timeoutHoursMustBePositive')
            .max(23, 'marketing:cadence.form.error.timeoutHoursMustBeMax23')
            .test(
              'Check For Timeout Hours Value',
              'marketing:cadence.form.error.timeoutHoursMustBePositive',
              (hours) => {
                return !hours || (hours >= 0 && hours <= 23);
              },
            ),
        }),
    })
    .test(
      'timeout-required',
      'marketing:cadence.form.error.timeoutRequired',
      function (value) {
        const { identifier, timeout, timeout_hours } = value || {};
        if (identifier === TriggerIdentifier.TIMEOUT) {
          return (
            (timeout != null && timeout > 0) ||
            (timeout_hours != null && timeout_hours > 0)
          );
        }
        return true;
      },
    ),
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

export const uniqueTriggerValidationSchemaWithHourlyTimeout =
  Yup.object().shape({
    trigger: triggerValidationSchemaWithHourlyTimeout,
  });

/**
 * @description Yup validation schema for an array of connected triggers in a workflow with hourly timeout support.
 *
 * @param {number} [max=5] The maximum allowed number of connected triggers.
 *                         It defaults to 5 but can be overridden in exceptional cases where additional mandatory
 *                         connected triggers are required, in addition to the ones that can be added.
 *
 * @returns {object} The Yup validation schema for the array of connected triggers within the 'connectedTriggers' field.
 */
export const multipleTriggersValidationSchemaWithHourlyTimeout = (
  max?: number,
) =>
  Yup.object().shape({
    connectedTriggers: Yup.array()
      .of(triggerValidationSchemaWithHourlyTimeout)
      .min(1, 'marketing:cadence.form.error.minimumConnectedTrigger')
      .max(max || 5, 'marketing:cadence.form.error.maximumConnectedTrigger')
      .required(),
  });
