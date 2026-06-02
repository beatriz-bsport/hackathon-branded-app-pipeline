import type { Pass } from "@bsport/api-buyables";

export const getPassPrice = (pass: Pass): number => {
  if (typeof pass.price === "number") return pass.price;
  return pass.price.parsedValue;
};
