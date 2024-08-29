import { v4 as uuidv4 } from 'uuid';
import memoize from 'memoize-one';
import { DateTime } from 'luxon';

import {
  DATATYPE_FILTERABLE_BY_DATE,
  FILTER_OPERAND_BOOLEAN,
  FILTER_OPERAND_DATE,
  FILTER_OPERAND_FLOAT,
  FILTER_OPERAND_LIST,
  FILTER_OPERAND_LIST_ID,
  FILTER_OPERAND_BOOLEAN_ID,
  FILTER_OPERAND_FLOAT_ID,
  FILTER_OPERAND_DATE_ID,
  DATATYPE_FILTERABLE_BY_FLOAT_RANGE,
  DATATYPE_FILTERABLE_BY_ID_IN,
  DATE_SUBDATA_TYPE,
  FILTER_IN_OPERAND,
  GROUP_AND_OPERAND,
  HOUR_SUBDATA_TYPE,
} from '#src/libs/datatype-filtering/constants';

import {
  AllComparator,
  DatatypeFilterConfigItemTypeById,
  DatatypeFilterConfigItemTypeCompleteDate,
  DatatypeFilterConfigItemTypeDate,
  DatatypeFilterConfigItemTypeFloat,
  DataSourceMedadataDataType,
  DatatypeFilterConfigGroup,
  DataSourceFieldMetadata,
  DatatypeFilterConfigItem,
} from '#src/libs/datatype-filtering/types';
import { TIME_PERIODS_RANGE } from '#src/components/date/DateRangeSelector.component';
import { TIME_PERIODS_SINGLE } from '#src/components/date/DatePickerSelector.component';
import type { ReportMetadataColumn } from '#src/libs/reporting/common/types';
import { GROUPED_IDENTIFIERS_FILTER } from '#src/libs/reporting/common/constants';
import { BuyableItemOptions } from '#src/libs/checkout/types';

//
// Getters
//
export const getComparatorsByDataType = (
  dataType: DataSourceMedadataDataType,
): AllComparator[] => {
  if (dataType === 'string') return [];

  if (dataType === 'boolean') return FILTER_OPERAND_BOOLEAN;

  if (DATATYPE_FILTERABLE_BY_ID_IN.includes(dataType))
    return FILTER_OPERAND_LIST;

  if (DATATYPE_FILTERABLE_BY_FLOAT_RANGE.includes(dataType))
    return FILTER_OPERAND_FLOAT;

  if (DATATYPE_FILTERABLE_BY_DATE.includes(dataType))
    return FILTER_OPERAND_DATE;

  return [];
};

export const getComparatorCategoryByDataType = (
  dataType: DataSourceMedadataDataType,
): AllComparator => {
  if (dataType === 'string') return null;

  if (dataType === 'boolean') return FILTER_OPERAND_BOOLEAN_ID;

  if (DATATYPE_FILTERABLE_BY_ID_IN.includes(dataType))
    return FILTER_OPERAND_LIST_ID;

  if (DATATYPE_FILTERABLE_BY_FLOAT_RANGE.includes(dataType))
    return FILTER_OPERAND_FLOAT_ID;

  if (DATATYPE_FILTERABLE_BY_DATE.includes(dataType))
    return FILTER_OPERAND_DATE_ID;

  return null;
};

export const getDefaultValueForComparator = (details: {
  comparator: AllComparator;
  datatype:
    | 'boolean'
    | 'products'
    | DatatypeFilterConfigItemTypeById
    | DatatypeFilterConfigItemTypeFloat
    | DatatypeFilterConfigItemTypeDate
    | DatatypeFilterConfigItemTypeCompleteDate;
  currentValue: any;
  isChangingComparator?: boolean;
}) => {
  const {
    comparator,
    datatype,
    currentValue,
    isChangingComparator = false,
  } = details;
  if (datatype === 'boolean') {
    if (typeof currentValue === 'boolean') return currentValue;
    return true;
  }
  if (datatype === 'products') {
    if (
      typeof currentValue === 'object' &&
      !Array.isArray(currentValue) &&
      currentValue !== null
    ) {
      return currentValue;
    }
    return {
      buyable_item_identifier: BuyableItemOptions.BUYABLE_ITEM_PASS,
      object_ids: [],
    };
  }

  if (DATATYPE_FILTERABLE_BY_FLOAT_RANGE.includes(datatype)) {
    if (comparator === FILTER_IN_OPERAND) {
      if (
        currentValue?.length > 1 &&
        !Number.isNaN(Number.parseFloat(currentValue[0])) &&
        !Number.isNaN(Number.parseFloat(currentValue[1])) &&
        !getIsTimestamp(currentValue[0]) &&
        !getIsTimestamp(currentValue[1])
      )
        return currentValue;
      return [0, 100];
    }

    if (
      !Array.isArray(currentValue) &&
      !Number.isNaN(Number.parseFloat(currentValue)) &&
      !getIsTimestamp(currentValue) // 1 Millions is probably a timestamp and not a number
    )
      return currentValue;

    return 0;
  }
  if (DATATYPE_FILTERABLE_BY_ID_IN.includes(datatype)) {
    if (isChangingComparator) {
      return currentValue;
    }
    return [];
  }

  if (datatype === 'date' || datatype === 'datetime') {
    if (comparator === FILTER_IN_OPERAND) {
      if (getIsTimestamp(currentValue[0]) && getIsTimestamp(currentValue[1]))
        return currentValue;

      return [
        DateTime.now().startOf('day').toUnixInteger(),
        DateTime.now().endOf('day').toUnixInteger(),
      ];
    }

    if (getIsTimestamp(currentValue)) return currentValue;
    return DateTime.now().startOf('day').toUnixInteger();
  }

  if (datatype === 'time') {
    if (comparator === FILTER_IN_OPERAND) {
      if (
        getIsTimestamp(currentValue?.[0]) &&
        getIsTimestamp(currentValue?.[1])
      )
        return currentValue;

      return [
        DateTime.now().set({ hour: 8, minute: 0 }).toUnixInteger(),
        DateTime.now().set({ hour: 20, minute: 0 }).toUnixInteger(),
      ];
    }

    if (getIsTimestamp(currentValue)) return currentValue;
    return DateTime.now().set({ hour: 8, minute: 0 }).toUnixInteger();
  }

  return null;
};

export const getDefaultValueForTimePeriod = (details: {
  comparator: AllComparator;
  sub_datatype: 0 | 1 | null;
  datatype:
    | 'boolean'
    | 'products'
    | DatatypeFilterConfigItemTypeById
    | DatatypeFilterConfigItemTypeFloat
    | DatatypeFilterConfigItemTypeDate
    | DatatypeFilterConfigItemTypeCompleteDate;
  currentTimePeriod: string | null;
}) => {
  const { sub_datatype, comparator, datatype, currentTimePeriod } = details;
  if (
    datatype !== 'date' &&
    sub_datatype !== DATE_SUBDATA_TYPE &&
    sub_datatype !== HOUR_SUBDATA_TYPE
  )
    return null;

  if (currentTimePeriod) {
    if (
      comparator === FILTER_IN_OPERAND &&
      TIME_PERIODS_RANGE.includes(currentTimePeriod)
    ) {
      return currentTimePeriod;
    }

    if (TIME_PERIODS_SINGLE.includes(currentTimePeriod))
      return currentTimePeriod;
  }

  return 'custom';
};

//
// Generator
//

export const generateNewGroup = (
  defaultMetadata: DataSourceFieldMetadata | ReportMetadataColumn,
  hidden?: boolean,
) => {
  if (!defaultMetadata) {
    return {
      inner_operand: GROUP_AND_OPERAND,
      filters_data: [],
      uuid: uuidv4(),
      display_has_single: hidden,
    };
  }

  return {
    inner_operand: GROUP_AND_OPERAND,
    filters_data: [generateNewFilterItem(defaultMetadata)],
    uuid: uuidv4(),
    display_has_single: hidden,
  };
};

export const generateNewFilterItem = (
  metadata: ReportMetadataColumn | DataSourceFieldMetadata,
): DatatypeFilterConfigItem => {
  const comparator = getComparatorsByDataType(metadata?.datatype)?.[0];
  const datatype = metadata?.datatype;
  const sub_datatype =
    datatype === 'datetime' || datatype === 'date' ? DATE_SUBDATA_TYPE : null;

  return {
    // @ts-expect-error
    datatype,
    sub_datatype,
    comparator,
    identifier: metadata.identifier,
    // @ts-expect-error
    time_period: getDefaultValueForTimePeriod({
      comparator,
      sub_datatype,
      // @ts-expect-error
      datatype,
      currentTimePeriod: null,
    }),
    value: getDefaultValueForComparator({
      comparator,
      // @ts-expect-error
      datatype,
      currentValue: null,
    }),
    uuid: uuidv4(),
  };
};

export const generateNewGroupForDateRange = (
  metadata: DataSourceFieldMetadata,
  time_period: 'week' | 'month' | 'trimester' | 'year',
) => {
  return {
    inner_operand: GROUP_AND_OPERAND,
    filters_data: [generateNewFilterDateInItem(metadata, time_period)],
    uuid: uuidv4(),
    display_has_single: true,
  };
};

export const generateNewFilterDateInItem = (
  metadata: DataSourceFieldMetadata,
  time_period: 'week' | 'month' | 'trimester' | 'year',
) => {
  const comparator = FILTER_IN_OPERAND;
  const datatype = metadata?.datatype;
  const sub_datatype =
    datatype === 'datetime' || datatype === 'date' ? DATE_SUBDATA_TYPE : null;
  const value = getDateRangeValueForTimePeriod(time_period);

  return {
    datatype,
    sub_datatype,
    comparator,
    identifier: metadata.identifier,
    time_period,
    value,
    uuid: uuidv4(),
  };
};

const getDateRangeValueForTimePeriod = (
  timePeriod: 'week' | 'month' | 'trimester' | 'year',
) => {
  switch (timePeriod) {
    case 'week':
      return [
        DateTime.now().minus({ week: 1 }).startOf('day').toUnixInteger(),
        DateTime.now().endOf('day').toUnixInteger(),
      ];
    case 'month':
      return [
        DateTime.now().minus({ month: 1 }).startOf('day').toUnixInteger(),
        DateTime.now().endOf('day').toUnixInteger(),
      ];
    case 'trimester':
      return [
        DateTime.now().minus({ month: 3 }).startOf('day').toUnixInteger(),
        DateTime.now().endOf('day').toUnixInteger(),
      ];
    default:
      return [
        DateTime.now().minus({ year: 1 }).startOf('day').toUnixInteger(),
        DateTime.now().endOf('day').toUnixInteger(),
      ];
  }
};

const getIsTimestamp = (value: number) => {
  // 1 Millions is probably a timestamp otherwise no alternative is possible
  return value > 1000000000;
};

//
// Checker
//
export const checkColumnAlreadyExist = memoize(
  (datatype: string, groups: DatatypeFilterConfigGroup[]) =>
    groups.some((fg) => fg.filters_data.some((fd) => fd.datatype === datatype)),
);

export const checkIdentifierAlreadyExist = memoize(
  (identifier: string, groups: DatatypeFilterConfigGroup[]) =>
    groups.some((fg) =>
      fg.filters_data.some((fd) => {
        return fd.identifier === identifier;
      }),
    ),
);

export const checkMemberFilterAlreadyExist = (
  datatype: DataSourceMedadataDataType,
  identifier: string,
  groups: DatatypeFilterConfigGroup[],
) => {
  if (
    datatype !== 'user' ||
    !GROUPED_IDENTIFIERS_FILTER.some((group) => group.includes(identifier))
  ) {
    return false;
  }

  const checkGroupedFilterAlreadyExist = (identifiers: string[]) => {
    return groups.find((filterGroup) =>
      filterGroup.filters_data.some((filterData) =>
        identifiers.includes(filterData.identifier),
      ),
    );
  };

  for (const identifiers of GROUPED_IDENTIFIERS_FILTER) {
    if (identifiers.includes(identifier)) {
      return checkGroupedFilterAlreadyExist(identifiers);
    }
  }

  return false;
};
