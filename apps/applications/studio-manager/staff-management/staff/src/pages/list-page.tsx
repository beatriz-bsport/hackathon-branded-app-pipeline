import type { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useTranslation } from "#src/utils/i18n";

const ListPage: FC = () => {
  const { t } = useTranslation("staff-list");

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("name")} />
      <ListLayout.Content>
        <QueryBoundary />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
