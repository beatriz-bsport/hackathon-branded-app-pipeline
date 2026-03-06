export type DownloadInvoiceBulkExportRequest = {
  year: number;
  month: number;
};

export type DownloadInvoiceBulkExportResponse = {
  zip_file_url: string | null;
  zip_file_size_mb: string | null;
  export_status: string;
};
