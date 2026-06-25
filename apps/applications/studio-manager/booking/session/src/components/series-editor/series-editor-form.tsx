import { type FC, useEffect, useId, useMemo } from "react";

import type { MetaActivity, Session } from "@bsport/api-book";
import { ControlledForm, useFormController } from "@bsport/form";
import { DetailsLayout, useDetailsLayout } from "@bsport/kaizen-primitive-core";

import {
  SeriesEditorBasicsSection,
  SeriesEditorPanelContent,
} from "#src/components/series-editor/series-editor-fields";
import { useUpdateSeriesMutation } from "#src/hooks/series/use-update-series-mutation";
import type { SeriesDetailsHeaderConfig } from "#src/hooks/use-series-details-header-config";
import type { Series } from "#src/types";
import { useTranslation } from "#src/utils/i18n";
import { useAnyObjectLevelPermissions } from "#src/utils/permission";
import {
  buildSeriesDetailsFormSchema,
  buildSeriesDetailsPayload,
  getSeriesDetailsInitialValues,
} from "#src/utils/series-details-form";

type SeriesEditorFormProps = {
  activity?: MetaActivity;
  classes: Session[];
  headerConfig: SeriesDetailsHeaderConfig;
  series: Series;
};

export const SeriesEditorForm: FC<SeriesEditorFormProps> = ({
  activity,
  classes,
  headerConfig,
  series,
}) => {
  const { t } = useTranslation("series");
  const formId = `series-editor-${useId()}`;

  const { detailsLayoutProps, toggleHasUnsavedChanges } = useDetailsLayout();

  const { mutateAsync: updateSeries, isPending } = useUpdateSeriesMutation();

  const canEdit = useAnyObjectLevelPermissions([
    "session.workshop.allowed_actions.edit",
  ]);

  const defaultValues = useMemo(
    () => getSeriesDetailsInitialValues({ classes, series }),
    [classes, series],
  );
  const seriesEditorFormSchema = useMemo(
    () =>
      buildSeriesDetailsFormSchema({
        nameRequired: t("errors.nameRequired"),
        tagsMutuallyExclusive: t("errors.tagsMutuallyExclusive"),
      }),
    [t],
  );

  const methods = useFormController({
    schema: seriesEditorFormSchema,
    mode: "onSubmit",
    defaultValues,
  });

  const isDirty = methods.formState.isDirty;

  useEffect(() => {
    if (isDirty) {
      return;
    }
    methods.reset(defaultValues);
  }, [defaultValues, isDirty, methods]);

  useEffect(() => {
    toggleHasUnsavedChanges(canEdit && isDirty);
  }, [canEdit, isDirty, toggleHasUnsavedChanges]);

  const resetForm = () => {
    methods.reset(defaultValues);
  };

  const handleSubmit = async (values: typeof defaultValues) => {
    if (!canEdit) {
      return;
    }

    await updateSeries({
      payload: buildSeriesDetailsPayload(values),
      seriesId: series.id,
    });

    methods.reset(values);
  };

  return (
    <ControlledForm {...methods} onSubmit={handleSubmit} id={formId}>
      <DetailsLayout {...detailsLayoutProps} withPanel>
        <DetailsLayout.Header {...headerConfig} />
        <DetailsLayout.Content>
          <div className="flex max-w-component-content-centered flex-col gap-xl">
            <SeriesEditorBasicsSection
              canEdit={canEdit}
              fieldIdPrefix={formId}
            />
          </div>
        </DetailsLayout.Content>
        <DetailsLayout.Panel>
          <SeriesEditorPanelContent
            activity={activity}
            canEdit={canEdit}
            fieldIdPrefix={formId}
          />
        </DetailsLayout.Panel>
        {canEdit ? (
          <DetailsLayout.Confirmation
            onDiscard={resetForm}
            formSubmit={{ formId, isSubmitting: isPending }}
          />
        ) : null}
      </DetailsLayout>
    </ControlledForm>
  );
};
