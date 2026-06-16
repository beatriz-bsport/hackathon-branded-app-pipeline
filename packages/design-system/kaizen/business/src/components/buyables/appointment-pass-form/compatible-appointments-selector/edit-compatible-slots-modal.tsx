import { type FC, useMemo, useState } from "react";

import type { AppointmentSlot } from "@bsport/api-book/appointments";
import {
  Alert,
  Checkbox,
  List,
  type ListItemProps,
  Modal,
} from "@bsport/kaizen-primitive-core";

import { i18nInstance, useTranslation } from "#src/i18n";

const PAGINATION_SIZE = 10;

export type EditCompatibleSlotsModalProps = {
  id: string;
  appointmentName: string;
  slots: AppointmentSlot[];
  excludedSlotIds: number[];
  onClose: () => void;
  onSave: (nextExcludedSlotIds: number[]) => void;
  disabled?: boolean;
};

const computeSelectAllValue = (
  selectedCount: number,
  totalCount: number,
): "checked" | "unchecked" | "indeterminate" => {
  if (selectedCount === 0) return "unchecked";
  if (selectedCount === totalCount) return "checked";
  return "indeterminate";
};

export const EditCompatibleSlotsModal: FC<EditCompatibleSlotsModalProps> = ({
  id,
  appointmentName,
  slots,
  excludedSlotIds,
  onClose,
  onSave,
  disabled,
}) => {
  const { t } = useTranslation("buyables", { i18n: i18nInstance });

  const allSlotIds = useMemo(
    () => slots.map((slot) => slot.id.toString()),
    [slots],
  );
  const initialCheckedIds = useMemo(
    () =>
      slots
        .filter((slot) => !excludedSlotIds.includes(slot.id))
        .map((slot) => slot.id.toString()),
    [slots, excludedSlotIds],
  );

  const [checkedIds, setCheckedIds] = useState<string[]>(initialCheckedIds);
  const [currentPage, setCurrentPage] = useState(1);

  const selectAllValue = computeSelectAllValue(
    checkedIds.length,
    allSlotIds.length,
  );
  const hasNoSelection = checkedIds.length === 0 && allSlotIds.length > 0;

  const handleSelectAll = (checked: boolean) => {
    setCheckedIds(checked ? allSlotIds : []);
  };

  const toggleSlot = (slotId: string) => {
    if (disabled) {
      return;
    }
    setCheckedIds((previous) =>
      previous.includes(slotId)
        ? previous.filter((id) => id !== slotId)
        : [...previous, slotId],
    );
  };

  const handleSave = () => {
    const checkedSet = new Set(checkedIds);
    const nextExcludedSlotIds = slots
      .filter((slot) => !checkedSet.has(slot.id.toString()))
      .map((slot) => slot.id);
    onSave(nextExcludedSlotIds);
  };

  const pageSlots = slots.slice(
    (currentPage - 1) * PAGINATION_SIZE,
    currentPage * PAGINATION_SIZE,
  );
  const items: ListItemProps[] = pageSlots.map((slot) => {
    const slotId = slot.id.toString();
    return {
      id: slotId,
      title: slot.name,
      className: "cursor-pointer",
      disabled: disabled,
      // When clicking on the row
      onItemClick: () => {
        if (disabled) {
          return;
        }
        toggleSlot(slotId);
      },
      // When clicking on the checkbox (that swallows the row click)
      onCheckboxChange: (checked) => {
        if (disabled) {
          return;
        }
        if (checked && !checkedIds.includes(slotId)) {
          setCheckedIds((prev) => [...prev, slotId]);
        }
        if (!checked && checkedIds.includes(slotId)) {
          setCheckedIds((prev) => prev.filter((id) => id !== slotId));
        }
      },
    };
  });

  return (
    <Modal
      open
      size="md"
      title={appointmentName}
      onClose={onClose}
      cancelButton={{
        label: t(
          "appointmentPassForm.compatibleAppointmentsSelector.editModal.cancel",
        ),
        onClick: onClose,
      }}
      confirmButton={{
        label: t(
          "appointmentPassForm.compatibleAppointmentsSelector.editModal.save",
        ),
        onClick: handleSave,
        disabled,
      }}
    >
      <div className="flex flex-col gap-md">
        {hasNoSelection && (
          <Alert status="warning">
            {t(
              "appointmentPassForm.compatibleAppointmentsSelector.editModal.noSessionsAlert",
              { appointmentName },
            )}
          </Alert>
        )}
        {allSlotIds.length > 0 && (
          <Checkbox
            id={`${id}-select-all`}
            value={selectAllValue}
            label={t(
              "appointmentPassForm.compatibleAppointmentsSelector.editModal.selectAll",
            )}
            onChange={handleSelectAll}
            disabled={disabled}
          />
        )}
        <List
          id={`${id}-list`}
          items={items}
          isSelectable
          checkedIds={checkedIds}
          setCheckedIds={setCheckedIds}
          emptyStateProps={{
            isEmpty: allSlotIds.length === 0,
            emptyConfig: {
              subtitle: t(
                "appointmentPassForm.compatibleAppointmentsSelector.editModal.emptyState",
              ),
            },
          }}
          paginationProps={
            slots.length > PAGINATION_SIZE
              ? {
                  totalItems: slots.length,
                  currentPage,
                  rowsPerPage: PAGINATION_SIZE,
                  onPageChange: setCurrentPage,
                }
              : undefined
          }
        />
      </div>
    </Modal>
  );
};

EditCompatibleSlotsModal.displayName = "KaizenEditCompatibleSlotsModal";
