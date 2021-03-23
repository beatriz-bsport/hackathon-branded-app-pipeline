// @flow

export type ReportConfiguration = {
  id: number,
  name: string,
  category: String,
  description: string,
  columns: string[],
  date_start: Date,
  date_end: Date,
};

export type ReportCategoryEnum = 'members' | 'payments' | 'products';

export type ReportCategory = { id: number, name: ReportCategoryEnum, icon: * };

export type ReportMedadataDataType = 'string' | 'number';

export type ReportMetadataColumn = {
  identifier: string,
  name: string,
  datatype: ReportMedadataDataType,
};

export type ReportMetadataValue = {
  global_category: ReportCategoryEnum,
  category: String,
  columns: ReportMetadataColumn[],
};

export type ReportMetadata = {
  value: ReportMetadataValue[],
  loading: boolean,
  error: ?boolean,
};
