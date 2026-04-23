import { type FC, useMemo, useState } from "react";

import {
  Body,
  List,
  type ListItemProps,
  Modal,
  TextField,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useSwapTeacher } from "#src/hooks/appointment/actions/use-swap-teacher";
import { useCheckResourceAllocation } from "#src/hooks/appointment/fetch/useCheckResourceAllocation";
import { useFetchCompanyTeachers } from "#src/hooks/appointment/fetch/useFetchCompanyTeachers";
import type { EnrichedAppointment } from "#src/types";
import { getTeacherInitials } from "#src/utils/get-teacher-initials";
import { useTranslation } from "#src/utils/i18n";

import { UnavailableResourcesAlert } from "./UnavailableResourcesAlert";
import { getAppointmentModalDescription } from "./get-appointment-modal-description";

type SwapTeacherModalProps = {
  appointment: EnrichedAppointment;
  isOpen: boolean;
  onClose: () => void;
};

export const SwapTeacherModal: FC<SwapTeacherModalProps> = ({
  appointment,
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation("sessionList");
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const companyTimezone = companyTheme?.timezone_name;
  const companyId = companyTheme?.company;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<number>(
    appointment.associated_coach,
  );
  const { data: teachers, isLoading } = useFetchCompanyTeachers(companyId);
  const swapTeacher = useSwapTeacher();
  const { unavailable, isChecking, checkAvailability, resetAvailability } =
    useCheckResourceAllocation(appointment);

  const filteredTeachers = useMemo(() => {
    if (!teachers) return [];
    if (!searchQuery.trim()) return teachers;
    const query = searchQuery.toLowerCase();
    return teachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(query),
    );
  }, [teachers, searchQuery]);

  const selectedTeacher = useMemo(
    () =>
      teachers?.find(
        (teacher) => teacher.associated_coach_id === selectedTeacherId,
      ),
    [teachers, selectedTeacherId],
  );
  const listItems: ListItemProps[] = useMemo(
    () =>
      filteredTeachers.map((teacher) => ({
        id: String(teacher.associated_coach_id),
        title: teacher.name,
        customNode: (
          <div className="flex gap-lg">
            {teacher.email && (
              <Body htmlVariant="span" size="md" color="weak">
                {teacher.email}
              </Body>
            )}
            {teacher.phone && (
              <Body htmlVariant="span" size="md" color="weak">
                {teacher.phone}
              </Body>
            )}
          </div>
        ),
        avatar: {
          shape: "round" as const,
          size: "sm" as const,
          src: teacher.photo ?? undefined,
          initials: getTeacherInitials({ teacher, teacherOverride: null }),
        },
        isActive: teacher.associated_coach_id === selectedTeacherId,
        onItemClick: () => {
          setSelectedTeacherId(teacher.associated_coach_id);
          resetAvailability();
        },
      })),
    [filteredTeachers, selectedTeacherId, resetAvailability],
  );

  const isUnchanged = selectedTeacherId === appointment.associated_coach;

  const handleConfirm = async () => {
    if (!selectedTeacher) return;

    if (!unavailable.coach) {
      const isAvailable = await checkAvailability(appointment.date_start, {
        coachId: selectedTeacher.id,
      });
      if (!isAvailable) return;
    }

    swapTeacher.mutate(
      {
        id: appointment.id,
        params: { associated_coach: selectedTeacherId },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const description = getAppointmentModalDescription(appointment, {
    locale: i18n.language,
    timeZone: companyTimezone,
  });

  return (
    <Modal
      open={isOpen}
      size="md"
      title={t("swapTeacherModal.title")}
      description={description}
      onClose={onClose}
      confirmButton={{
        label: t("swapTeacherModal.confirmButton"),
        onClick: handleConfirm,
        disabled:
          isUnchanged || isChecking || isLoading || swapTeacher.isPending,
      }}
      cancelButton={{
        label: t("swapTeacherModal.cancelButton"),
        onClick: onClose,
      }}
    >
      <div className="flex flex-col gap-md">
        <TextField
          id="swap-teacher-search"
          type="search"
          placeholder={t("swapTeacherModal.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
          fullWidth
        />

        <List
          id="swap-teacher-list"
          items={listItems}
          loadingProps={{
            isLoading,
            message: t("swapTeacherModal.loading"),
          }}
          emptyStateProps={{
            isEmpty: !isLoading && listItems.length === 0,
            emptyConfig: { title: t("swapTeacherModal.emptyState") },
          }}
        />

        {unavailable.coach && selectedTeacher && (
          <div className="sticky bottom-0">
            <UnavailableResourcesAlert
              resources={[
                {
                  name: selectedTeacher.name,
                  type: t("resourceAllocation.teacher"),
                },
              ]}
              confirmationMessage={t(
                "resourceAllocation.swapTeacherConfirmation",
              )}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};
