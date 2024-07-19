import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';
import { ErrorAndLoading } from '#src/libs/types';

import type {
  DataSourceMedadataDataType,
  DateFilterRangeEnum,
  DateFilterEnum,
  DynamicFilterDataType,
  DatatypeFilterConfigItemComparatorById,
  DatatypeFilterConfigGroup,
} from '#src/libs/datatype-filtering/types';

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

export type CellConverter = (value: string | number | null) => {
  cellProps?: { [key: string]: any };
  value: string | number | null;
};

export type SerializedRow = {
  values: Array<CellData>;
  row_extra_data: { [key: string]: string | number | null };
};

export type SerializedReport = {
  result: SerializedRow[];
  previous_page: null | number;
  next_page: number;
  other_pages: number[];
};

export type ReportingState = {
  reportResponse: {
    reportId: SerializedReport;
  };
  allIds: null | number[];
  loading: boolean;
  error: null | string;
  page_size: number;
  reportId: null | number;
  reportHeaders: ReportHeader;
  headersLoading: boolean;
  headersError: null | string;
  excelReportingReducer: {
    loading: boolean;
    link: null | string;
    error: null | string;
  };
  list: {
    loading: boolean;
    error: null | string;
    results: ReportConfiguration[];
  };
  metadata: {
    loading: boolean;
    error: null | string;
    results: ReportMetadataValue[];
  };
  offerManagement: ErrorAndLoading;
  reportFilterConfigs: {
    dynamicDataHasBeenLoaded: Record<DynamicFilterDataType, boolean>;
    byId: Record<number, ReportFilterConfig>;
    allIds: number[];
  } & ErrorAndLoading;
};

export type ReportingStateV2 = {
  reports: {
    byId: Record<number, ReportConfiguration>;
    allIds: number[];
  } & ErrorAndLoading;
  columnsMetadata: { results: ReportMetadataValue[] } & ErrorAndLoading;
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
  time_period: DateFilterRangeEnum | DateFilterEnum | null;
  time_window_end?: string;
  time_window_start?: string;
  date_type?: string;
  time_start?: string;
  time_end?: string;
  time_window_period?: string;
};

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
};

export type ReportMetadataValueWithLabel = ReportMetadataValue & {
  label: string;
};

export type ReportMetadata = {
  results: ReportMetadataValue[];
  loading: boolean;
  error?: boolean;
};

export type ReportFilterConfig = {
  id: number;
  report: number;
  name: string;
  config: {
    group_operand?: DatatypeFilterConfigItemComparatorById;
    groups?: DatatypeFilterConfigGroup[];
  };
  is_quick_report_filter: boolean;
};

export type ReportFilterConfigParams = {
  id__in?: number[];
  report_id_in?: number[];
  page?: number;
  page_size?: number | null;
};

export type ReportSerializerParams = {
  date_start: Date;
  date_end?: Date;
  page_size: number;
  page: number;
  report_filter_config_id: number;
  time_period: DateFilterRangeEnum | DateFilterEnum | null;
};

export type ReportObjectPermissions = {
  read: true;
  edit: boolean;
  delete: boolean;
  create: boolean;
};

export type GlobalCategoryData = {
  globalCategory: string;
  reportCategories: ReportMetadataValueWithLabel[];
};
