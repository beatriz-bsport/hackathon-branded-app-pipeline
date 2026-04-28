import { FC } from "react";

import { Button } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const BookButton: FC = () => {
  const { t } = useTranslation("sessionManagement");
  return (
    <Button
      kind="default"
      iconLeft="plus"
      label={t("bookButton")}
      intent="call-to-action"
      size="md"
      color="main"
    />
  );
};
