import type { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

const ListPage: FC = () => {
  const { t } = useTranslation("default");
  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("pageTitle")} />
      <ListLayout.Content>
        <p>Your content</p>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
