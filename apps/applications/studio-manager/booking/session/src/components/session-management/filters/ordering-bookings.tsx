import { FC } from "react";

import { Button, Select } from "@bsport/kaizen-primitive-core";

import { setBookingOrdering } from "#src/stores/session-management/actions";
import { useSessionManagementStore } from "#src/stores/session-management/store";
import { BookingOrdering } from "#src/stores/session-management/types";
import { useTranslation } from "#src/utils/i18n";

enum OrderingField {
  DATE_CREATED = "date_created",
  MEMBER_FIRST_NAME = "member_first_name",
  MEMBER_LAST_NAME = "member_last_name",
}

const FIELD_TO_ORDERING: Record<
  OrderingField,
  { asc: BookingOrdering; desc: BookingOrdering }
> = {
  [OrderingField.DATE_CREATED]: {
    asc: BookingOrdering.OLDEST_FIRST,
    desc: BookingOrdering.NEWEST_FIRST,
  },
  [OrderingField.MEMBER_FIRST_NAME]: {
    asc: BookingOrdering.MEMBER_FIRST_NAME_ASC,
    desc: BookingOrdering.MEMBER_FIRST_NAME_DESC,
  },
  [OrderingField.MEMBER_LAST_NAME]: {
    asc: BookingOrdering.MEMBER_LAST_NAME_ASC,
    desc: BookingOrdering.MEMBER_LAST_NAME_DESC,
  },
};

const getFieldFromOrdering = (ordering?: BookingOrdering): OrderingField => {
  if (!ordering) return OrderingField.DATE_CREATED;
  return (
    (ordering.replace("-", "") as OrderingField) || OrderingField.DATE_CREATED
  );
};

const isDescending = (ordering?: BookingOrdering): boolean => {
  return ordering?.startsWith("-") ?? true;
};

export const OrderingBookings: FC = () => {
  const { t } = useTranslation("sessionManagement");

  const ordering = useSessionManagementStore(
    (state) => state.bookingFilters.ordering,
  );

  const currentField = getFieldFromOrdering(ordering);
  const desc = isDescending(ordering);

  const options = [
    {
      id: OrderingField.DATE_CREATED,
      label: t("bookingOrdering.mostRecent"),
    },
    {
      id: OrderingField.MEMBER_FIRST_NAME,
      label: t("bookingOrdering.firstName"),
    },
    {
      id: OrderingField.MEMBER_LAST_NAME,
      label: t("bookingOrdering.lastName"),
    },
  ];

  const isOrderingField = (value: string): value is OrderingField =>
    (Object.values(OrderingField) as string[]).includes(value);

  const handleFieldChange = (fieldId: string) => {
    if (!isOrderingField(fieldId)) return;
    const field = fieldId as OrderingField;
    setBookingOrdering(FIELD_TO_ORDERING[field][desc ? "desc" : "asc"]);
  };

  const handleToggleDirection = () => {
    const newDesc = !desc;
    setBookingOrdering(
      FIELD_TO_ORDERING[currentField][newDesc ? "desc" : "asc"],
    );
  };

  return (
    <div className="flex items-end gap-xs">
      <Select
        label={t("bookingOrdering.label")}
        hideLabel
        items={options}
        value={currentField}
        onChange={handleFieldChange}
      />
      <Button
        kind="icon-button"
        icon={desc ? "arrows-down" : "arrows-up"}
        label={t("bookingOrdering.switchOrder")}
        intent="default"
        size="md"
        color="main"
        onClick={handleToggleDirection}
      />
    </div>
  );
};
