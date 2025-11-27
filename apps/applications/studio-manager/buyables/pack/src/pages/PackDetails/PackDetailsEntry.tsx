import type { FC } from "react";

import { selectPack, usePackStore } from "@bsport/store-buyables-pack";

import { PackDetailsLoading } from "#src/components/PackDetailsLoading";
import { useFetchItems } from "#src/hooks/useFetchItems";
import { useFetchPack } from "#src/hooks/useFetchPack";
import { useRetrieveId } from "#src/hooks/useRetrieveId";

import { PackDetailsPage } from "./PackDetailsPage";

const getIds = (items: Array<{ id: number }>) => {
  return items.map((item) => item.id);
};

export const PackDetailsEntry: FC = () => {
  const validId = useRetrieveId();

  // Fetch Pack value related to this id
  const { fetchPasses, fetchAppointmentPasses, fetchWebshopItems } =
    useFetchItems();
  const { isLoading } = useFetchPack({
    id: validId,
    onSuccess: (pack) => {
      fetchPasses({ id__in: getIds(pack.payment_packs) });
      fetchAppointmentPasses({ id__in: getIds(pack.private_passes) });
      fetchWebshopItems({ id__in: getIds(pack.shop_items) });
    },
  });

  const pack = usePackStore((state) => selectPack(state, validId));

  if (isLoading || !pack) {
    return <PackDetailsLoading />;
  }

  return <PackDetailsPage pack={pack} />;
};
