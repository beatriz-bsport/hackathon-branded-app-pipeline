export function buildUrlParams(
  params: Record<string, string | number | boolean>,
) {
  if (!params) {
    return "";
  }
  const stringifiedParams = Object.fromEntries(
    Object.entries(params).map((entry) => [entry[0], entry[1].toString()]),
  );
  const urlParams = new URLSearchParams(stringifiedParams).toString();
  return `?${urlParams}`;
}
