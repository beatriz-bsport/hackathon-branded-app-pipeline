import { type FC, useState } from "react";

import { Body, Button, Divider, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { RecurringBookingsModal } from "./recurring-bookings-modal";
import { useRecurringBookings } from "./use-recurring-bookings";

export const RecurringBookingsSection: FC<{ sessionId: number }> = ({
  sessionId,
}) => {
  const { t } = useTranslation("sessionManagement");
  const { count, rows } = useRecurringBookings(sessionId);
  const [isOpen, setIsOpen] = useState(false);

  // No members auto-enrolled → render nothing (matches Hybrid/Tags sections).
  if (count === 0) return null;

  return (
    <>
      <Divider weight="extra-thin" />
      <section>
        <header className="flex items-center justify-between">
          <Title htmlVariant="h4" weight="strong">
            {t("sessionPanel.recurringBookings.title")}
          </Title>
          <Button
            kind="icon-button"
            icon="eye"
            size="md"
            intent="flat"
            color="default"
            label={t("sessionPanel.recurringBookings.viewAriaLabel")}
            onClick={() => setIsOpen(true)}
          />
        </header>
        <div className="pt-sm">
          <Body htmlVariant="p" size="lg" weight="weak">
            {t("sessionPanel.recurringBookings.memberCount", { count })}
          </Body>
        </div>
        <RecurringBookingsModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          rows={rows}
        />
      </section>
    </>
  );
};
