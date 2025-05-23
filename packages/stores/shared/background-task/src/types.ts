/**
 * BackgroundTask Model
 * - Status :
 *   - 0 : Pending
 *   - 1 : Succeeded
 *   - 2 : Failed
 */
export type BackgroundTask<T = unknown> = {
  uuid: string;
  task_name: string;
  status: 0 | 1 | 2;
  error_detail?: string;
  return_value: T;
};
