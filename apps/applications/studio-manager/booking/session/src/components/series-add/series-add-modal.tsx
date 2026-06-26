import { useCallback, useMemo, useRef, useState } from "react";

import type { MetaActivity } from "@bsport/api-book";
import { useFormController } from "@bsport/form";
import { ModalStepper, toast } from "@bsport/kaizen-primitive-core";

import { AddClassesStep } from "#src/components/series-add/add-classes-step";
import { ChooseServiceStep } from "#src/components/series-add/choose-service-step";
import { buildPrepareAddGroupSessionsCreationPayload } from "#src/components/series-add/series-add-payload";
import {
  getDefaultSeriesClassDraftFormValues,
  useSeriesClassDraftFormSchema,
} from "#src/components/series-add/series-class-draft";
import { SeriesDetailsStep } from "#src/components/series-add/series-details-step";
import { generateRecurrenceDates } from "#src/helpers/recurrence";
import { useCreateSeriesMutation } from "#src/hooks/series/use-create-series-mutation";
import { useRecurrenceConfig } from "#src/hooks/useRecurrenceConfig";
import type { SeriesClassDraft, SeriesClassDraftFormData } from "#src/types";
import { useTranslation } from "#src/utils/i18n";
import {
  buildIndividualSeriesClassDrafts,
  getSeriesClassDraftsCount,
} from "#src/utils/series-class-draft";
import {
  DEFAULT_SERIES_DETAILS_FORM_VALUES,
  buildSeriesDetailsFormSchema,
} from "#src/utils/series-details-form";

type SeriesAddModalProps = {
  onClose: () => void;
};

const SERIES_CREATION_STEPS = {
  CHOOSE_SERVICE: 0,
  SERIES_DETAILS: 1,
  ADD_CLASSES: 2,
};

export const SeriesAddModal = ({ onClose }: SeriesAddModalProps) => {
  const { t } = useTranslation("series");
  const [selectedService, setSelectedService] = useState<MetaActivity | null>(
    null,
  );
  const [classDrafts, setClassDrafts] = useState<SeriesClassDraft[]>([]);
  const [isClassDraftFormOpen, setIsClassDraftFormOpen] = useState(true);
  const [editingClassDraftId, setEditingClassDraftId] = useState<string | null>(
    null,
  );
  const nextClassDraftIdRef = useRef(0);
  // ModalStepper owns the visible step and calls the same confirm handler for
  // both "Next" and the final submit. Track the step locally so the handler knows
  // when to advance and when to create the series.
  const currentStepRef = useRef(SERIES_CREATION_STEPS.CHOOSE_SERVICE);
  const seriesDetailsFormSchema = useMemo(
    () =>
      buildSeriesDetailsFormSchema({
        nameRequired: t("seriesAddModal.errors.nameRequired"),
        tagsMutuallyExclusive: t("seriesAddModal.errors.tagsMutuallyExclusive"),
      }),
    [t],
  );
  const seriesDetailsMethods = useFormController({
    schema: seriesDetailsFormSchema,
    mode: "onChange",
    defaultValues: DEFAULT_SERIES_DETAILS_FORM_VALUES,
  });
  const classDraftFormSchema = useSeriesClassDraftFormSchema();
  const defaultClassDraftValues = useMemo(
    () => getDefaultSeriesClassDraftFormValues(),
    [],
  );
  const classDraftMethods = useFormController({
    schema: classDraftFormSchema,
    mode: "onChange",
    defaultValues: defaultClassDraftValues,
  });

  const { getRecurrenceConfig } = useRecurrenceConfig();
  const classDraftCount = getSeriesClassDraftsCount(classDrafts);
  const { isPending: isCreatingSeries, mutate: createSeries } =
    useCreateSeriesMutation();

  const handleSelectService = useCallback((service: MetaActivity) => {
    setSelectedService(service);
  }, []);

  const createClassDraftId = useCallback(() => {
    nextClassDraftIdRef.current += 1;
    return `series-class-draft-${nextClassDraftIdRef.current}`;
  }, []);

  // Decides which start dates this local draft represents.
  const getClassDraftStartDateTimes = useCallback(
    (formData: SeriesClassDraftFormData) => {
      // Reuse the calendar Add class recurrence stack so both flows expand dates
      // the same way.
      const recurrenceConfig = getRecurrenceConfig(formData);

      if (!recurrenceConfig) {
        return [formData.startDateTime];
      }

      const recurrenceStartDateTimes =
        generateRecurrenceDates(recurrenceConfig);

      if (recurrenceStartDateTimes.length > 0) {
        return recurrenceStartDateTimes;
      }

      return [formData.startDateTime];
    },
    [getRecurrenceConfig],
  );

  const resetClassDraftForm = useCallback(() => {
    classDraftMethods.reset(defaultClassDraftValues, {
      keepErrors: false,
      keepIsValid: false,
      keepTouched: false,
    });
  }, [classDraftMethods, defaultClassDraftValues]);

  const handleOpenNewClassDraftForm = useCallback(() => {
    setEditingClassDraftId(null);
    resetClassDraftForm();
    setIsClassDraftFormOpen(true);
  }, [resetClassDraftForm]);

  const handleCancelClassDraftForm = useCallback(() => {
    setEditingClassDraftId(null);
    resetClassDraftForm();
    setIsClassDraftFormOpen(classDrafts.length === 0);
  }, [classDrafts.length, resetClassDraftForm]);

  const handleSaveClassDraft = useCallback(
    (formData: SeriesClassDraftFormData) => {
      // Recurrence input is flattened into individual class drafts so each
      // preview class can be edited or deleted independently.
      const savedClassDrafts = buildIndividualSeriesClassDrafts({
        createClassDraftId,
        existingClassDraftId: editingClassDraftId ?? undefined,
        classStartDateTimes: getClassDraftStartDateTimes(formData),
        formData,
      });

      if (editingClassDraftId) {
        setClassDrafts((currentDrafts) =>
          currentDrafts.flatMap((draft) =>
            draft.id === editingClassDraftId ? savedClassDrafts : [draft],
          ),
        );
      } else {
        setClassDrafts((currentDrafts) => [
          ...currentDrafts,
          ...savedClassDrafts,
        ]);
      }

      setEditingClassDraftId(null);
      resetClassDraftForm();
      setIsClassDraftFormOpen(false);
    },
    [
      createClassDraftId,
      editingClassDraftId,
      getClassDraftStartDateTimes,
      resetClassDraftForm,
    ],
  );

  const handleEditClassDraft = useCallback(
    (draftId: string) => {
      const draft = classDrafts.find(
        (currentDraft) => currentDraft.id === draftId,
      );
      if (!draft) return;

      setEditingClassDraftId(draftId);
      classDraftMethods.reset(draft.data);
      void classDraftMethods.trigger();
      setIsClassDraftFormOpen(true);
    },
    [classDraftMethods, classDrafts],
  );

  const handleDeleteClassDraft = useCallback(
    (draftId: string) => {
      setClassDrafts((currentDrafts) =>
        currentDrafts.filter((draft) => draft.id !== draftId),
      );

      if (editingClassDraftId === draftId) {
        setEditingClassDraftId(null);
        resetClassDraftForm();
      }

      if (classDrafts.length <= 1) {
        setIsClassDraftFormOpen(true);
      }
    },
    [classDrafts.length, editingClassDraftId, resetClassDraftForm],
  );

  const handleClose = useCallback(() => {
    currentStepRef.current = SERIES_CREATION_STEPS.CHOOSE_SERVICE;
    setSelectedService(null);
    setClassDrafts([]);
    setIsClassDraftFormOpen(true);
    setEditingClassDraftId(null);
    nextClassDraftIdRef.current = 0;
    seriesDetailsMethods.reset(DEFAULT_SERIES_DETAILS_FORM_VALUES);
    resetClassDraftForm();
    onClose();
  }, [onClose, resetClassDraftForm, seriesDetailsMethods]);

  const handleClickOutside = useCallback(() => {
    if (
      isCreatingSeries ||
      selectedService ||
      classDrafts.length > 0 ||
      seriesDetailsMethods.formState.isDirty ||
      classDraftMethods.formState.isDirty
    ) {
      return;
    }

    handleClose();
  }, [
    classDraftMethods.formState.isDirty,
    classDrafts.length,
    handleClose,
    isCreatingSeries,
    selectedService,
    seriesDetailsMethods.formState.isDirty,
  ]);

  const handleCancelButtonClick = useCallback(() => {
    currentStepRef.current = Math.max(
      currentStepRef.current - 1,
      SERIES_CREATION_STEPS.CHOOSE_SERVICE,
    );
  }, []);

  const handleCreateSeries = useCallback(() => {
    if (currentStepRef.current < SERIES_CREATION_STEPS.ADD_CLASSES) {
      currentStepRef.current += 1;
      return;
    }

    // Only submit from a complete, idle Add classes step: creation must not
    // already be running, a service must be selected, at least one class must be
    // saved, and the draft form must be closed.
    if (
      isCreatingSeries ||
      !selectedService ||
      classDraftCount === 0 ||
      isClassDraftFormOpen
    ) {
      return;
    }

    try {
      const preparePayload = buildPrepareAddGroupSessionsCreationPayload({
        classDrafts,
        selectedService,
        seriesDetails: seriesDetailsMethods.getValues(),
      });

      createSeries(
        {
          preparePayload,
        },
        {
          onSuccess: handleClose,
        },
      );
    } catch (error) {
      toast({
        status: "critical",
        description: t("seriesAddModal.errors.create"),
      });
      console.error("Error building series payload:", error);
    }
  }, [
    classDraftCount,
    classDrafts,
    createSeries,
    handleClose,
    isClassDraftFormOpen,
    isCreatingSeries,
    selectedService,
    seriesDetailsMethods,
    t,
  ]);

  return (
    <ModalStepper
      open
      title={t("seriesAddModal.title")}
      size="lg"
      initialStep={SERIES_CREATION_STEPS.CHOOSE_SERVICE}
      steps={[
        {
          label: t("seriesAddModal.steps.chooseService.label"),
          content: (
            <ChooseServiceStep
              selectedService={selectedService}
              onSelectService={handleSelectService}
            />
          ),
          validate: () => !!selectedService,
        },
        {
          label: t("seriesAddModal.steps.seriesDetails.label"),
          content: <SeriesDetailsStep methods={seriesDetailsMethods} />,
          validate: () => seriesDetailsMethods.formState.isValid,
        },
        {
          label: t("seriesAddModal.steps.addClasses.label"),
          content: (
            <AddClassesStep
              classDraftMethods={classDraftMethods}
              classDrafts={classDrafts}
              editingClassDraftId={editingClassDraftId}
              isClassDraftFormOpen={isClassDraftFormOpen}
              onCancelClassDraftForm={handleCancelClassDraftForm}
              onDeleteClassDraft={handleDeleteClassDraft}
              onEditClassDraft={handleEditClassDraft}
              onOpenNewClassDraftForm={handleOpenNewClassDraftForm}
              onSaveClassDraft={handleSaveClassDraft}
              selectedService={selectedService}
              seriesDetailsMethods={seriesDetailsMethods}
            />
          ),
          validate: () => classDraftCount > 0 && !isClassDraftFormOpen,
        },
      ]}
      confirmButton={{
        label: t("seriesAddModal.buttons.addSeries"),
        color: "main",
        disabled: isCreatingSeries,
        loading: isCreatingSeries,
        onClick: handleCreateSeries,
      }}
      cancelButton={{
        label: t("seriesAddModal.buttons.cancel"),
        disabled: isCreatingSeries,
        onClick: handleCancelButtonClick,
      }}
      onClickOutside={handleClickOutside}
      onClose={handleClose}
    />
  );
};
