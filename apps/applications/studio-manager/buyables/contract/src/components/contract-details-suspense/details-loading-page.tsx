import type { FC } from "react";
import { Link } from "react-router";

import { Breadcrumbs, ListLayout, Loader } from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const DetailsLoadingPage: FC = () => {
  const { t } = useTranslation("contract-details");

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("header.loading")}
        BreadcrumbsItems={[
          <Link key="link-to-contract-list" to={URLS.INDEX}>
            <Breadcrumbs.Item text={t("header.breadcrumbs.contracts")} />
          </Link>,
        ]}
      />
      <ListLayout.Content>
        <Loader size="xl" />
      </ListLayout.Content>
    </ListLayout>
  );
};
