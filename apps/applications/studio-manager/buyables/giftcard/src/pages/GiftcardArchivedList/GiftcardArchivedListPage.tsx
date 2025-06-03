import { Link } from "react-router";

import { Breadcrumbs, ListLayout } from "@bsport/kaizen-primitive-core";

import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { GiftcardArchivedListContent } from "./GiftcardArchivedListContent";

export const GiftcardArchivedListPage: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.archivedList")}
        BreadcrumbsItems={[
          <Link key="to-active-giftcard" to={ROUTES.ACTIVE}>
            <Breadcrumbs.Item
              id="breadcrumb-active-giftcard"
              text={t("pages.list")}
            />
          </Link>,
        ]}
      />
      <ListLayout.Content>
        <GiftcardArchivedListContent />
      </ListLayout.Content>
    </ListLayout>
  );
};
