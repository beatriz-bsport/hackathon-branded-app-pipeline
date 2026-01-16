import {
  uniqueTriggerValidationSchema,
  multipleTriggersValidationSchema,
} from './schemas/validationSchema.schema';
import {
  uniqueTriggerValidationSchemaWithHourlyTimeout,
  multipleTriggersValidationSchemaWithHourlyTimeout,
} from './schemas/validationSchemaWithHourlyTimeout.schema';

/**
 * Get the appropriate unique trigger validation schema
 * @param allowHourlyTimeout - Whether hourly timeout validation (0-23 hours) is enabled
 * @returns The validation schema for a single trigger
 */
export const getUniqueTriggerValidationSchema = (
  allowHourlyTimeout?: boolean,
) => {
  return !!allowHourlyTimeout
    ? uniqueTriggerValidationSchemaWithHourlyTimeout
    : uniqueTriggerValidationSchema;
};

/**
 * Get the appropriate multiple triggers validation schema
 * @param max - Maximum number of triggers allowed (defaults to 5)
 * @param allowHourlyTimeout - Whether hourly timeout validation (0-23 hours) is enabled
 * @returns The validation schema for multiple triggers
 */
export const getMultipleTriggersValidationSchema = (
  max?: number,
  allowHourlyTimeout?: boolean,
) => {
  return !!allowHourlyTimeout
    ? multipleTriggersValidationSchemaWithHourlyTimeout(max)
    : multipleTriggersValidationSchema(max);
};
