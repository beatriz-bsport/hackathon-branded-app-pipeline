import { FC } from "react";

import { Body, Button } from "@bsport/kaizen-primitive-core";

import { setListedInformation } from "#src/stores/session-management/actions";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import { BookingListedInformation } from "#src/stores/session-management/types";
import { useTranslation } from "#src/utils/i18n";

const LISTED_INFORMATION_OPTIONS = Object.values(BookingListedInformation);

export const ListedInformationSettings: FC = () => {
  const { t } = useTranslation("sessionManagement");
  const listedInformation = useSessionManagementStore(
    (state) => state.listedInformation,
  );

  return (
    <div className="flex flex-col gap-xs">
      <Body size="md" weight="weak">
        {t("listedInformation.label")}
      </Body>
      <div className="flex flex-wrap gap-xs">
        {LISTED_INFORMATION_OPTIONS.map((info) => (
          <Button
            key={info}
            label={t(`listedInformation.${info}`)}
            size="sm"
            intent="default"
            onClick={() => setListedInformation(info)}
            color={listedInformation.includes(info) ? "selected" : "main"}
          />
        ))}
      </div>
    </div>
  );
};
