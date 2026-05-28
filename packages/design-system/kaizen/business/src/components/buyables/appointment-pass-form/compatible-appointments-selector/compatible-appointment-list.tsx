import { useMemo } from "react";
import type { ReactElement } from "react";

import type {
  Appointment,
  AppointmentSlot,
} from "@bsport/api-book/appointments";
import { type FieldValues, useFormContext } from "@bsport/form";
import { Card, List, type ListItemProps } from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";
import type { NumberListFieldPath } from "#src/utils/form-types";

import type { AppointmentCompatibility, CompatibilityFieldPath } from "./types";

export type CompatibleAppointmentListProps<
  TFormValues extends FieldValues,
  TPrivateServicesField extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
  TCompatibilityField extends
    CompatibilityFieldPath<TFormValues> = CompatibilityFieldPath<TFormValues>,
> = {
  id: string;
  appointments: Appointment[];
  slotsByAppointmentId: Map<number, AppointmentSlot[]>;
  privateServicesFieldName: TPrivateServicesField;
  compatibilityFieldName: TCompatibilityField;
  onEdit: (appointmentId: number) => void;
};

const SLOTS_COMPATIBILITY_STATES = {
  ALL: "all",
  NONE: "none",
  PARTIAL: "partial",
} as const;

type DescriptionState =
  | { kind: "all" }
  | { kind: "none" }
  | { kind: "partial"; slotNames: string };

const computeDescriptionState = ({
  excludedSlotIds,
  appointmentSlots,
}: {
  excludedSlotIds: number[];
  appointmentSlots: AppointmentSlot[] | undefined;
}): DescriptionState => {
  if (!appointmentSlots?.length) {
    return { kind: SLOTS_COMPATIBILITY_STATES.NONE };
  }

  if (excludedSlotIds.length === 0) {
    return { kind: SLOTS_COMPATIBILITY_STATES.ALL };
  }

  if (excludedSlotIds.length >= appointmentSlots.length) {
    return { kind: SLOTS_COMPATIBILITY_STATES.NONE };
  }

  const slotNames =
    appointmentSlots
      .filter((slot) => !excludedSlotIds.includes(slot.id))
      .map((slot) => slot.name)
      .join(", ") ?? "";
  return { kind: SLOTS_COMPATIBILITY_STATES.PARTIAL, slotNames };
};

export const CompatibleAppointmentList = <
  TFormValues extends FieldValues,
  TPrivateServicesField extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
  TCompatibilityField extends
    CompatibilityFieldPath<TFormValues> = CompatibilityFieldPath<TFormValues>,
>({
  id,
  appointments,
  slotsByAppointmentId,
  privateServicesFieldName,
  compatibilityFieldName,
  onEdit,
}: CompatibleAppointmentListProps<
  TFormValues,
  TPrivateServicesField,
  TCompatibilityField
>): ReactElement => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });
  const { watch, setValue } = useFormContext<TFormValues>();

  const privateServices = (watch(privateServicesFieldName) ??
    []) as unknown as number[];
  const compatibility = (watch(compatibilityFieldName) ??
    []) as unknown as AppointmentCompatibility[];

  const appointmentNameById = useMemo(
    () => new Map(appointments.map((entry) => [entry.id, entry.name])),
    [appointments],
  );

  const handleRemove = (appointmentId: number) => {
    setValue(
      privateServicesFieldName,
      privateServices.filter(
        (id) => id !== appointmentId,
      ) as TFormValues[TPrivateServicesField],
      { shouldDirty: true, shouldValidate: true },
    );
    setValue(
      compatibilityFieldName,
      compatibility.filter(
        (entry) => entry.private_service !== appointmentId,
      ) as TFormValues[TCompatibilityField],
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const items: ListItemProps[] = privateServices.map((appointmentId) => {
    const excludedSlotIds =
      compatibility.find((entry) => entry.private_service === appointmentId)
        ?.excluded_slot_ids ?? [];
    const state = computeDescriptionState({
      excludedSlotIds,
      appointmentSlots: slotsByAppointmentId.get(appointmentId),
    });

    const description = (() => {
      if (state.kind === SLOTS_COMPATIBILITY_STATES.ALL)
        return t(
          "appointmentPassForm.compatibleAppointmentsSelector.list.compatibleWithAll",
        );
      if (state.kind === SLOTS_COMPATIBILITY_STATES.NONE)
        return t(
          "appointmentPassForm.compatibleAppointmentsSelector.list.noSessionsAvailable",
        );
      return t(
        "appointmentPassForm.compatibleAppointmentsSelector.list.compatibleWith",
        { slotNames: state.slotNames },
      );
    })();

    return {
      id: appointmentId.toString(),
      title: appointmentNameById.get(appointmentId) ?? "",
      description,
      className: "border-none",
      buttons: [
        {
          id: `edit-${appointmentId}`,
          kind: "icon-button",
          icon: "pencil-02",
          label: t(
            "appointmentPassForm.compatibleAppointmentsSelector.list.editAction",
          ),
          intent: "flat",
          color: "default",
          size: "md",
          onClick: () => onEdit(appointmentId),
        },
        {
          id: `remove-${appointmentId}`,
          kind: "icon-button",
          icon: "minus",
          label: t(
            "appointmentPassForm.compatibleAppointmentsSelector.list.removeAction",
          ),
          intent: "flat",
          color: "critical",
          size: "md",
          onClick: () => handleRemove(appointmentId),
        },
      ],
    };
  });

  return (
    <Card elevated padding="sm">
      <List id={id} items={items} />
    </Card>
  );
};

CompatibleAppointmentList.displayName = "KaizenCompatibleAppointmentList";
