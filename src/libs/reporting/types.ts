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
  reportHeaders: {
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
};

export type ReportConfiguration = {
  id: number;
  name: string;
  category: String;
  description: string;
  columns: string[];
  date_start: Date;
  date_end: Date;
};

export type ReportCategoryEnum = 'members' | 'payments' | 'products';

export type ReportCategory = {
  id: number;
  name: ReportCategoryEnum;
  icon: any;
};

export type ReportMedadataDataType = 'string' | 'number';

export type ReportMetadataColumn = {
  identifier: string;
  name: string;
  datatype: ReportMedadataDataType;
};

export type ReportMetadataValue = {
  global_category: ReportCategoryEnum;
  category: String;
  columns: ReportMetadataColumn[];
};

export type ReportMetadata = {
  value: ReportMetadataValue[];
  loading: boolean;
  error?: boolean;
};
