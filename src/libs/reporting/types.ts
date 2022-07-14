import { ErrorAndLoading } from '#libs/types';

import type {
  DataSourceMedadataDataType,
  DateFilterRangeEnum,
  DateFilterEnum,
  DynamicFilterDataType,
  DatatypeFilterConfigItemComparatorById,
  DatatypeFilterConfigGroup,
} from '#libs/datatype-filtering/types';

export type ReportingState = {
  reportResponse: {
    reportId: {
      result: (string | number | null)[];
      previous_page: null | number;
      next_page: number;
      other_pages: number[];
    };
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

export type ReportConfiguration = {
  id: number;
  name: string;
  category: ReportCategoryEnum;
  description: string;
  columns: string[];
  date_start: Date;
  date_end: Date;
  report_filter_config_id: number | null;
  time_period: DateFilterRangeEnum | DateFilterEnum | null;
};

export type ReportCategoryEnum = 'members' | 'payments' | 'products';

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
  name: string;
  datatype: DataSourceMedadataDataType;
  is_filterable: boolean;
};

export type ReportMetadataValue = {
  global_category: ReportCategoryEnum;
  category: ReportCategoryEnum;
  columns: ReportMetadataColumn[];
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
    group_operand: DatatypeFilterConfigItemComparatorById;
    groups: DatatypeFilterConfigGroup[];
  };
};

export type ReportFilterConfigParams = {
  id__in?: number[];
  report_id_in?: number[];
  page?: number;
  page_size?: number | null;
};
