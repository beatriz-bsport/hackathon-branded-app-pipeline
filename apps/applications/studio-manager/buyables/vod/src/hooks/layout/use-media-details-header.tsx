import { Link } from "react-router";

import { Breadcrumbs, DetailsLayout } from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const useMediaDetailsHeader = () => {
  const { t } = useTranslation("media-details");

  const breadcrumbs = [
    <Link key="link-to-media-list" to={`${URLS.INDEX}/${URLS.MEDIA}`}>
      <Breadcrumbs.Item text={t("breadcrumbLabel")} />
    </Link>,
  ];

  const { endGroupActions, startGroupActions } =
    DetailsLayout.useAdaptiveActions({
      startGroupActions: [],
    });

  return {
    BreadcrumbsItems: breadcrumbs,
    endGroupActions,
    startGroupActions,
  };
};
