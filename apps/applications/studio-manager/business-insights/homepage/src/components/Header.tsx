import type { FC } from "react";

import { Body, Title } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

export const Header: FC = () => {
  const { t, i18n } = useTranslation("default");

  const today = new Date().toLocaleDateString([i18n.language], {
    dateStyle: "full",
  });

  const user = dataAccessLayer.useUserAccess();
  return (
    <div>
      <Body weight="weak" color="weak" size="md">
        {today}
      </Body>
      <Title weight="strong" htmlVariant="h2">
        {user && (user.name ?? user.username)
          ? t("header.title", { username: user.name ?? user.username })
          : t("header.titleWithoutName")}
      </Title>
    </div>
  );
};
