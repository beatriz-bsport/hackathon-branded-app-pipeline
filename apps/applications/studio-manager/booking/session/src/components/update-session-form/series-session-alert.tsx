import clsx from "clsx";
import { FC } from "react";

import { SessionWithActivity } from "@bsport/api-book";
import {
  Alert,
  Body,
  Button,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const SeriesSessionAlert: FC<{ session: SessionWithActivity }> = ({
  session,
}) => {
  const { t } = useTranslation("sessionEdit");
  const { navigateToSeriesDetails } = useUrls();

  const isMobile = !useMatchMedia("sm");
  const seriesId = session.group;

  if (seriesId === null) return null;

  return (
    <Alert status="info" className="mb-sm">
      <div
        className={clsx("flex", {
          "flex-col items-start gap-sm": isMobile,
          "flex-row items-center justify-between": !isMobile,
        })}
      >
        <Body htmlVariant="p" size="md" weight="weak" color="info">
          {t(
            "editSessionForm.content.seriesSessionRestrictions.alertDescription",
          )}
        </Body>
        <Button
          label={t(
            "editSessionForm.content.seriesSessionRestrictions.editSeriesButton",
          )}
          intent="default"
          color="main"
          size="sm"
          onClick={() => navigateToSeriesDetails(seriesId)}
        />
      </div>
    </Alert>
  );
};
