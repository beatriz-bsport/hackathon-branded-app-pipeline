import type { FC } from "react";
import { Link } from "react-router";

import type { UserRole } from "@bsport/api-staff-management/role";
import {
  Breadcrumbs,
  DetailsLayout,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type StaffDetailsPageProps = {
  staff: UserRole;
};

const StaffDetailsPage: FC<StaffDetailsPageProps> = ({ staff }) => {
  const { detailsLayoutProps } = useDetailsLayout();
  const { t } = useTranslation("staff-list");

  const { endGroupActions, startGroupActions } =
    DetailsLayout.useAdaptiveActions({ startGroupActions: [] });

  const pageTitle =
    `${staff.first_name} ${staff.last_name}`.trim() || staff.email;

  const BreadcrumbsItems = [
    <Link key="to-staff-list" to={URLS.INDEX}>
      <Breadcrumbs.Item text={t("name")} />
    </Link>,
  ];

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={pageTitle}
        BreadcrumbsItems={BreadcrumbsItems}
        endGroupActions={endGroupActions}
        startGroupActions={startGroupActions}
      />
      <DetailsLayout.Content />
    </DetailsLayout>
  );
};

export default StaffDetailsPage;
