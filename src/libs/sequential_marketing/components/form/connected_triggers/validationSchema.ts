import * as Yup from 'yup';
import {
  CADENCE_EVENT_ALL_CHOICES,
  FilterIdentifier,
  TriggerIdentifier,
} from '#libs/sequential_marketing/constants';

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
  }),
  destination_config: Yup.object().shape({
    source_id: Yup.number(),
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

export const multipleTriggersValidationSchema = Yup.object().shape({
  connectedTriggers: Yup.array()
    .of(triggerValidationSchema)
    .min(1, 'The array must contain at least one connected trigger')
    .max(5, 'The array cannot contain more than 5 connected triggers')
    .required(),
});
