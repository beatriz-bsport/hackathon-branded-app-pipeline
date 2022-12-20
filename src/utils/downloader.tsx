import axios from 'axios';

export const downloadAsCsv = (
  headers: Array<string>,
  data: Array<Array<string>>,
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
