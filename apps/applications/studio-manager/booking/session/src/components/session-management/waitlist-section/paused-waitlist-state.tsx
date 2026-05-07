import { FC } from "react";

import { Body, Button, Illustration } from "@bsport/kaizen-primitive-core";

import { SessionManagementModalType } from "#src/hooks/use-session-management-modals";
import { useTranslation } from "#src/utils/i18n";

export const PausedWaitlistState: FC<{
  openModal: (type: SessionManagementModalType) => void;
}> = ({ openModal }) => {
  const { t } = useTranslation("sessionManagement");

  return (
    <div className="flex flex-col py-xl gap-xs items-center justify-center border-stroke-regular border-stroke-weak rounded-md overflow-hidden">
      <Illustration name="paused" />
      <Body
        htmlVariant="p"
        weight="weak"
        color="weak"
        className="text-center"
        size="lg"
      >
        {t("pausedWaitlistState.description")}
      </Body>
      <div className="flex flex-row items-center justify-center gap-xs mt-sm">
        <Button
          kind="default"
          color="main"
          size="md"
          intent="default"
          label={t("pausedWaitlistState.viewWaitlistMembers")}
          onClick={() => {
            openModal(SessionManagementModalType.VIEW_WAITLIST);
          }}
        />
        <Button
          kind="default"
          color="main"
          size="md"
          intent="call-to-action"
          label={t("pausedWaitlistState.reactivateWaitlist")}
          onClick={() => {
            openModal(SessionManagementModalType.REACTIVATE_WAITLIST);
          }}
        />
      </div>
    </div>
  );
};
