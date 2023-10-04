import { AxiosError } from 'axios';
import { CUSTOM_ERROR_CODE } from './constants';

/**
 * @description Checks if the error given by the API is a custom error with CUSTOM_ERROR_CODE status
 */
export function isErrorWithCustomCode(error: AxiosError) {
  return error?.response?.status === CUSTOM_ERROR_CODE;
}
