/**
 * This file provides constants used for the check-in library.
 * It defines local storage keys for storing filter configurations
 * and a minimal list of establishments to ensure data persistence
 * across page refreshes.
 */

// -------------------------FILTER CONFIGURATION-------------------------

// The key used in local storage to store filters for the check-in tablet.
export const LOCAL_STORAGE_KEY_FILTERS_CHECK_IN_TABLET =
  'bsport:check-in:tablet:filters';

// --------------------------ESTABLISHMENT LIST--------------------------

// The key used in local storage to store the minimal list of establishments.
export const LOCAL_STORAGE_KEY_MINIMAL_ESTABLISHMENT_LIST =
  'bsport:check-in:tablet:establishments:minimal';
