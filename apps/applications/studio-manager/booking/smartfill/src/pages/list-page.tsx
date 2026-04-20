import type { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import Content from "#src/components/Content";
import { useTranslation } from "#src/utils/i18n";

const ListPage: FC = () => {
  const { t } = useTranslation("smartfill");

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("page.title")} />
      <ListLayout.Content>
        <Content />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
