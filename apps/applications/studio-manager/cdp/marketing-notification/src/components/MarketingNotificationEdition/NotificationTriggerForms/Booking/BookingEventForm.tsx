import { ControlledForm, type ControlledFormProps } from "@bsport/form";
import { Title } from "@bsport/kaizen-primitive-core";

import { BookingNotificationTriggerField } from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/BookingNotificationTriggerField";
import { useTranslation } from "#src/utils/i18n";
import type { TriggerConfigValidationFormData } from "#src/utils/schemas/types";

type BookingEventFormProps = Omit<
  ControlledFormProps<TriggerConfigValidationFormData>,
  "children"
> & {
  itemIds: number[];
};

export const BookingEventForm = ({ ...methods }: BookingEventFormProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  return (
    <div className="flex flex-col gap-md">
      <Title htmlVariant="h3" weight="strong">
        {t("steps.notificationRules.title")}
      </Title>
      <ControlledForm {...methods}>
        <BookingNotificationTriggerField {...methods} />
      </ControlledForm>
    </div>
  );
};
