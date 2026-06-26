import { useId } from "react";

import { TextField } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type ThreadListSearchProps = {
  className?: string;
};

/** Search field in the thread-list header. */
export function ThreadListSearch({ className }: ThreadListSearchProps) {
  const { t } = useTranslation("thread-list");
  const id = useId();

  return (
    <TextField
      id={id}
      type="search"
      iconLeft="search-refraction"
      placeholder={t("threadListHeader.searchPlaceholder")}
      aria-label={t("threadListHeader.searchPlaceholder")}
      disabled
      fullWidth
      // The outer Kaizen-TextField wrapper is the flex child of the header row, so
      // grow/min-width must land there (via containerProps) — not on `className`,
      // which TextField applies to the inner field box. `fullWidth` then stretches
      // the input to fill that grown wrapper.
      containerProps={{ className }}
    />
  );
}
