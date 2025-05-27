import mapValues from "lodash/mapValues";

export const variants = {
  size: {
    xl: ["h-icon-xl", "w-icon-xl"],
    lg: ["h-icon-lg", "w-icon-lg"],
    md: ["h-icon-md", "w-icon-md"],
    sm: ["h-icon-sm", "w-icon-sm"],
    xs: ["h-icon-xs", "w-icon-xs"],
  },
} as const;

export const sizes = mapValues(variants.size, (_, key) => key) as {
  [key in keyof typeof variants.size]: key;
};
