export const openTab = (url: string, target?: string) => {
  const width = window.innerWidth * 0.5;
  const height = window.innerHeight * 0.5;
  const params = `
      scrollbars=no,
      resizable=no,
      status=no,
      location=no,
      toolbar=no,
      menubar=no,
      width=${width},
      height=${height},
      left=${width / 2},
      top=${height / 2}
    `;

  return window.open(url, target || '_blank', params);
};
