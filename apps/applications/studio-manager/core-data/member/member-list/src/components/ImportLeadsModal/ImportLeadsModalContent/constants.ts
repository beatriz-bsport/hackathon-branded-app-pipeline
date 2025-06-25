import {
  LEAD_MANAGEMENT_IMPORT_LOCK_ACQUISITION_ERROR,
  LEAD_MANAGEMENT_IMPORT_MAXIMUM_NUMBER_OF_ROWS_ERROR,
  LEAD_MANAGEMENT_IMPORT_WRONG_ENCODING,
  LEAD_MANAGEMENT_IMPORT_WRONG_NUMBER_OF_COLUMNS_ERROR,
} from "@bsport/common/lib/master-data/error-codes/member";

export const IMPORT_STATUSES = {
  // Default view, until the upload of a file finished
  UPLOADING_FILE: "uploading-file",
  // File uploading has terminated, background task has start and is pending
  PROCESSING_FILE: "processing-file",
  // Background task finished with success
  SUCCESSFUL_IMPORT: "import-success",
  // Background task finished with partial success -> Some rows contained errors
  PARTIAL_ROWS_ERRORS: "import-partial-success",
  // Existing background task in process
  TASK_ALREADY_IN_PROGRESS: "import-task-already-in-progress",
  // The recursive fetch to get background task data timeout
  IMPORT_TIMEOUT: "import-timeout",
  // Unexpected error
  IMPORT_FAILURE: "import-error",
} as const;

export const LEAD_MANAGEMENT_ERRORS = {
  TASK_ALREADY_IN_PROCESS: LEAD_MANAGEMENT_IMPORT_LOCK_ACQUISITION_ERROR,
  WRONG_NUMBER_OF_COLUMN: LEAD_MANAGEMENT_IMPORT_WRONG_NUMBER_OF_COLUMNS_ERROR,
  MAXIMUM_NUMBER_OF_ROWS: LEAD_MANAGEMENT_IMPORT_MAXIMUM_NUMBER_OF_ROWS_ERROR,
  WRONG_ENCODING: LEAD_MANAGEMENT_IMPORT_WRONG_ENCODING,
};

export type ImportStatus =
  (typeof IMPORT_STATUSES)[keyof typeof IMPORT_STATUSES];

export type ImportBackgroundTaskReturnValue =
  | string[] // For partial success case
  | { error_code: number } // For error cases
  | undefined; // For other cases, such as full success case
