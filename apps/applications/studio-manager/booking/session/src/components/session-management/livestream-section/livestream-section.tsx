import { DateTime } from "luxon";
import { type FC, useEffect, useState } from "react";

import { modifyTime } from "@bsport/datetime-manipulation";
import {
  Alert,
  Body,
  Button,
  Card,
  Title,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useRetrieveSession } from "#src/hooks/session-api/fetch/use-retrieve-session";
import { useRetrieveSessionDetails } from "#src/hooks/session-api/fetch/use-retrieve-session-details";
import { useFetchZoomApp } from "#src/hooks/use-fetch-zoom-app";
import { useUrls } from "#src/urls.js";
import { useTranslation } from "#src/utils/i18n";
import {
  ADD_ON_IDENTIFIER_ZOOM_APP,
  useCheckCompanyAddOn,
} from "#src/utils/permission";

const MINUTES_BEFORE_WINDOW = 15;
const INTERVAL_DELAY = 1000; // 1 second

type Props = {
  sessionId: number;
};

export const LivestreamSection: FC<Props> = ({ sessionId }) => {
  const { t } = useTranslation("sessionManagement");

  const { navigateToEdit } = useUrls();

  const { data: session } = useRetrieveSession(sessionId);

  const { activity } = useRetrieveSessionDetails(session);

  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const { data: zoomApp } = useFetchZoomApp(companyId);
  const hasZoomAppAddOn = useCheckCompanyAddOn(ADD_ON_IDENTIFIER_ZOOM_APP);
  const isZoomAppActive = hasZoomAppAddOn && !!zoomApp && !zoomApp.is_disabled;

  const [isBeforeWindow, setIsBeforeWindow] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const check = () => {
      const now = DateTime.now();
      const start = DateTime.fromISO(session.date_start);
      const end = modifyTime({
        datetime: start,
        duration: { minute: session.duration_minute },
        operator: "plus",
      });

      setIsBeforeWindow(
        now <
          modifyTime({
            datetime: start,
            duration: { minute: MINUTES_BEFORE_WINDOW },
            operator: "minus",
          }),
      );
      setHasEnded(now >= end);
    };

    check();
    const interval = setInterval(check, INTERVAL_DELAY);
    return () => clearInterval(interval);
  }, [session.date_start, session.duration_minute]);

  const hasLink = !!session.broadcast_link;

  const isNotReadyYet = isBeforeWindow || !hasLink;

  const shouldDisplayAlert =
    !isZoomAppActive && !hasLink && activity.is_broadcast && !hasEnded;

  // In the case of a Zoom meeting, the broadcast link is automatically generated ~24h hours before the class starts.
  // This alert is here only when the Zoom app is not active, because it means that the link hasn't been configured properly.
  if (shouldDisplayAlert) {
    return (
      <Alert
        status="warning"
        title={t("livestream.missingLink.title")}
        buttonLabel={t("livestream.missingLink.editClass")}
        onButtonClick={() => navigateToEdit(session.id)}
      >
        {t("livestream.missingLink.description")}
      </Alert>
    );
  }

  if (hasEnded || !activity.is_broadcast) {
    return null;
  }

  const handleConnect = () => {
    window.open(session.broadcast_link, "_blank", "noopener,noreferrer");
    setClicked(true);
  };

  return (
    <Card>
      <div className="flex flex-row items-center justify-between gap-md">
        <div>
          <Title htmlVariant="h4" color="default" weight="strong">
            {t("livestream.title")}
          </Title>
          {!isNotReadyYet && !clicked && (
            <Body htmlVariant="p" size="lg" color="weak">
              {t("livestream.start")}
            </Body>
          )}
          {clicked ? (
            <div className="flex flex-col">
              <Body htmlVariant="p" size="lg" color="weak">
                {t("livestream.fallbackText")}
              </Body>
              <Body weight="strong" color="main">
                <a
                  href={session.broadcast_link}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {session.broadcast_link}
                </a>
              </Body>
            </div>
          ) : isNotReadyYet ? (
            <Body htmlVariant="p" size="lg" color="weak">
              {t("livestream.notReadyYet")}
            </Body>
          ) : null}
        </div>
        {!clicked && (
          <Button
            label={t("livestream.connect")}
            intent="call-to-action"
            color="main"
            size="md"
            disabled={isBeforeWindow || !hasLink}
            onClick={handleConnect}
          />
        )}
      </div>
    </Card>
  );
};
