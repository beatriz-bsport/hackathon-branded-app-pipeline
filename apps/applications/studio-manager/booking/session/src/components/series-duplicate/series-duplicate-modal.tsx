import { type FC, useEffect, useId, useMemo, useState } from "react";

import type { MetaActivity, Session } from "@bsport/api-book";
import {
  DATETIME_FORMATS,
  formatDateTimeFromDate,
} from "@bsport/datetime-formatting";
import { getLocalNow } from "@bsport/datetime-manipulation";
import {
  ControlledForm,
  FormField,
  useFormContext,
  useFormController,
  useWatch,
} from "@bsport/form";
import {
  Alert,
  Body,
  Card,
  DatePicker,
  type DatePickerProps,
  Loader,
  Modal,
  TextField,
  type TextFieldProps,
  Title,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { SectionErrorFallback } from "#src/components/query-boundary/fallbacks";
import { useLevelName } from "#src/hooks/level/useLevelName";
import { useDuplicateSeriesMutation } from "#src/hooks/series/use-duplicate-series-mutation";
import { useSeriesDuplicateData } from "#src/hooks/series/use-series-duplicate-data";
import type { Series } from "#src/types";
import { useTranslation } from "#src/utils/i18n";
import { getSeriesBookingRule } from "#src/utils/series-booking-rule";
import { sortSeriesClassesByDateStart } from "#src/utils/series-class-dates";
import {
  getSeriesDuplicateDayDelta,
  getShiftedSeriesDuplicateClassDate,
} from "#src/utils/series-duplicate-dates";
import {
  type SeriesDuplicateFormData,
  buildSeriesDuplicateFormSchema,
} from "#src/utils/series-duplicate-form";

type SeriesDuplicateModalProps = {
  onClose: () => void;
  seriesId: number;
};

type SeriesDuplicateModalContentProps = {
  activity?: MetaActivity;
  classes: Session[];
  companyTimeZone: string;
  formId: string;
  levelName: string;
  locale: string;
  onClose: () => void;
  onFormDirtyChange: (isDirty: boolean) => void;
  onPendingChange: (isPending: boolean) => void;
  onSubmittableChange: (isSubmittable: boolean) => void;
  series: Series;
};

type SeriesDuplicateRecapCardProps = {
  activity?: MetaActivity;
  bookingRuleLabel: string;
  levelName: string;
  series: Series;
};

type SeriesDuplicateClassDateBounds = {
  classCount: number;
  firstClassDateStart?: string;
  lastClassDateStart?: string;
};

const getSeriesDuplicateClassDateBounds = (
  classes: Session[],
): SeriesDuplicateClassDateBounds => {
  const sortedClasses = sortSeriesClassesByDateStart(classes);

  return {
    classCount: sortedClasses.length,
    firstClassDateStart: sortedClasses.at(0)?.date_start,
    lastClassDateStart: sortedClasses.at(-1)?.date_start,
  };
};

const SeriesDuplicateRecapCard: FC<SeriesDuplicateRecapCardProps> = ({
  activity,
  bookingRuleLabel,
  levelName,
  series,
}) => {
  const { t } = useTranslation("series");

  return (
    <Card
      className="flex shrink-0 flex-col gap-sm border-none bg-surface-default-weaker"
      actionable={false}
    >
      <Title htmlVariant="h5" weight="stronger">
        {series.name}
      </Title>
      <div className="grid gap-x-2xl gap-y-xs md:grid-cols-2">
        <div className="flex flex-col gap-2xs">
          <Body size="sm" color="weak">
            {t("seriesDuplicateModal.recap.service")}
          </Body>
          <Body size="md">
            {activity?.name ?? t("seriesDuplicateModal.fallbacks.notSet")}
          </Body>
        </div>
        <div className="flex flex-col gap-2xs">
          <Body size="sm" color="weak">
            {t("seriesDuplicateModal.recap.level")}
          </Body>
          <Body size="md">
            {levelName || t("seriesDuplicateModal.fallbacks.notSet")}
          </Body>
        </div>
        <div className="flex flex-col gap-2xs">
          <Body size="sm" color="weak">
            {t("seriesDuplicateModal.recap.bookingRule")}
          </Body>
          <Body size="md">{bookingRuleLabel}</Body>
        </div>
      </div>
    </Card>
  );
};

const SeriesDuplicateStartDateField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("series");
  const companyTimeZone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? getCompanyTimezone();

  return (
    <FormField<SeriesDuplicateFormData, "startDate", DatePickerProps>
      name="startDate"
      mapProps={({ defaultProps, fieldState, form }) => ({
        dateValue: defaultProps.value,
        onSelect: (selectedDate) => {
          if (!selectedDate || Array.isArray(selectedDate)) {
            return;
          }

          form.setValue("startDate", selectedDate.setZone(companyTimeZone), {
            shouldDirty: true,
            shouldValidate: true,
          });
        },
        status: fieldState.error ? "error" : "default",
        statusText: fieldState.error?.message,
      })}
    >
      <DatePicker
        id={`${fieldIdPrefix}-start-date`}
        label={t("seriesDuplicateModal.form.startDate.label")}
        displayAs="popover"
        isInputField
        required
        mode="single"
      />
    </FormField>
  );
};

type SeriesDuplicatePreviewAlertProps = {
  classDateBounds: SeriesDuplicateClassDateBounds;
  companyTimeZone: string;
  locale: string;
};

const SeriesDuplicatePreviewAlert = ({
  classDateBounds,
  companyTimeZone,
  locale,
}: SeriesDuplicatePreviewAlertProps) => {
  const { t } = useTranslation("series");
  const { control } = useFormContext<SeriesDuplicateFormData>();
  const startDate = useWatch({
    control,
    name: "startDate",
  });

  const previewEndDate = useMemo(() => {
    if (
      !classDateBounds.firstClassDateStart ||
      !classDateBounds.lastClassDateStart
    ) {
      return null;
    }

    const dayDelta = getSeriesDuplicateDayDelta({
      originalFirstClassDateStart: classDateBounds.firstClassDateStart,
      startDate,
      timeZone: companyTimeZone,
    });

    return getShiftedSeriesDuplicateClassDate({
      dateStart: classDateBounds.lastClassDateStart,
      dayDelta,
      timeZone: companyTimeZone,
    });
  }, [
    classDateBounds.firstClassDateStart,
    classDateBounds.lastClassDateStart,
    companyTimeZone,
    startDate,
  ]);

  const formattedEndDate = previewEndDate
    ? formatDateTimeFromDate(previewEndDate, DATETIME_FORMATS.MEDIUM_DATE, {
        locale,
        timeZone: companyTimeZone,
      })
    : t("seriesDuplicateModal.fallbacks.notSet");

  return (
    <Alert
      status="info"
      type="weak"
      title={t("seriesDuplicateModal.classCount", {
        count: classDateBounds.classCount,
      })}
    >
      {t("seriesDuplicateModal.projectedEndDate", {
        date: formattedEndDate,
      })}
    </Alert>
  );
};

const SeriesDuplicateModalContent: FC<SeriesDuplicateModalContentProps> = ({
  activity,
  classes,
  companyTimeZone,
  formId,
  levelName,
  locale,
  onClose,
  onFormDirtyChange,
  onPendingChange,
  onSubmittableChange,
  series,
}) => {
  const { t } = useTranslation("series");

  const bookingRule = getSeriesBookingRule(series);
  const schema = useMemo(
    () =>
      buildSeriesDuplicateFormSchema({
        nameRequired: t("seriesDuplicateModal.errors.nameRequired"),
        startDateRequired: t("seriesDuplicateModal.errors.startDateRequired"),
      }),
    [t],
  );

  const defaultValues = useMemo(
    () => ({
      name: t("seriesDuplicateModal.form.name.defaultValue", {
        seriesName: series.name,
      }),
      startDate: getLocalNow({
        zone: companyTimeZone,
        locale,
      }).startOf("day"),
    }),
    [companyTimeZone, locale, series.name, t],
  );
  const methods = useFormController({
    schema,
    mode: "onChange",
    shouldFocusError: true,
    defaultValues,
  });
  const isDirty = methods.formState.isDirty;
  const { trigger } = methods;

  // Default values are already injected by useFormController, but React Hook
  // Form does not always compute isValid until validation runs. Trigger once so
  // the modal confirm button reflects the prefilled valid form immediately.
  useEffect(() => {
    void trigger();
  }, [trigger]);

  const { mutateAsync: duplicateSeries, isPending } =
    useDuplicateSeriesMutation();

  useEffect(() => {
    onPendingChange(isPending);
  }, [isPending, onPendingChange]);

  const classDateBounds = useMemo(
    () => getSeriesDuplicateClassDateBounds(classes),
    [classes],
  );

  const canSubmit = methods.formState.isValid && classDateBounds.classCount > 0;

  useEffect(() => {
    onFormDirtyChange(isDirty);
  }, [isDirty, onFormDirtyChange]);

  useEffect(() => {
    onSubmittableChange(canSubmit);
  }, [canSubmit, onSubmittableChange]);

  const handleSubmit = async (values: SeriesDuplicateFormData) => {
    if (!canSubmit) {
      return;
    }

    await duplicateSeries({
      classes,
      series,
      timeZone: companyTimeZone,
      values,
    });
    onClose();
  };

  return (
    <ControlledForm
      {...methods}
      id={formId}
      onSubmit={handleSubmit}
      className="flex flex-col gap-lg"
    >
      <SeriesDuplicateRecapCard
        activity={activity}
        bookingRuleLabel={t(`seriesTable.bookingRules.${bookingRule}`)}
        levelName={levelName}
        series={series}
      />

      <Body htmlVariant="p" size="lg" color="weak">
        {t("seriesDuplicateModal.description")}
      </Body>

      <FormField<SeriesDuplicateFormData, "name", TextFieldProps>
        name="name"
        mapProps={({ defaultProps, form }) => ({
          ...defaultProps,
          onClear: () => {
            form.setValue("name", "", {
              shouldDirty: true,
              shouldValidate: true,
            });
            form.setFocus("name");
          },
        })}
      >
        <TextField
          id={`${formId}-name`}
          label={t("seriesDuplicateModal.form.name.label")}
          required
          fullWidth
          disabled={isPending}
        />
      </FormField>

      <div className="flex flex-col gap-xs">
        <SeriesDuplicateStartDateField fieldIdPrefix={formId} />
        <Body size="md" color="weak">
          {t("seriesDuplicateModal.form.startDate.helper")}
        </Body>
      </div>

      <SeriesDuplicatePreviewAlert
        classDateBounds={classDateBounds}
        companyTimeZone={companyTimeZone}
        locale={locale}
      />
    </ControlledForm>
  );
};

export const SeriesDuplicateModal: FC<SeriesDuplicateModalProps> = ({
  onClose,
  seriesId,
}) => {
  const { t, i18n } = useTranslation("series");
  const locale = i18n.language;
  const companyTimeZone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? getCompanyTimezone();

  const formId = `series-duplicate-${useId()}`;

  const [isDuplicateFormDirty, setIsDuplicateFormDirty] = useState(false);
  const [isDuplicateFormSubmittable, setIsDuplicateFormSubmittable] =
    useState(false);
  const [isSubmittingDuplicate, setIsSubmittingDuplicate] = useState(false);

  const getLevelName = useLevelName();

  const {
    activity,
    activityQuery,
    allClassesQuery,
    classes,
    level,
    levelsQuery,
    series,
    seriesQuery,
  } = useSeriesDuplicateData(seriesId);

  const hasError =
    seriesQuery.isError ||
    allClassesQuery.isError ||
    activityQuery.isError ||
    levelsQuery.isError;

  const isLoading =
    seriesQuery.isLoading ||
    allClassesQuery.isLoading ||
    activityQuery.isLoading ||
    levelsQuery.isLoading;

  const levelName = getLevelName({
    levelId: series?.level,
    levelName: level?.name,
  });

  const handleRetry = () => {
    void seriesQuery.refetch();
    void allClassesQuery.refetch();
    void activityQuery.refetch();
    void levelsQuery.refetch();
  };

  return (
    <Modal
      open
      size="md"
      title={t("seriesDuplicateModal.title")}
      onClose={onClose}
      disableClose={isSubmittingDuplicate}
      disableClickOutsideClose={isSubmittingDuplicate || isDuplicateFormDirty}
      confirmButton={{
        label: t("seriesDuplicateModal.confirmButton"),
        type: "submit",
        form: formId,
        loading: isSubmittingDuplicate,
        disabled:
          isLoading ||
          hasError ||
          !series ||
          classes.length === 0 ||
          !isDuplicateFormSubmittable ||
          isSubmittingDuplicate,
      }}
      cancelButton={{
        label: t("seriesDuplicateModal.cancelButton"),
        onClick: onClose,
      }}
    >
      {hasError ? (
        <SectionErrorFallback onRetry={handleRetry} />
      ) : isLoading || !series ? (
        <div className="grid place-content-center">
          <Loader size="md" />
        </div>
      ) : (
        <SeriesDuplicateModalContent
          activity={activity}
          classes={classes}
          companyTimeZone={companyTimeZone}
          formId={formId}
          levelName={levelName}
          locale={locale}
          onClose={onClose}
          onFormDirtyChange={setIsDuplicateFormDirty}
          onPendingChange={setIsSubmittingDuplicate}
          onSubmittableChange={setIsDuplicateFormSubmittable}
          series={series}
        />
      )}
    </Modal>
  );
};
