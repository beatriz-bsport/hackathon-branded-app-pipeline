import type { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";
import type { Pack } from "@bsport/store-buyables-pack";

import { useDetailsHeaderConfigs } from "#src/hooks/useDetailsHeaderConfigs";

type PackOverviewPageProps = {
  pack: Pack;
};

export const PackOverviewPage: FC<PackOverviewPageProps> = ({ pack }) => {
  const headerConfigs = useDetailsHeaderConfigs({
    id: pack.id,
    hidden: pack.manager_only,
  });

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={pack.name} {...headerConfigs} />
      <ListLayout.Content>
        <p>Hello overview</p>
      </ListLayout.Content>
    </ListLayout>
  );
};
