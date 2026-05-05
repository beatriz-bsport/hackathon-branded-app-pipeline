import React from "react";

import { Badge, Body } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useIsSessionHappeningNow } from "./use-is-session-happening-now";

type SessionNameProps = {
  name: string;
  zone: string;
  date_start: string;
  duration_minute: number;
  className?: string;
};

export const SessionName: React.FC<SessionNameProps> = ({
  name,
  zone,
  date_start,
  duration_minute,
  className,
}) => {
  const { t } = useTranslation("sessionList");
  const isHappeningNow = useIsSessionHappeningNow(
    date_start,
    duration_minute,
    zone,
  );

  return (
    <div className="flex gap-xs items-center">
      {isHappeningNow && (
        <Badge text={t("table.datetime.now")} size="sm" color="main" />
      )}
      <Body htmlVariant="p" size="md" className={className}>
        {name}
      </Body>
    </div>
  );
};
