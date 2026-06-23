import { type FC, useMemo } from "react";

import type { Establishment, Teacher } from "@bsport/api-book";
import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { type DateTime, modifyTime } from "@bsport/datetime-manipulation";
import {
  Body,
  Button,
  Card,
  Divider,
  Icon,
  Title,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { TeacherCell } from "#src/components/common/teacher-cell";
import {
  CustomRecurrenceUnit,
  RecurrenceType,
} from "#src/helpers/recurrence/types";
import { useFetchAllEstablishments } from "#src/hooks/use-fetch-establishments";
import { useFetchTeachers } from "#src/hooks/use-fetch-teachers";
import type { SeriesClassDraft, SeriesClassDraftOccurrence } from "#src/types";
import { getTeacherInitials } from "#src/utils/get-teacher-initials";
import { useTranslation } from "#src/utils/i18n";

type SeriesClassDraftListProps = {
  drafts: SeriesClassDraft[];
  onDeleteDraft: (draftId: string) => void;
  onEditDraft: (draftId: string) => void;
};

const getTeachersById = (teachers: Teacher[] | undefined) => {
  const teachersById = new Map<number, Teacher>();
  (teachers ?? []).forEach((teacher) => teachersById.set(teacher.id, teacher));
  return teachersById;
};

const getEstablishmentsById = (establishments: Establishment[] | undefined) => {
  const establishmentsById = new Map<number, Establishment>();
  (establishments ?? []).forEach((establishment) =>
    establishmentsById.set(establishment.id, establishment),
  );
  return establishmentsById;
};

const getSortedOccurrences = (draft: SeriesClassDraft) =>
  [...draft.occurrences].sort(
    (firstOccurrence, secondOccurrence) =>
      firstOccurrence.startDateTime.toMillis() -
      secondOccurrence.startDateTime.toMillis(),
  );

const getEarliestOccurrenceStartTime = (
  occurrences: SeriesClassDraftOccurrence[],
) =>
  occurrences.reduce<DateTime | null>(
    (earliestStartTime, occurrence) =>
      earliestStartTime === null ||
      occurrence.startDateTime.toMillis() < earliestStartTime.toMillis()
        ? occurrence.startDateTime
        : earliestStartTime,
    null,
  );

const getFirstOccurrenceStartTime = (draft: SeriesClassDraft) =>
  getEarliestOccurrenceStartTime(draft.occurrences) ?? draft.data.startDateTime;

const getSortedDrafts = (drafts: SeriesClassDraft[]) =>
  drafts
    .map((draft) => ({
      draft,
      firstOccurrenceStartTime: getFirstOccurrenceStartTime(draft),
    }))
    .sort(
      (firstDraft, secondDraft) =>
        firstDraft.firstOccurrenceStartTime.toMillis() -
        secondDraft.firstOccurrenceStartTime.toMillis(),
    )
    .map(({ draft }) => draft);

const formatDraftTimeRange = ({
  durationMinute,
  startDateTime,
}: {
  durationMinute: number;
  startDateTime: DateTime;
}) => {
  const endDateTime = modifyTime({
    datetime: startDateTime,
    duration: { minute: durationMinute },
    operator: "plus",
  });

  return `${formatDateTimeFromDate(
    startDateTime,
    DATETIME_FORMATS.TIME_SIMPLE,
  )} - ${formatDateTimeFromDate(endDateTime, DATETIME_FORMATS.TIME_SIMPLE)}`;
};

const formatOccurrenceDateRange = (
  occurrences: SeriesClassDraftOccurrence[],
) => {
  const sortedOccurrences = [...occurrences].sort(
    (firstOccurrence, secondOccurrence) =>
      firstOccurrence.startDateTime.toMillis() -
      secondOccurrence.startDateTime.toMillis(),
  );
  const firstOccurrence = sortedOccurrences[0];
  const lastOccurrence = sortedOccurrences[sortedOccurrences.length - 1];

  // Saved drafts should always have at least one occurrence, but keep this
  // formatter as a defensive guard (empty strings will anyway be discarded by Filter(boolean))
  if (!firstOccurrence || !lastOccurrence) {
    return "";
  }

  const firstDate = formatDateTimeFromDate(
    firstOccurrence.startDateTime,
    DATETIME_FORMATS.MEDIUM_DATE,
  );
  const lastDate = formatDateTimeFromDate(
    lastOccurrence.startDateTime,
    DATETIME_FORMATS.MEDIUM_DATE,
  );

  return firstDate === lastDate ? firstDate : `${firstDate} - ${lastDate}`;
};

export const SeriesClassDraftList: FC<SeriesClassDraftListProps> = ({
  drafts,
  onDeleteDraft,
  onEditDraft,
}) => {
  const { t } = useTranslation("series");
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  const { data: teachers } = useFetchTeachers({
    company: companyId,
    disabled: false,
  });
  const { data: establishments } = useFetchAllEstablishments({
    company: companyId,
    disabled_establishments: false,
    enabled: Boolean(companyId),
  });

  const teachersById = useMemo(() => getTeachersById(teachers), [teachers]);
  const establishmentsById = useMemo(
    () => getEstablishmentsById(establishments),
    [establishments],
  );
  const sortedDrafts = useMemo(() => getSortedDrafts(drafts), [drafts]);

  const getRecurrenceFrequencyLabel = (draft: SeriesClassDraft) => {
    if (draft.data.recurrenceType === RecurrenceType.WEEKLY) {
      return t("seriesAddModal.steps.addClasses.list.recurrence.weekly");
    }

    if (draft.data.recurrenceUnit === CustomRecurrenceUnit.DAYS) {
      return t("seriesAddModal.steps.addClasses.list.recurrence.customDays", {
        count: draft.data.recurrenceInterval,
      });
    }

    if (draft.data.recurrenceUnit === CustomRecurrenceUnit.WEEKS) {
      return t("seriesAddModal.steps.addClasses.list.recurrence.customWeeks", {
        count: draft.data.recurrenceInterval,
      });
    }

    return t("seriesAddModal.steps.addClasses.list.recurrence.customMonths", {
      count: draft.data.recurrenceInterval,
    });
  };

  const renderDraftActions = ({
    draft,
    isRecurrence,
  }: {
    draft: SeriesClassDraft;
    isRecurrence: boolean;
  }) => (
    <div className="flex gap-xs">
      <Button
        color="main"
        icon="pencil-02"
        intent="default"
        kind="icon-button"
        label={t(
          isRecurrence
            ? "seriesAddModal.steps.addClasses.list.actions.editRecurrence"
            : "seriesAddModal.steps.addClasses.list.actions.edit",
        )}
        onClick={() => onEditDraft(draft.id)}
        size="md"
        type="button"
      />
      <Button
        color="main"
        icon="trash-01"
        intent="default"
        kind="icon-button"
        label={t(
          isRecurrence
            ? "seriesAddModal.steps.addClasses.list.actions.deleteRecurrence"
            : "seriesAddModal.steps.addClasses.list.actions.delete",
        )}
        onClick={() => onDeleteDraft(draft.id)}
        size="md"
        type="button"
      />
    </div>
  );

  const renderDraftOccurrenceRow = ({
    draft,
    occurrence,
    showActions,
  }: {
    draft: SeriesClassDraft;
    occurrence: SeriesClassDraftOccurrence;
    showActions: boolean;
  }) => {
    const teacher =
      draft.data.coach !== null ? teachersById.get(draft.data.coach) : null;
    const establishment =
      draft.data.establishment !== null
        ? establishmentsById.get(draft.data.establishment)
        : null;

    return (
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-md px-lg py-md">
        <div className="min-w-0">
          <Body size="md" weight="strong" className="truncate">
            {formatDateTimeFromDate(
              occurrence.startDateTime,
              DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY,
            )}
          </Body>
          <Body size="md" color="weak" className="truncate">
            {formatDraftTimeRange({
              durationMinute: draft.data.duration_minute,
              startDateTime: occurrence.startDateTime,
            })}
          </Body>
        </div>
        <TeacherCell
          teacherName={
            teacher?.name ?? t("seriesAddModal.steps.addClasses.list.notSet")
          }
          teacherAvatar={teacher?.photo ?? undefined}
          teacherInitials={getTeacherInitials({
            teacher,
            teacherOverride: null,
          })}
        />
        <Body size="md" className="truncate">
          {establishment?.title ??
            t("seriesAddModal.steps.addClasses.list.notSet")}
        </Body>
        {showActions ? (
          renderDraftActions({ draft, isRecurrence: false })
        ) : (
          <div />
        )}
      </div>
    );
  };

  if (drafts.length === 0) return null;

  return (
    <Card actionable={false} padding="none" className="flex flex-col">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-md bg-surface-default-weaker px-lg py-md">
        <Title htmlVariant="h5" weight="stronger">
          {t("seriesAddModal.steps.addClasses.list.headers.dateAndTime")}
        </Title>
        <Title htmlVariant="h5" weight="stronger">
          {t("seriesAddModal.steps.addClasses.list.headers.teacher")}
        </Title>
        <Title htmlVariant="h5" weight="stronger">
          {t("seriesAddModal.steps.addClasses.list.headers.establishment")}
        </Title>
        <div />
      </div>
      <Divider orientation="horizontal" weight="thin" />
      {sortedDrafts.map((draft, draftIndex) => {
        const sortedOccurrences = getSortedOccurrences(draft);
        const firstOccurrence = sortedOccurrences[0] ?? {
          id: `${draft.id}-fallback-occurrence`,
          startDateTime: draft.data.startDateTime,
        };
        const isRecurringDraft = draft.data.isRecurring;

        return (
          <div key={draft.id}>
            {draftIndex > 0 ? (
              <Divider orientation="horizontal" weight="thin" />
            ) : null}
            {isRecurringDraft ? (
              <div className="border-l-stroke-thin border-stroke-main">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-md bg-surface-default-weaker px-lg py-md">
                  <div className="flex min-w-0 items-center gap-sm">
                    <Icon
                      icon="refresh-ccw-02"
                      size="md"
                      className="shrink-0 text-onsurface-main-strong"
                    />
                    <Body size="md" weight="strong" className="truncate">
                      {[
                        t(
                          "seriesAddModal.steps.addClasses.list.recurrence.label",
                        ),
                        getRecurrenceFrequencyLabel(draft),
                        formatOccurrenceDateRange(sortedOccurrences),
                        t("seriesAddModal.steps.addClasses.classCount", {
                          count: sortedOccurrences.length,
                        }),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </Body>
                  </div>
                  {renderDraftActions({ draft, isRecurrence: true })}
                </div>
                {sortedOccurrences.map((occurrence) => (
                  <div key={occurrence.id}>
                    <Divider orientation="horizontal" weight="thin" />
                    {renderDraftOccurrenceRow({
                      draft,
                      occurrence,
                      showActions: false,
                    })}
                  </div>
                ))}
              </div>
            ) : (
              renderDraftOccurrenceRow({
                draft,
                occurrence: firstOccurrence,
                showActions: true,
              })
            )}
          </div>
        );
      })}
    </Card>
  );
};
