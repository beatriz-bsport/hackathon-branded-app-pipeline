import type { FC } from "react";

import { selectPack, usePackStore } from "@bsport/store-buyables-pack";

import { PackDetailsLoading } from "#src/components/PackDetailsLoading";
import {
  useFetchAppointmentPasses,
  useFetchPasses,
  useFetchWebshopItems,
} from "#src/hooks/useFetchItems";
import {
  useFetchAppointmentPassCategories,
  useFetchPassCategories,
  useFetchWebshopCategories,
} from "#src/hooks/useFetchItemsCategories";
import { useFetchPack } from "#src/hooks/useFetchPack";
import { useRetrieveId } from "#src/hooks/useRetrieveId";

import { PackDetailsPage } from "./PackDetailsPage";

const getIds = (items: Array<{ id: number }>) => {
  return items.map((item) => item.id);
};

export const PackDetailsEntry: FC = () => {
  const validId = useRetrieveId();

  // Categories fetchers
  const { fetchPassCategories } = useFetchPassCategories();
  const { fetchAppointmentPassCategories } =
    useFetchAppointmentPassCategories();
  const { fetchWebshopCategories } = useFetchWebshopCategories();

  // Items fetchers
  const { fetchPasses } = useFetchPasses({
    onSuccess: (items) => {
      fetchPassCategories({
        id__in: items
          .map((item) => item.category)
          .filter((category) => category != null),
      });
    },
  });
  const { fetchAppointmentPasses } = useFetchAppointmentPasses({
    onSuccess: (items) => {
      fetchAppointmentPassCategories({
        id__in: items
          .map((item) => item.category)
          .filter((category) => category != null),
      });
    },
  });
  const { fetchWebshopItems } = useFetchWebshopItems({
    onSuccess: (items) => {
      fetchWebshopCategories({
        id__in: items
          .map((item) => item.subshop)
          .filter((category) => category != null),
      });
    },
  });

  const { isLoading } = useFetchPack({
    id: validId,
    onSuccess: (pack) => {
      const passesIds = getIds(pack.payment_packs);
      if (passesIds.length > 0) {
        fetchPasses({ id__in: passesIds });
      }

      const appointmentPassesIds = getIds(pack.private_passes);
      if (appointmentPassesIds.length > 0) {
        fetchAppointmentPasses({ id__in: appointmentPassesIds });
      }

      const webshopItemsIds = getIds(pack.shop_items);
      if (webshopItemsIds.length > 0) {
        fetchWebshopItems({ id__in: webshopItemsIds });
      }
    },
  });

  const pack = usePackStore((state) => selectPack(state, validId));

  if (pack) {
    return <PackDetailsPage pack={pack} />;
  }

  if (isLoading || !pack) {
    return <PackDetailsLoading />;
  }
};
