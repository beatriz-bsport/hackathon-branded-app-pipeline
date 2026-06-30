import { useMemo } from "react";

import { RAW_PACKS } from "#src/constants";
import { Pack, PackId } from "#src/types/pack";
import { useTranslation } from "#src/utils/i18n";

type UsePackDataResult = {
  subscribedPacks: Pack[];
  availablePacks: Pack[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

const subscribedPacksIds: PackId[] = [];

export const usePackData = (): UsePackDataResult => {
  const { t } = useTranslation("subscription");

  const packs = useMemo<Pack[]>(
    () =>
      RAW_PACKS.map(({ nameKey, descriptionKey, ...rest }) => ({
        ...rest,
        name: t(nameKey),
        description: t(descriptionKey),
      })),
    [t],
  );

  return useMemo(
    () => ({
      subscribedPacks: packs.filter((p) => subscribedPacksIds.includes(p.id)),
      availablePacks: packs.filter((p) => !subscribedPacksIds.includes(p.id)),
      isLoading: false,
      isError: false,
      refetch: () => {},
    }),
    [packs],
  );
};
