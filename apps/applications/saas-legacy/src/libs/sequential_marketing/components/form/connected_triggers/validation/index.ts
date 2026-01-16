/**
 * Validation schemas for connected triggers
 *
 * This module provides validation schemas for trigger configurations with
 * support for feature flag-based behavior.
 */

export {
  getUniqueTriggerValidationSchema,
  getMultipleTriggersValidationSchema,
} from './getValidationSchema';
