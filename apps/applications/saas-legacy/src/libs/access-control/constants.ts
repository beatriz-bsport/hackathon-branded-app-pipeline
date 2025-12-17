export const MEMBERSHIP_ID_MIN_LENGTH = 6;
export const SCANNER_FILTER_DELAY_MS = 30;

export const BARCODE_CHARS_PATTERN = /^[a-zA-Z0-9]$/;

export const FETCH_MEMBER_VISIT_PAGE_SIZE = 10;
export const MAX_PHOTOS_IN_HISTORY = 6;

export enum AccessStatus {
  GREEN = 'G',
  ORANGE = 'O',
  RED = 'R',
}

export enum EntryStatus {
  ENTERED = 'Y',
  UNKNOWN = 'U',
  NOT_ENTERED = 'N',
}
