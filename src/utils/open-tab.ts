export const openTab = (url: string, target?: string) => {
  const width = window.screen.width * 0.5;
  const height = window.screen.height * 0.65;
  const params = `
      scrollbars=no,
      resizable=no,
      status=no,
      location=no,
      toolbar=no,
      menubar=no,
      width=${width},
      height=${height},
      left=${window.screen.width / 2 - width / 2},
      top=${window.screen.height / 2 - height / 2}
    `;

  return window.open(url, target || '_blank', params);
};
