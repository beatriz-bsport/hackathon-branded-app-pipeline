import type { FC } from "react";

import type { Tag } from "@bsport/api-cdp/tags";
import { Chip } from "@bsport/kaizen-primitive-core";

// Tag.icon from the backend uses the legacy MUI icon name which The kaizen design system doesn't use
// To include we would need to map MUI → kaizen names.
export const TagChip: FC<{ tag: Tag; groupName: string }> = ({
  tag,
  groupName,
}) => (
  <Chip
    type="weak"
    color="main"
    customColor={tag.color}
    size="lg"
    label={`${groupName}: ${tag.name}`}
    rounded="lg"
  />
);
