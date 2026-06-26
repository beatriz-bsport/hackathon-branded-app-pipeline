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
  Title,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { TeacherCell } from "#src/components/common/teacher-cell";
import { useFetchAllEstablishments } from "#src/hooks/use-fetch-establishments";
import { useFetchTeachers } from "#src/hooks/use-fetch-teachers";
import type { SeriesClassDraft } from "#src/types";
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

const getSortedDrafts = (drafts: SeriesClassDraft[]) =>
  [...drafts].sort(
    (firstDraft, secondDraft) =>
      firstDraft.data.startDateTime.toMillis() -
      secondDraft.data.startDateTime.toMillis(),
  );

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

export const SeriesClassDraftList: FC<SeriesClassDraftListProps> = ({
  drafts,
  onDeleteDraft,
  onEditDraft,
}) => {
  const { t } = useTranslation("series");
  const isMobile = !useMatchMedia("md");
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

  const renderDraftActions = (draft: SeriesClassDraft) => (
    <div className="flex shrink-0 gap-xs">
      <Button
        color="main"
        icon="pencil-02"
        intent="default"
        kind="icon-button"
        label={t("seriesAddModal.steps.addClasses.list.actions.edit")}
        onClick={() => onEditDraft(draft.id)}
        size="md"
        type="button"
      />
      <Button
        color="main"
        icon="trash-01"
        intent="default"
        kind="icon-button"
        label={t("seriesAddModal.steps.addClasses.list.actions.delete")}
        onClick={() => onDeleteDraft(draft.id)}
        size="md"
        type="button"
      />
    </div>
  );

  const getDraftDisplayData = (draft: SeriesClassDraft) => {
    const teacher =
      draft.data.coach !== null ? teachersById.get(draft.data.coach) : null;
    const establishment =
      draft.data.establishment !== null
        ? establishmentsById.get(draft.data.establishment)
        : null;
    const classDate = formatDateTimeFromDate(
      draft.data.startDateTime,
      DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY,
    );
    const classTimeRange = formatDraftTimeRange({
      durationMinute: draft.data.duration_minute,
      startDateTime: draft.data.startDateTime,
    });
    const missingValue = t("seriesAddModal.steps.addClasses.list.notSet");

    return {
      classDate,
      classTimeRange,
      establishmentName: establishment?.title ?? missingValue,
      teacherAvatar: teacher?.photo ?? undefined,
      teacherInitials: getTeacherInitials({
        teacher,
        teacherOverride: null,
      }),
      teacherName: teacher?.name ?? missingValue,
    };
  };

  const renderDraftRow = (draft: SeriesClassDraft) => {
    const {
      classDate,
      classTimeRange,
      establishmentName,
      teacherAvatar,
      teacherInitials,
      teacherName,
    } = getDraftDisplayData(draft);

    return (
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-md px-lg py-md">
        <div className="min-w-0">
          <Body size="md" weight="strong" className="truncate">
            {classDate}
          </Body>
          <Body size="md" color="weak" className="truncate">
            {classTimeRange}
          </Body>
        </div>
        <TeacherCell
          teacherName={teacherName}
          teacherAvatar={teacherAvatar}
          teacherInitials={teacherInitials}
        />
        <Body size="md" className="truncate">
          {establishmentName}
        </Body>
        {renderDraftActions(draft)}
      </div>
    );
  };

  const renderDraftMobileCard = (draft: SeriesClassDraft) => {
    const {
      classDate,
      classTimeRange,
      establishmentName,
      teacherAvatar,
      teacherInitials,
      teacherName,
    } = getDraftDisplayData(draft);

    return (
      <Card key={draft.id} actionable={false} className="flex flex-col gap-md">
        <div className="flex items-start justify-between gap-md">
          <div className="min-w-0">
            <Body size="md" weight="strong" className="truncate">
              {classDate}
            </Body>
            <Body size="md" color="weak" className="truncate">
              {classTimeRange}
            </Body>
          </div>
          {renderDraftActions(draft)}
        </div>
        <Divider orientation="horizontal" weight="thin" />
        <div className="flex flex-col gap-sm">
          <div className="flex min-w-0 flex-col gap-2xs">
            <Body size="sm" color="weak">
              {t("seriesAddModal.steps.addClasses.list.headers.teacher")}
            </Body>
            <TeacherCell
              teacherName={teacherName}
              teacherAvatar={teacherAvatar}
              teacherInitials={teacherInitials}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-2xs">
            <Body size="sm" color="weak">
              {t("seriesAddModal.steps.addClasses.list.headers.establishment")}
            </Body>
            <Body size="md" className="break-words">
              {establishmentName}
            </Body>
          </div>
        </div>
      </Card>
    );
  };

  if (drafts.length === 0) return null;

  if (isMobile) {
    return (
      <div className="flex flex-col gap-sm">
        {sortedDrafts.map((draft) => renderDraftMobileCard(draft))}
      </div>
    );
  }

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
      {sortedDrafts.map((draft, draftIndex) => (
        <div key={draft.id}>
          {draftIndex > 0 ? (
            <Divider orientation="horizontal" weight="thin" />
          ) : null}
          {renderDraftRow(draft)}
        </div>
      ))}
    </Card>
  );
};
