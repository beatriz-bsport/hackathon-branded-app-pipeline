import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Activity, type ReactElement, useMemo, useState } from "react";

import {
  type AppointmentSlot,
  fetchAppointmentSlotsQueryOptions,
  fetchAppointmentsQueryOptions,
} from "@bsport/api-book/appointments";
import type { Fetch } from "@bsport/fetch";
import { type FieldValues, useFormContext } from "@bsport/form";

import type { NumberListFieldPath } from "#src/utils/form-types";

import { AppointmentsSelector } from "./appointments-selector";
import { CompatibleAppointmentList } from "./compatible-appointment-list";
import { EditCompatibleSlotsModal } from "./edit-compatible-slots-modal";
import type { AppointmentCompatibility, CompatibilityFieldPath } from "./types";

const indexSlotsByAppointmentId = (
  slots: AppointmentSlot[],
): Map<number, AppointmentSlot[]> => {
  const map = new Map<number, AppointmentSlot[]>();
  for (const slot of slots) {
    const bucket = map.get(slot.private_service) ?? [];
    bucket.push(slot);
    map.set(slot.private_service, bucket);
  }
  return map;
};

const EMPTY_SLOTS_BY_APPOINTMENT_ID: Map<number, AppointmentSlot[]> = new Map();

export type AppointmentPassFormCompatibleAppointmentsSelectorProps<
  TFormValues extends FieldValues,
  TPrivateServicesField extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
  TCompatibilityField extends
    CompatibilityFieldPath<TFormValues> = CompatibilityFieldPath<TFormValues>,
> = {
  id: string;
  fetch: Fetch;
  privateServicesFieldName: TPrivateServicesField;
  compatibilityFieldName: TCompatibilityField;
  required?: boolean;
  disabled?: boolean;
};

export const AppointmentPassFormCompatibleAppointmentsSelector = <
  TFormValues extends FieldValues,
  TPrivateServicesField extends
    NumberListFieldPath<TFormValues> = NumberListFieldPath<TFormValues>,
  TCompatibilityField extends
    CompatibilityFieldPath<TFormValues> = CompatibilityFieldPath<TFormValues>,
>({
  id,
  fetch,
  privateServicesFieldName,
  compatibilityFieldName,
  required,
  disabled,
}: AppointmentPassFormCompatibleAppointmentsSelectorProps<
  TFormValues,
  TPrivateServicesField,
  TCompatibilityField
>): ReactElement => {
  const { watch, setValue } = useFormContext<TFormValues>();
  const privateServices = (watch(privateServicesFieldName) ??
    []) as unknown as number[];
  const compatibility = (watch(compatibilityFieldName) ??
    []) as unknown as AppointmentCompatibility[];
  const hasSelection = privateServices.length > 0;

  const { data: appointments, isLoading } = useQuery(
    fetchAppointmentsQueryOptions(fetch, { mine: true }),
  );

  const { data: slotsByAppointmentId = EMPTY_SLOTS_BY_APPOINTMENT_ID } =
    useQuery({
      ...fetchAppointmentSlotsQueryOptions(fetch, {
        private_service__in: privateServices,
      }),
      enabled: hasSelection,
      placeholderData: keepPreviousData,
      select: indexSlotsByAppointmentId,
    });

  const appointmentNameById = useMemo(
    () => new Map((appointments ?? []).map((entry) => [entry.id, entry.name])),
    [appointments],
  );

  const [editingAppointmentId, setEditingAppointmentId] = useState<
    number | null
  >(null);

  const handleSaveExclusions = (nextExcludedSlotIds: number[]) => {
    if (editingAppointmentId === null) {
      return;
    }

    const nextCompatibility = compatibility.map((entry) =>
      entry.private_service === editingAppointmentId
        ? { ...entry, excluded_slot_ids: nextExcludedSlotIds }
        : entry,
    );
    setValue(
      compatibilityFieldName,
      nextCompatibility as TFormValues[TCompatibilityField],
      { shouldDirty: true, shouldValidate: true },
    );
    setEditingAppointmentId(null);
  };

  const editingExcludedSlotIds =
    editingAppointmentId === null
      ? []
      : (compatibility.find(
          (entry) => entry.private_service === editingAppointmentId,
        )?.excluded_slot_ids ?? []);

  return (
    <div className="flex flex-col gap-md">
      <AppointmentsSelector<
        TFormValues,
        TPrivateServicesField,
        TCompatibilityField
      >
        id={id}
        appointments={appointments ?? []}
        isLoading={isLoading}
        privateServicesFieldName={privateServicesFieldName}
        compatibilityFieldName={compatibilityFieldName}
        required={required}
        disabled={disabled}
      />
      <Activity mode={hasSelection ? "visible" : "hidden"}>
        <CompatibleAppointmentList<
          TFormValues,
          TPrivateServicesField,
          TCompatibilityField
        >
          id={`${id}-list`}
          appointments={appointments ?? []}
          slotsByAppointmentId={slotsByAppointmentId}
          privateServicesFieldName={privateServicesFieldName}
          compatibilityFieldName={compatibilityFieldName}
          onEdit={setEditingAppointmentId}
        />
      </Activity>
      {editingAppointmentId !== null && (
        <EditCompatibleSlotsModal
          // Key remounts the modal each time a new appointment is being edited,
          // so the internal `selectedSlotIds` state re-initializes correctly.
          key={editingAppointmentId}
          id={`${id}-edit-modal`}
          appointmentName={appointmentNameById.get(editingAppointmentId) ?? ""}
          slots={slotsByAppointmentId.get(editingAppointmentId) ?? []}
          excludedSlotIds={editingExcludedSlotIds}
          onClose={() => setEditingAppointmentId(null)}
          onSave={handleSaveExclusions}
          disabled={disabled}
        />
      )}
    </div>
  );
};

AppointmentPassFormCompatibleAppointmentsSelector.displayName =
  "KaizenAppointmentPassFormCompatibleAppointmentsSelector";
