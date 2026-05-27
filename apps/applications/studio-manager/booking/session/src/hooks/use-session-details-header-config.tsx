import { Link } from "react-router";

import {
  Breadcrumbs,
  ChipProps,
  type HeaderLayoutProps,
} from "@bsport/kaizen-primitive-core";

import { SessionStatus } from "#src/components/session-details/constants";
import { Subtitle } from "#src/components/session-details/subtitle";
import type { DetailsHeaderSession } from "#src/types";
import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const useSessionDetailsHeaderConfig = (
  session: DetailsHeaderSession,
): Pick<
  HeaderLayoutProps,
  "BreadcrumbsItems" | "pageStatusChip" | "pageSubtitle"
> => {
  const { t } = useTranslation("sessionDetails");

  const { getIndexUrl } = useUrls();

  const sessionStatus = !session.available
    ? SessionStatus.CANCELLED
    : session.manager_only
      ? SessionStatus.UNLISTED
      : SessionStatus.LISTED;

  const statusChips: Record<SessionStatus, ChipProps> = {
    [SessionStatus.CANCELLED]: {
      color: "critical",
      size: "lg",
      type: "weak",
      label: t("header.cancelledSessionChip"),
    },
    [SessionStatus.LISTED]: {
      color: "main",
      size: "lg",
      type: "weak",
      label: t("header.listedSessionChip"),
    },
    [SessionStatus.UNLISTED]: {
      color: "default",
      size: "lg",
      type: "weak",
      label: t("header.unlistedSessionChip"),
    },
  };

  const pageStatusChip = statusChips[sessionStatus];

  const BreadcrumbsItems = [
    <Link key="link-to-calendar" to={getIndexUrl()}>
      <Breadcrumbs.Item text={t("header.breadcrumbs")} />
    </Link>,
  ];

  const pageSubtitle = <Subtitle {...session} />;

  return { BreadcrumbsItems, pageStatusChip, pageSubtitle };
};
