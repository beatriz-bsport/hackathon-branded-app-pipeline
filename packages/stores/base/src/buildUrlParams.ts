type Primitive = string | number | boolean;

export function buildUrlParams(
  params: Record<string, Primitive | Array<Primitive>>,
) {
  if (!params) {
    return "";
  }

  const stringifiedParams = Object.fromEntries(
    Object.entries(params).map((entry) => {
      if (Array.isArray(entry[1])) {
        return [entry[0], entry[1].join(",")];
      }
      return [entry[0], entry[1].toString()];
    }),
  );

  const urlParams = new URLSearchParams(stringifiedParams).toString();

  return `?${urlParams}`;
}
