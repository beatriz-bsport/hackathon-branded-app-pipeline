import { AxiosError } from 'axios';
import { CUSTOM_ERROR_CODE } from './constants';
import { ObjectWithKeys } from './types';

/**
 * @description Checks if the error given by the API is a custom error with CUSTOM_ERROR_CODE status
 */
export function isErrorWithCustomCode(error: AxiosError) {
  return error?.response?.status === CUSTOM_ERROR_CODE;
}

/**
 * Checks if the provided string contains any of the specified substrings.
 *
 * @param {string} string - The string to be checked for substrings.
 * @param {string[]} substrings - An array of substrings to check for in the string.
 * @returns {boolean} - Returns true if any of the substrings are found in the string, otherwise false.
 *
 * @example
 * const string = '/c/booking';
 * const substrings = ['booking', 'subscription', 'pass'];
 * const result = containsAnySubstring(string, substrings);
 * // Returns true since the string '/c/booking' contains the substring 'booking'
 */
export const containsAnySubstring = (
  string: string,
  substrings: string[],
): boolean => {
  for (let i = 0; i < substrings.length; i += 1) {
    if (string && string.indexOf(substrings[i]) !== -1) {
      return true;
    }
  }
  return false;
};

/**
 * Converts a given object into a FormData instance, converting object keys into snake case keys
 * @param data The object to be transformed into FormData
 * @example
 * const payload = objectToFormData({ someField: 'a string' });
 * const name = payload.get('some_field'); // 'a string'
 * const isFormData = payload instanceof FormData; // true
 *
 */
export const objectToFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    formData.append(_toSnakeCase(key), value);
  }

  return formData;
};

/**
 * Converts camelCase keys to snake_case
 * @param {string} string The camelCase string
 * @returns {string} The snake_case string
 */
const _toSnakeCase = (string: string) => {
  return string.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const saveQueryParamInLocalStorage = (
  queryParamName: string,
  localStorageKey: string,
) => {
  const url = new URL(window.location.toString());
  const params = url.searchParams;

  if (params.get(queryParamName)) {
    const sanitizedParams = decodeURIComponent(params.get(queryParamName));
    window.localStorage.setItem(localStorageKey, sanitizedParams);
  }
};

/**
 * Takes two primitives (string, number, boolean) array and compare their value to check
 * if they both have the same data even if its not ordered in the same way
 * @param arr1 The first primitive array to compare
 * @param arr2 The second primitive array to compare
 * @example
 * const arr1 = [1, 3, 5];
 * const arr1 = [3, 5, 1];
 * @returns isEqual true
 * @example
 * const arr1 = [1, 2, 5];
 * const arr1 = [1, 3, 5];
 * @returns isEqual false
 *
 */
export function checkPrimitiveArraysEqual<T>(arr1: T[], arr2: T[]) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Create a frequency map for the first array so that we do not have to use a sort function
  const frequencyMap = new Map<T, number>();
  for (const item of arr1) {
    frequencyMap.set(item, (frequencyMap.get(item) || 0) + 1);
  }

  for (const item of arr2) {
    if (!frequencyMap.has(item)) {
      return false;
    }
    const count = frequencyMap.get(item)!;
    if (count === 1) {
      frequencyMap.delete(item);
    } else {
      frequencyMap.set(item, count - 1);
    }
  }

  return frequencyMap.size === 0;
}

/**
 * Takes one objects that have primitives values such as string or number as a key to identify
 * his values (for example ids) and filter the object on the exact key you provide him as a second argument
 * return the Object with the wanted key if it find it or null
 * @param arr1 The object to filter
 * @param arr2 The key to find in the object to filter
 *
 */
export function filterObjectOnSingleKey<T>(
  obj: ObjectWithKeys<T>,
  id: number,
): ObjectWithKeys<T> | null {
  const filteredObj: ObjectWithKeys<T> = {};

  // Use the 'in' operator to check if the provided id exists in the object
  if (id in obj) {
    filteredObj[id] = obj[id];
    return filteredObj;
  }
  return null;
}

/**
 * Converts a base 64 string to a valid File instance
 * @param base64 A valid, complete base64 encoded string
 * @param name The complete name of the file with extension
 * @param type A valid  {@link [mime-type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types)}
 * @returns {File}
 */
export const convertBase64toFile = (
  base64: string,
  name: string,
  type: string,
) => {
  if (!base64 || !name || !type) return;

  const base64Data = base64.split(',')[1]; // exclude the metadata infos (mime-type etc)
  const byteCharacters = atob(base64Data); // decode the base64 data into bytes

  // convert the binary string into an array of bytes, as the Blob constructor expects a byte array.
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray]);

  return new File([blob], name, { type });
};

/**
 * Converts a Blob instance (File..) into an encoded base64 string
 * @async
 * @param blob The blob instance
 * @returns {File}
 */
export const convertBlobToBase64 = async (blob: Blob) => {
  if (!blob) return;
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
