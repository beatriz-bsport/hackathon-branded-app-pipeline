import type { FC } from "react";
import { useNavigate } from "react-router";

import { ErrorFallback } from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const DetailsFetchError: FC = () => {
  const { t } = useTranslation("contract-details");
  const navigate = useNavigate();

  return (
    <ErrorFallback
      title={t("canNotFindContract.title")}
      subtitle="" // Mandatory to remove default translations
      description="" // Mandatory to remove default translations
      className="mx-auto h-full"
      actionProps={{
        label: t("canNotFindContract.goToListPage"),
        iconLeft: "link-external-02",
        onClick: () => navigate(URLS.INDEX),
      }}
    />
  );
};
