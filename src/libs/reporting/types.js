// @flow

export type ReportConfiguration = {
  id: number,
  name: string,
  description: string,
  columns: string[],
};

export type ReportCategoryEnum = 'members' | 'payments' | 'products';

export type ReportCategory = { id: number, name: ReportCategoryEnum, icon: * };

export type ReportMedadataDataType = 'string' | 'number';

export type ReportMetadataColumn = {
  identifier: string,
  name: string,
  datatype: ReportMedadataDataType,
};

export type ReportMetadata = {
  category: ReportCategoryEnum,
  columns: ReportMetadataColumn[],
};
