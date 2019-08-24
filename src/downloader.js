export const downloadAsCsv = (headers, data, filename) => {
  const csvContent = `data:text/csv;charset=utf-8,${[headers, ...data]
    .map((row) => row.join(','))
    .join('\n')}`;

  const encodedUri = encodeURI(csvContent);

  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename || 'download.csv');

  document.body.appendChild(link);
  link.click();
};
