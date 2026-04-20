import { Link } from "react-router";

import { Breadcrumbs } from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const useCollectionDetailsHeader = () => {
  const { t } = useTranslation("collections-list");

  const breadcrumbs = [
    <Link key="link-to-collection-list" to={URLS.INDEX}>
      <Breadcrumbs.Item text={t("details.breadcrumbLabel")} />
    </Link>,
  ];

  return {
    BreadcrumbsItems: breadcrumbs,
  };
};
