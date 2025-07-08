/**
 * Error codes for smartlist deletion operations
 * These match the SmartListDeletionFailedReason enum in the Django backend
 */

// General smartlist deletion failed
export const SMARTLIST_DELETION_FAILED = 101000;

// Smartlist deletion blocked due to associated sent communication groups
export const SMARTLIST_DELETION_BLOCKED_BY_COMMUNICATION_GROUPS = 101001;

// Smartlist deletion blocked due to associated cadences
export const SMARTLIST_DELETION_BLOCKED_BY_CADENCES = 101002;

/**
 * Array of all smartlist deletion error codes for easy checking
 */
export const SMARTLIST_DELETION_ERROR_CODES = [
  SMARTLIST_DELETION_FAILED,
  SMARTLIST_DELETION_BLOCKED_BY_COMMUNICATION_GROUPS,
  SMARTLIST_DELETION_BLOCKED_BY_CADENCES,
] as const;

/**
 * Type for smartlist deletion error codes
 */
export type SmartlistDeletionErrorCode =
  (typeof SMARTLIST_DELETION_ERROR_CODES)[number];
