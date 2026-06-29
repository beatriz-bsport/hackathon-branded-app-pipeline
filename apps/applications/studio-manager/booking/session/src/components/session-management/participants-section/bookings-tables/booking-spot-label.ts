import type { SpotInformation } from "@bsport/api-book";

import { composeLabel } from "#src/components/spot-selector/spot-canvas/spot-label.js";

export const formatBookingSpotLabel = (
  spotInformation: SpotInformation | null | undefined,
  fallbackSpotName: string,
) => {
  if (!spotInformation) {
    return "";
  }

  const spotName = spotInformation.name?.trim();

  const spotLabel = composeLabel(
    spotInformation.prefix,
    spotInformation.indexType,
    null,
    spotInformation.suffix,
  ).trim();

  if (!spotName && !spotLabel) {
    return "";
  }

  return [spotName || fallbackSpotName, spotLabel].filter(Boolean).join(" ");
};
