import { type FC } from "react";
import { Link } from "react-router";

import type { Establishment } from "@bsport/api-book";
import {
  Breadcrumbs,
  Button,
  DetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { ABSOLUTE_ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  venue: Establishment;
  onArchive: (venue: Establishment) => void;
};

export const VenueDetailHeader: FC<Props> = ({ venue, onArchive }) => {
  const { t } = useTranslation("venues-list");

  const BreadcrumbsItems = [
    <Link key="list" to={ABSOLUTE_ROUTES.ACTIVE}>
      <Breadcrumbs.Item text={t("detail.breadcrumbs.venues")} />
    </Link>,
  ];

  const endGroupActions = [
    <Button
      key="archive"
      kind="icon-button"
      icon="archive"
      label={t("detail.actions.archive")}
      size="md"
      intent="default"
      color="main"
      onClick={() => onArchive(venue)}
    />,
    <Button
      key="widget"
      kind="default"
      intent="default"
      color="main"
      size="md"
      label={t("detail.actions.configureWidget")}
      onClick={() => {
        // Wired in later chunk
      }}
    />,
  ];

  return (
    <DetailsLayout.Header
      pageTitle={venue.title}
      BreadcrumbsItems={BreadcrumbsItems}
      endGroupActions={endGroupActions}
    />
  );
};
