const STORYBOOK_DOCGENS_KEYS = ["displayName", "__docgenInfo"];

/**
 * By default, Storybook adds some keys in dev mode
 */
export const removeStorybookDocgens = (arr: string[]): string[] => {
  console.log(process.env.NODE_ENV);
  return process.env.NODE_ENV === "dev"
    ? arr.filter((x) => !STORYBOOK_DOCGENS_KEYS.includes(x))
    : arr;
};
