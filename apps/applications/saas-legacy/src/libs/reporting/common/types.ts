import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';
import { ErrorAndLoading, PaginationFilterParams } from '#src/libs/types';

import type {
  DataSourceMedadataDataType,
  DatatypeFilterConfigGroup,
  DatatypeFilterConfigGroupOperand,
} from '#src/libs/datatype-filtering/types';

import { ReportDateType } from '#src/libs/reporting/common/constants';

enum ReportGlobalCategoryEnum {
  PAYMENTS = 'Payments',
  CLUB = 'Club',
  BOOKINGS = 'Bookings',
  PRODUCTS = 'Products',
}

export type CellData = {
  value: string | number | null;
  datatype: string;
  extra_data: { [key: string]: string | number | null };
};

export type CellConverter = (value: string | number | undefined) => {
  cellProps?: { [key: string]: any };
  value: string | number | undefined;
};

export type SerializedRow = {
  values: Array<CellData>;
  row_extra_data: { [key: string]: string | number | null };
};

export type SerializedReport = {
  result: SerializedRow[];
  total: number;
  next_cursor?: string | null;
  previous_cursor?: string | null;
};

export type ReportingState = {
  offerManagement: ErrorAndLoading;
};

export type ReportingStateV2 = {
  reports: {
    byId: Record<number, ReportConfiguration>;
    allIds: number[];
  } & ErrorAndLoading;
  columnsMetadata: { results: ReportMetadataValue[] } & ErrorAndLoading;
  reportHeaders: { results: ReportHeader } & ErrorAndLoading;
  reportGeneration: SerializedReport & ErrorAndLoading;
  reportFilterConfigs: {
    byId: Record<number, ReportFilterConfig>;
    allIds: number[];
    edit: ErrorAndLoading;
  } & ErrorAndLoading;
  excelExport: ErrorAndLoading;
  invalidFilters: ErrorAndLoading & { results: InvalidFiltersAPI };
  reportsPaginated: ReportConfigurationPaginatedList & ErrorAndLoading;
};

export type ReportConfigurationPaginatedList = {
  page: number;
  next_page: number | null;
  previous_page: number | null;
  count: number;
  page_size: number;
  allIds: number[];
  byId: Record<number, ReportConfiguration>;
};

export type ReportConfiguration = {
  id: number;
  name: string;
  category: ReportCategoryEnum;
  // The field 'global_category' coming from the backend isn't reliable
  // the default value 'Club' defined in the backend is always used.
  global_category: ReportGlobalCategoryEnum;
  description: string;
  columns: string[];
  date_start: string;
  date_end: string;
  report_filter_config_id: number | null;
  time_window_end?: string;
  time_window_start?: string;
  date_type?: ReportDateType;
  is_category_default?: boolean;
  version?: 1 | 2;
  updated_at: string;
};

export type ReportUpdateAPI = Partial<Omit<ReportConfiguration, 'id'>>;

export type ReportCategory = {
  id: string;
  name?: ReportCategoryEnum;
  icon: any;
};

export type ReportHeader = {
  averageable?: {
    column_identifier: string;
    datatype: string;
    column_value: null | number;
  }[];
  summable?: {
    column_identifier: string;
    datatype: string;
    column_value: null | number;
  }[];
};

export type ReportHeaderQueryParams = {
  date_start?: string;
  date_end?: string;
  report_filter_config_id?: number;
  page_size?: number;
  time_window_start?: string;
  time_window_end?: string;
  cursor?: string;
};

export type ReportMetadataColumn = {
  identifier: string;
  name?: string;
  datatype: DataSourceMedadataDataType;
  is_filterable?: boolean;
  is_qualitative?: boolean;
  summable?: boolean;
  averageable?: boolean;
};

export type ReportMetadataValue = {
  global_category: ReportCategoryEnum;
  category: ReportCategoryEnum;
  columns: ReportMetadataColumn[];
  date_type: ReportDateType;
  time_window_filtering_enabled: boolean;
};

export type ReportMetadataValueWithLabel = ReportMetadataValue & {
  label: string;
};

export type ReportMetadata = {
  results: ReportMetadataValue[];
} & ErrorAndLoading;

export type ReportFilterConfigConfig = {
  group_operand?: DatatypeFilterConfigGroupOperand;
  groups?: DatatypeFilterConfigGroup[];
};

export type ReportFilterConfig = {
  id: number;
  report: number;
  name: string;
  config: ReportFilterConfigConfig;
  is_quick_report_filter: boolean;
};

export type ReportFilterConfigCreateData = {
  report: number;
  config: ReportFilterConfigConfig;
  is_quick_report_filter: boolean;
};

export type ReportFilterConfigParams = {
  id__in?: number[];
  report_id_in?: number[];
  page?: number;
  page_size?: number | null;
};

export type ReportSerializerParams = {
  date_start?: string;
  date_end?: string;
  page_size?: number;
  report_filter_config_id?: number;
  time_window_start?: string;
  time_window_end?: string;
  cursor?: string;
};

export type ReportObjectPermissions = {
  read: boolean;
  edit: boolean;
  delete: boolean;
  create: boolean;
};

export type GlobalCategoryData = {
  globalCategory: string;
  reportCategories: ReportMetadataValueWithLabel[];
};

export type ReportQueryParams = {
  id__in?: number[];
  category?: ReportCategoryEnum;
  is_category_default?: boolean;
};

export type ReportGenerationParams = {
  timeStart?: string;
  timeEnd?: string;
  dateStart?: string;
  dateEnd?: string;
  reportFilterConfigId?: number;
  cursor?: string;
};

export type IsReportNameUsedParams = {
  name: string;
  category: ReportCategoryEnum;
  reportIdToIgnore?: number;
};

export enum ReportViewSortOption {
  LAST_UPDATED = '-updated_at',
  FIRST_CREATED = 'created_at',
  LAST_CREATED = '-created_at',
  ALPHABETICAL = 'name',
  REVERSE_ALPHABETICAL = '-name',
}

export type InvalidFiltersAPI = { [reportFilterConfigId: number]: string[] };

export type ReportSortingOption =
  | '-updated_at'
  | 'created_at'
  | '-created_at'
  | 'name'
  | '-name';

export type ReportV2QueryParams = {
  ordering?: ReportSortingOption;
} & PaginationFilterParams &
  ReportQueryParams;
