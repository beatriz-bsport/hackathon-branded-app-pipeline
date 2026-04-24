import type { FC } from "react";

import { HTTPException } from "@bsport/fetch";

import { SectionErrorFallback } from "#src/components/query-boundary/fallbacks";

import { DetailsNotFound } from "./collection-details-not-found";

type CollectionDetailsFetchErrorProps = {
  error: Error;
  onRetry: () => void;
};

export const CollectionDetailsFetchError: FC<
  CollectionDetailsFetchErrorProps
> = ({ error, onRetry }) => {
  const is404 = error instanceof HTTPException && error.statusCode === 404;

  if (is404) {
    return <DetailsNotFound />;
  }

  return <SectionErrorFallback onRetry={onRetry} />;
};
