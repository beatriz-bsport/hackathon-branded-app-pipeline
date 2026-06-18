import { Body, Chip, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type MemberDetailHeaderProps = {
  name: string;
  joinedLabel: string;
  birthdayLabel?: string;
  isBirthdayToday: boolean;
};

export function MemberDetailHeader({
  name,
  joinedLabel,
  birthdayLabel,
  isBirthdayToday,
}: MemberDetailHeaderProps) {
  const { t } = useTranslation("member-detail");

  return (
    <div className="flex flex-col gap-2xs">
      <Title htmlVariant="h3" weight="strong">
        {name}
      </Title>
      <Body size="sm" color="weak">
        {t("joined", { date: joinedLabel })}
      </Body>
      {birthdayLabel ? (
        <div className="flex flex-wrap items-center gap-xs">
          <Body size="sm" color="weak">
            {t("birthday", { date: birthdayLabel })}
          </Body>
          {isBirthdayToday ? (
            <Chip label={t("today")} type="weak" color="main" size="sm" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
