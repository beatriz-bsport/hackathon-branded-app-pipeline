const DUNS_PATTERN = /^\d{9}$/;
const DUNS_PROCESSING_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const isValidDuns = (value: string): boolean => DUNS_PATTERN.test(value);

export const getDunsExpectedReadyDate = (submittedAt: Date): Date =>
  new Date(submittedAt.getTime() + DUNS_PROCESSING_DAYS * MS_PER_DAY);

export const getDaysRemaining = (expectedDate: Date, from: Date): number =>
  Math.max(
    0,
    Math.ceil((expectedDate.getTime() - from.getTime()) / MS_PER_DAY),
  );

const URL_PATTERN = /^https?:\/\/.+/i;

export const isValidOptionalUrl = (value: string): boolean =>
  value === "" || URL_PATTERN.test(value);
