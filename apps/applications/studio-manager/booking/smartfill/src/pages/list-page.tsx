import type { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import Content from "#src/components/Content";
import { useSmartfillHeaderConfig } from "#src/hooks/use-smartfill-header-config";
import { useTranslation } from "#src/utils/i18n";

const ListPage: FC = () => {
  const { t } = useTranslation("smartfill");
  const { pageStatusChip, callToActionButton } = useSmartfillHeaderConfig();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("page.title")}
        pageStatusChip={pageStatusChip}
        callToActionButton={callToActionButton}
      />
      <ListLayout.Content>
        <Content />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default ListPage;
