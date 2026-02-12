import tinyinvariant from "tiny-invariant";

import { captureException } from "@bsport/sm-backbone";

export const invariant: typeof tinyinvariant = (condition, message) => {
  const isLocal = import.meta.env.DEV;

  if (isLocal) {
    tinyinvariant(condition, message);
    return;
  }

  if (!condition) {
    const errorMessage = typeof message === "function" ? message() : message;
    captureException(new Error(errorMessage ?? "Invalid invariant"));
  }
};
