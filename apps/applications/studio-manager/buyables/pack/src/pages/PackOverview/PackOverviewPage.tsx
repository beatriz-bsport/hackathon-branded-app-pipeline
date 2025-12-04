import type { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";
import type { Pack } from "@bsport/store-buyables-pack";

import { PurchasedPackTable } from "#src/components/PurchasedPackTable";
import { useDetailsHeaderConfigs } from "#src/hooks/useDetailsHeaderConfigs";
import { useFetchPurchasedPacks } from "#src/hooks/useFetchPurchasedPacks";

type PackOverviewPageProps = {
  pack: Pack;
};

export const PackOverviewPage: FC<PackOverviewPageProps> = ({ pack }) => {
  const headerConfigs = useDetailsHeaderConfigs({
    id: pack.id,
    hidden: pack.manager_only,
  });

  const tableConfig = useFetchPurchasedPacks(pack.id);
  return (
    <ListLayout>
      <ListLayout.Header pageTitle={pack.name} {...headerConfigs} />
      <ListLayout.Content>
        <PurchasedPackTable {...tableConfig} />
      </ListLayout.Content>
    </ListLayout>
  );
};
