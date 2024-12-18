import axios from 'axios';

export const downloadAsCsv = (
  headers: Array<string>,
  data: Array<Array<string | number>>,
  filename: string,
) => {
  const csvContent = `data:text/csv;charset=utf-8,\uFEFF${[headers, ...data]
    .map((row) => row.join('@{]¤&@'))
    .join('\n')
    .replaceAll(/#/gi, ' ')
    .replaceAll(/;/gi, ' ')
    .replaceAll(/,/gi, ' ')
    .replaceAll(/@{]¤&@/gi, ';')}`;

  const encodedUri = encodeURI(csvContent);

  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename || 'download.csv');

  document.body.appendChild(link);
  link.click();
};

export const downloadDocument = (filepath: string) => {
  const filename = filepath.split('/').at(-1);
  axios
    .get(filepath, {
      responseType: 'blob',
    })
    .then((res) => {
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    });
};

/**
 * Export data as CSV with formatted content.
 *
 * This function takes formatted data as a string and exports it as a CSV file with a specified filename.
 * The data will be encoded to ensure proper formatting and character encoding for CSV.
 *
 * @param {string} formattedData - The formatted data to be exported as CSV.
 * @param {string} [fileName='export.csv'] - Optional. The name of the CSV file to be downloaded.
 *                                           If not provided, the default filename 'export.csv' will be used.
 *
 * @returns {void} - This function does not return a value directly. It initiates the CSV export and triggers the download.
 *
 * @example
 * // Usage example:
 * const formattedData = "Name,Age\nJohn,30\nAlice,25\n";
 * exportAsCsvWithFormattedData(formattedData, "data_export.csv");
 *
 * // Result: A CSV file named 'data_export.csv' will be downloaded with the specified formatted data.
 */
export const exportAsCsvWithFormattedData = (
  formattedData: string,
  fileName?: string,
) => {
  const csvContent = `data:text/csv;charset=utf-8,\uFEFF${formattedData}`;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', fileName || 'export.csv');

  document.body.appendChild(link);
  link.click();
};
