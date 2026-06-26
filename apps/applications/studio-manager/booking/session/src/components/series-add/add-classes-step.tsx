import type { FC } from "react";

import type { MetaActivity } from "@bsport/api-book";
import { type UseFormControllerOutput, useWatch } from "@bsport/form";
import { Body, Button, Chip } from "@bsport/kaizen-primitive-core";

import { SeriesAddSummaryCard } from "#src/components/series-add/series-add-summary-card";
import { SeriesClassDraftForm } from "#src/components/series-add/series-class-draft-form";
import { SeriesClassDraftList } from "#src/components/series-add/series-class-draft-list";
import type {
  SeriesClassDraft,
  SeriesClassDraftFormData,
  SeriesClassDraftFormSchema,
} from "#src/types";
import { useTranslation } from "#src/utils/i18n";
import { getSeriesClassDraftsCount } from "#src/utils/series-class-draft";
import type { SeriesDetailsFormSchema } from "#src/utils/series-details-form";

type AddClassesStepProps = {
  classDraftMethods: UseFormControllerOutput<SeriesClassDraftFormSchema>;
  classDrafts: SeriesClassDraft[];
  editingClassDraftId: string | null;
  isClassDraftFormOpen: boolean;
  onCancelClassDraftForm: () => void;
  onDeleteClassDraft: (draftId: string) => void;
  onEditClassDraft: (draftId: string) => void;
  onOpenNewClassDraftForm: () => void;
  onSaveClassDraft: (formData: SeriesClassDraftFormData) => void;
  selectedService: MetaActivity | null;
  seriesDetailsMethods: UseFormControllerOutput<SeriesDetailsFormSchema>;
};

export const AddClassesStep: FC<AddClassesStepProps> = ({
  classDraftMethods,
  classDrafts,
  editingClassDraftId,
  isClassDraftFormOpen,
  onCancelClassDraftForm,
  onDeleteClassDraft,
  onEditClassDraft,
  onOpenNewClassDraftForm,
  onSaveClassDraft,
  selectedService,
  seriesDetailsMethods,
}) => {
  const { t } = useTranslation("series");

  const seriesName = useWatch({
    control: seriesDetailsMethods.control,
    name: "name",
  });
  const bookingRule = useWatch({
    control: seriesDetailsMethods.control,
    name: "bookingRule",
  });
  const managerOnly = useWatch({
    control: seriesDetailsMethods.control,
    name: "manager_only",
  });
  const levelId = useWatch({
    control: seriesDetailsMethods.control,
    name: "level",
  });
  const allowedTagIds = useWatch({
    control: seriesDetailsMethods.control,
    name: "whitelist_tags",
  });
  const notAllowedTagIds = useWatch({
    control: seriesDetailsMethods.control,
    name: "blacklist_tags",
  });
  const classDraftOccurrencesCount = getSeriesClassDraftsCount(classDrafts);

  return (
    <div className="flex w-full flex-col gap-xl">
      <SeriesAddSummaryCard
        bookingRule={bookingRule}
        managerOnly={managerOnly}
        levelId={levelId}
        allowedTagIds={allowedTagIds}
        notAllowedTagIds={notAllowedTagIds}
        seriesName={seriesName}
        serviceName={selectedService?.name}
      />
      <div className="flex w-full flex-col gap-md">
        <div className="flex items-center gap-md">
          <Body size="lg">
            {t("seriesAddModal.steps.addClasses.description")}
          </Body>
          {classDraftOccurrencesCount > 0 ? (
            <Chip
              color="default"
              label={t("seriesAddModal.steps.addClasses.classCount", {
                count: classDraftOccurrencesCount,
              })}
              className="shrink-0"
              size="lg"
              type="weak"
            />
          ) : null}
        </div>
        <SeriesClassDraftList
          drafts={classDrafts}
          onDeleteDraft={onDeleteClassDraft}
          onEditDraft={onEditClassDraft}
        />
        {classDraftOccurrencesCount > 0 && !isClassDraftFormOpen ? (
          <Button
            color="main"
            iconLeft="plus"
            intent="flat"
            label={t("seriesAddModal.steps.addClasses.addClass")}
            onClick={onOpenNewClassDraftForm}
            size="md"
            type="button"
            className="self-start"
          />
        ) : null}
        {isClassDraftFormOpen ? (
          <SeriesClassDraftForm
            mode={editingClassDraftId ? "edit" : "create"}
            methods={classDraftMethods}
            onCancel={onCancelClassDraftForm}
            onSubmit={onSaveClassDraft}
          />
        ) : null}
      </div>
    </div>
  );
};
