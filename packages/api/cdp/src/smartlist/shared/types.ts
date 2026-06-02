export type SmartlistFilterIdentifier = number;

export type SmartlistFilterPayload = {
  id: number;
  smartlist: number;
  filter_identifier: SmartlistFilterIdentifier;
};

export type SmartlistGetFiltersResponse = Record<
  string,
  Record<string, SmartlistFilterPayload>
>;

export enum SmartlistDateFilterType {
  DATE_AFTER = 0,
  DATE_BEFORE = 1,
  DATE_BETWEEN = 2,
  DATE_EXACT = 3,
  DURATION_AFTER = 4,
  DURATION_BEFORE = 5,
  DURATION_EXACT = 6,
  DURATION_BETWEEN = 7,
  DURATION_BEFORE_PAST = 9,
}

export const SMARTLIST_RELATIVE_DATE_FILTER_TYPE = [
  SmartlistDateFilterType.DURATION_AFTER,
  SmartlistDateFilterType.DURATION_BEFORE,
  SmartlistDateFilterType.DURATION_EXACT,
  SmartlistDateFilterType.DURATION_BETWEEN,
  SmartlistDateFilterType.DURATION_BEFORE_PAST,
];

export const SMARTLIST_ABSOLUTE_DATE_FILTER_TYPE = [
  SmartlistDateFilterType.DATE_AFTER,
  SmartlistDateFilterType.DATE_BEFORE,
  SmartlistDateFilterType.DATE_EXACT,
  SmartlistDateFilterType.DATE_BETWEEN,
];

export enum SmartlistCreditComparator {
  LTE = 1,
  GTE = 2,
  EQUAL = 5,
  BETWEEN = 6,
}
