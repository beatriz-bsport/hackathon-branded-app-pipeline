import { ListLayout } from "@bsport/kaizen-primitive-core";

import { ROUTES } from "#src/pages/routes";
import { useTranslation } from "#src/utils/i18n";

import { GiftcardArchivedListContent } from "./GiftcardArchivedListContent";

export const GiftcardArchivedListPage: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.archivedList")}
        breadcrumbsItems={[
          {
            id: "giftcard",
            text: t("pages.list"),
            href: ROUTES.ACTIVE,
          },
        ]}
      />
      <ListLayout.Content>
        <GiftcardArchivedListContent />
      </ListLayout.Content>
    </ListLayout>
  );
};
