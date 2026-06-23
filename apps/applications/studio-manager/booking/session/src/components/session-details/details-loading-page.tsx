import { FC } from "react";
import { Link } from "react-router";

import {
  Breadcrumbs,
  DetailsLayout,
  Loader,
} from "@bsport/kaizen-primitive-core";

import { ABSOLUTE_ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const DetailsLoadingPage: FC = () => {
  const { t } = useTranslation("sessionDetails");

  return (
    <DetailsLayout>
      <DetailsLayout.Header
        pageTitle={t("loading")}
        BreadcrumbsItems={[
          <Link key="link-to-classes-list" to={ABSOLUTE_ROUTES.CLASSES_LIST}>
            <Breadcrumbs.Item text={t("header.breadcrumbs")} />
          </Link>,
        ]}
      />
      <DetailsLayout.Content>
        <div className="grid place-content-center min-h-element-3xl p-md ">
          <Loader size="xl" />
        </div>
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};
