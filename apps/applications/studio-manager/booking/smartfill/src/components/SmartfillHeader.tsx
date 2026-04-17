import type { FC } from "react";

import { Body, Button, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type SmartfillHeaderProps = {
  isEnabled: boolean;
  isPending: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
};

export const SmartfillHeader: FC<SmartfillHeaderProps> = ({
  isEnabled,
  isPending,
  onActivate,
  onDeactivate,
}) => {
  const { t } = useTranslation("smartfill");

  return (
    <div className="flex flex-row items-start justify-between gap-lg">
      <div className="flex flex-col gap-xs">
        <Title htmlVariant="h2" color="default" weight="strong">
          {t("section.cta")}
        </Title>
        <Body size="md" color="weak">
          {t("section.subtitle")}
        </Body>
      </div>
      {isEnabled ? (
        <Button
          color="main"
          intent="default"
          label={t("section.disable")}
          size="md"
          loading={isPending}
          disabled={isPending}
          onClick={onDeactivate}
        />
      ) : (
        <Button
          color="main"
          intent="call-to-action"
          label={t("section.activate")}
          size="md"
          loading={isPending}
          disabled={isPending}
          onClick={onActivate}
        />
      )}
    </div>
  );
};
