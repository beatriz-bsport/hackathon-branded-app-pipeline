import type { FC } from "react";

import { Body, Title } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";
import { useCompanyTimezone } from "#src/utils/stores-interface";

export const Header: FC = () => {
  const { t, i18n } = useTranslation("default");

  const user = dataAccessLayer.useUserAccess();
  const timezone = useCompanyTimezone();
  const today = new Date();
  const companyTimezoneNow = today.toLocaleString(i18n.language, {
    dateStyle: "full",
    timeZone: timezone,
  });

  return (
    <div>
      <Body weight="weak" color="weak" size="md">
        {companyTimezoneNow}
      </Body>
      <Title weight="strong" htmlVariant="h2">
        {user && (user.name ?? user.username)
          ? t("header.title", { username: user.name ?? user.username })
          : t("header.titleWithoutName")}
      </Title>
    </div>
  );
};
