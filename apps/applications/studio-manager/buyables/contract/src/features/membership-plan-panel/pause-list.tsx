import { type FC, useState } from "react";

import type { BillingPlanPause } from "@bsport/api-buyables/billing-plan";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { Body, Button } from "@bsport/kaizen-primitive-core";

import { MembershipPlanDeactivatePauseModal } from "#src/features/membership-plan-deactivate-pause-modal";
import { MembershipPlanPauseModal } from "#src/features/membership-plan-pause-modal";
import { useToday } from "#src/utils/date";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  billingPlanId: number;
  pauses: BillingPlanPause[];
};

const formatPauseDate = (date: string) =>
  formatDateTime(date, DATETIME_FORMATS.DAY_MONTH);

export const MembershipPlanPauseList: FC<Props> = ({
  billingPlanId,
  pauses,
}) => {
  const { t } = useTranslation("membership-plan");
  const [pauseBeingEdited, setPauseBeingEdited] =
    useState<BillingPlanPause | null>(null);
  const [pauseBeingCancelled, setPauseBeingCancelled] =
    useState<BillingPlanPause | null>(null);

  const today = useToday().toISODate()!;

  return (
    <>
      <section className="flex flex-col gap-xs">
        <Body size="md" weight="strong">
          {t("panel.details.pauses.title")}
        </Body>

        {pauses.length === 0 ? (
          <Body size="sm" color="weak">
            {t("panel.details.pauses.empty")}
          </Body>
        ) : (
          <div className="flex flex-col gap-xs">
            {pauses.map((pause) => {
              const isOngoing =
                pause.from_date <= today && today <= pause.until_date;

              return (
                <div
                  key={pause.id}
                  className="flex flex-row items-center gap-xs"
                >
                  <div className="flex flex-col gap-2xs flex-1">
                    <Body size="md">
                      {t("panel.details.pauses.range", {
                        fromDate: formatPauseDate(pause.from_date),
                        untilDate: formatPauseDate(pause.until_date),
                      })}
                    </Body>
                    <Body size="sm" color="weak">
                      {pause.name}
                    </Body>
                  </div>
                  <div className="flex flex-row gap-2xs">
                    <Button
                      kind="icon-button"
                      intent="flat"
                      color="default"
                      size="sm"
                      icon="clock-slash"
                      label={t("panel.details.pauses.cancel")}
                      disabled={isOngoing}
                      onClick={() => setPauseBeingCancelled(pause)}
                    />
                    <Button
                      kind="icon-button"
                      intent="flat"
                      color="default"
                      size="sm"
                      icon="calendar"
                      label={t("panel.details.pauses.reschedule")}
                      disabled={isOngoing}
                      onClick={() => setPauseBeingEdited(pause)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {pauseBeingCancelled && (
        <MembershipPlanDeactivatePauseModal
          billingPlanId={billingPlanId}
          pause={pauseBeingCancelled}
          closeModal={() => setPauseBeingCancelled(null)}
          isOpen
        />
      )}

      {pauseBeingEdited && (
        <MembershipPlanPauseModal
          billingPlanId={billingPlanId}
          closeModal={() => setPauseBeingEdited(null)}
          existingPauses={pauses}
          initial={{
            pauseId: pauseBeingEdited.id,
            fromDate: pauseBeingEdited.from_date,
            untilDate: pauseBeingEdited.until_date,
            name: pauseBeingEdited.name,
          }}
          isOpen
        />
      )}
    </>
  );
};
