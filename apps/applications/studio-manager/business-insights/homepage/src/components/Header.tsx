import type { FC } from "react";

import { Body, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const Header: FC = () => {
  const { t, i18n } = useTranslation("default");

  const today = new Date().toLocaleDateString([i18n.language], {
    dateStyle: "full",
  });

  return (
    <div>
      <Body weight="weak" color="weak" size="md">
        {today}
      </Body>
      <Title weight="strong" htmlVariant="h3">
        {t("header.title")}
      </Title>
    </div>
  );
};
