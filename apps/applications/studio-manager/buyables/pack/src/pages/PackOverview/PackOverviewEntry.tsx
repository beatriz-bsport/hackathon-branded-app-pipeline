import type { FC } from "react";

import { selectPack, usePackStore } from "@bsport/store-buyables-pack";

import { PackDetailsLoading } from "#src/components/PackDetailsLoading";
import { useFetchPack } from "#src/hooks/useFetchPack";
import { useRetrieveId } from "#src/hooks/useRetrieveId";

import { PackOverviewPage } from "./PackOverviewPage";

export const PackOverviewEntry: FC = () => {
  const validId = useRetrieveId();

  const { isLoading } = useFetchPack({
    id: validId,
  });

  const pack = usePackStore((state) => selectPack(state, validId));

  if (pack) {
    return <PackOverviewPage pack={pack} />;
  }

  if (isLoading || !pack) {
    return <PackDetailsLoading />;
  }
};
