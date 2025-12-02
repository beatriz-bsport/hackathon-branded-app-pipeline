import type { FC } from "react";
import { Link } from "react-router";

import { Breadcrumbs } from "@bsport/kaizen-primitive-core";
import {
  DetailsLayout,
  Loader,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const PackDetailsLoading: FC = () => {
  const { t } = useTranslation("details");
  const { detailsLayoutProps } = useDetailsLayout();

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={t("detailsPage.loading")}
        BreadcrumbsItems={[
          <Link key="to-packs-list" to={URLS.INDEX}>
            <Breadcrumbs.Item text={t("detailsPage.packsBreadcrumbs")} />
          </Link>,
        ]}
      />
      <DetailsLayout.Content>
        <Loader size="xl" />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};
