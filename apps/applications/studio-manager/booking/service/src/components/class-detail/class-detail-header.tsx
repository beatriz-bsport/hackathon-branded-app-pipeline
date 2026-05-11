import { type FC } from "react";
import { Link, useNavigate } from "react-router";

import type { MetaActivity } from "@bsport/api-book";
import {
  Breadcrumbs,
  Button,
  DetailsLayout,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";

import { useClassRowPermissions } from "#src/hooks/use-permissions";
import { ABSOLUTE_ROUTES, CALENDAR_URL } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  metaActivity: MetaActivity;
  pageTabs: TabsProps;
};

export const ClassDetailHeader: FC<Props> = ({ metaActivity, pageTabs }) => {
  const { t } = useTranslation("class-detail");
  const navigate = useNavigate();

  const { canEdit, canDelete } = useClassRowPermissions(
    metaActivity.is_workshop,
  );

  const isArchived = !metaActivity.customer_enabled;

  const listRoute = isArchived
    ? ABSOLUTE_ROUTES.ARCHIVED
    : ABSOLUTE_ROUTES.ACTIVE;
  const breadcrumbLabel = isArchived
    ? t("classDetail.header.breadcrumbs.archived")
    : t("classDetail.header.breadcrumbs.active");

  const BreadcrumbsItems = [
    <Breadcrumbs.Item
      key="services"
      text={t("classDetail.header.breadcrumbs.services")}
    />,
    <Link key="list" to={listRoute}>
      <Breadcrumbs.Item text={breadcrumbLabel} />
    </Link>,
  ];

  const endGroupActions = isArchived
    ? [
        ...(canDelete
          ? [
              <Button
                key="unarchive"
                kind="icon-button"
                icon="unarchive"
                label={t("classDetail.header.actions.unarchive")}
                size="md"
                intent="default"
                color="main"
                onClick={() => null}
              />,
            ]
          : []),
      ]
    : [
        ...(canEdit
          ? [
              <Button
                key="duplicate"
                kind="icon-button"
                icon="copy-03"
                label={t("classDetail.header.actions.duplicate")}
                size="md"
                intent="default"
                color="main"
                onClick={() => null}
              />,
            ]
          : []),
        ...(canDelete
          ? [
              <Button
                key="archive"
                kind="icon-button"
                icon="archive"
                label={t("classDetail.header.actions.archive")}
                size="md"
                intent="default"
                color="main"
                onClick={() => null}
              />,
            ]
          : []),
        <DetailsLayout.Button
          key="schedule"
          label={t("classDetail.header.actions.scheduleSessions")}
          iconLeft="calendar"
          iconRight="link-external-02"
          intent="default"
          color="main"
          onClick={() => navigate(CALENDAR_URL)}
        />,
      ];

  return (
    <DetailsLayout.Header
      pageTitle={metaActivity.name}
      BreadcrumbsItems={BreadcrumbsItems}
      pageTabs={pageTabs}
      endGroupActions={endGroupActions}
    />
  );
};
