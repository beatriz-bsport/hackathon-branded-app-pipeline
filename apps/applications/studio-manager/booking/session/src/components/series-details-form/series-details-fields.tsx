import { type FC, useMemo } from "react";

import { FormField, useFormContext, useWatch } from "@bsport/form";
import { TagSelector } from "@bsport/kaizen-business-components/cdp/tag-selector";
import {
  Alert,
  Avatar,
  Body,
  Button,
  ColorIndicator,
  Icon,
  type Item,
  Popover,
  RadioGroup,
  type RadioGroupProps,
  Select,
  type SelectProps,
  TextField,
  type TextFieldProps,
  Title,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { VisibilitySelector } from "#src/components/SessionForm/Details/VisibilitySelector";
import { Label } from "#src/components/SessionForm/label";
import { useFetchLevels } from "#src/hooks/level/useFetchLevels";
import { useLevelName } from "#src/hooks/level/useLevelName";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";
import {
  SERIES_DETAILS_BOOKING_RULES,
  type SeriesDetailsBookingRule,
  type SeriesDetailsFormData,
} from "#src/utils/series-details-form";

type SeriesDetailsBaseProps = {
  disabled: boolean;
  fieldIdPrefix: string;
};

type SeriesDetailsService = {
  alt_cover_main?: string;
  cover_main?: string;
  name?: string;
};

const isSeriesDetailsBookingRule = (
  value: string,
): value is SeriesDetailsBookingRule =>
  SERIES_DETAILS_BOOKING_RULES.some((rule) => rule === value);

export const SeriesDetailsNameField: FC<SeriesDetailsBaseProps> = ({
  disabled,
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("series");

  return (
    <FormField<SeriesDetailsFormData, "name", TextFieldProps>
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
        id={`${fieldIdPrefix}-name`}
        label={t("seriesAddModal.steps.seriesDetails.basics.name.label")}
        required
        fullWidth
        className="max-w-component-select"
        disabled={disabled}
      />
    </FormField>
  );
};

export const SeriesDetailsLevelField: FC<SeriesDetailsBaseProps> = ({
  disabled,
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("series");
  const companyId = dataAccessLayer.useCompanyTheme()?.company;

  const getLevelName = useLevelName();
  const { data: levels, isLoading } = useFetchLevels(companyId);

  const levelItems = useMemo<Item[]>(() => {
    const levelList = Object.values(levels ?? {});
    const defaultLevelItems = levelList
      .filter((level) => !level.company)
      .map((level) => ({
        id: String(level.id),
        label: getLevelName({ levelId: level.id, levelName: level.name }),
      }));

    const customLevelItems = levelList
      .filter((level) => !!level.company)
      .map((level) => ({
        id: String(level.id),
        label: level.name,
        leftSlot: level.color ? (
          <ColorIndicator color={level.color} type="block" size="sm" />
        ) : undefined,
      }))
      .sort((firstLevel, secondLevel) =>
        firstLevel.label.localeCompare(secondLevel.label),
      );

    return [
      {
        type: "title",
        label: t("form.basics.level.defaultLevels"),
      },
      ...defaultLevelItems,
      { type: "divider" },
      {
        type: "title",
        label: t("form.basics.level.customLevels"),
      },
      ...customLevelItems,
    ];
  }, [getLevelName, levels, t]);

  return (
    <FormField<SeriesDetailsFormData, "level", SelectProps>
      name="level"
      mapProps={({ defaultProps, form }) => ({
        ...defaultProps,
        onChange: (selectedLevelId) => {
          form.setValue("level", Number(selectedLevelId), {
            shouldDirty: true,
            shouldValidate: true,
          });
        },
        value: String(defaultProps.value),
      })}
    >
      <Select
        id={`${fieldIdPrefix}-level`}
        items={levelItems}
        label={t("form.basics.level.label")}
        required
        fullWidth
        className="max-w-component-select"
        loadingProps={{ isLoading }}
        disabled={disabled}
      />
    </FormField>
  );
};

export const SeriesDetailsBookingRuleField: FC<SeriesDetailsBaseProps> = ({
  disabled,
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("series");
  const { control } = useFormContext<SeriesDetailsFormData>();
  const bookingRule = useWatch({
    control,
    name: "bookingRule",
  });
  const bookingRuleLabels: Record<SeriesDetailsBookingRule, string> = {
    fullSeries: t("form.basics.booking.options.fullSeries"),
    openSeries: t("form.basics.booking.options.openSeries"),
    singleClass: t("form.basics.booking.options.singleClass"),
  };
  const bookingRuleHints: Record<SeriesDetailsBookingRule, string> = {
    fullSeries: t("form.basics.booking.hints.fullSeries"),
    openSeries: t("form.basics.booking.hints.openSeries"),
    singleClass: t("form.basics.booking.hints.singleClass"),
  };

  const selectedBookingRuleLabel = bookingRuleLabels[bookingRule];
  const bookingRuleOptions = SERIES_DETAILS_BOOKING_RULES.map((rule) => ({
    value: rule,
    label: bookingRuleLabels[rule],
    helperText: bookingRuleHints[rule],
  }));

  return (
    <div className="flex flex-col gap-xs">
      <Popover fullWidth>
        <Popover.Anchor>
          {({ setIsPopoverOpened }) => (
            <div className="flex flex-col gap-xs">
              <Label text={t("form.basics.booking.label")} />
              <Button
                id={`${fieldIdPrefix}-booking-rule`}
                label={selectedBookingRuleLabel}
                intent="default"
                color="main"
                size="md"
                iconRight="chevron-down"
                onClick={() => setIsPopoverOpened(true)}
                className="w-full max-w-component-select justify-between"
                disabled={disabled}
              />
            </div>
          )}
        </Popover.Anchor>
        <Popover.Content placement="bottom-left">
          {({ setIsPopoverOpened }) => (
            <FormField<SeriesDetailsFormData, "bookingRule", RadioGroupProps>
              name="bookingRule"
              mapProps={({ defaultProps, form }) => ({
                ...defaultProps,
                onChange: (event) => {
                  const selectedBookingRule = event.target.value;

                  if (!isSeriesDetailsBookingRule(selectedBookingRule)) {
                    return;
                  }

                  form.setValue("bookingRule", selectedBookingRule, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setIsPopoverOpened(false);
                },
                value: defaultProps.value,
              })}
            >
              <RadioGroup
                id={`${fieldIdPrefix}-booking-rule-radio-group`}
                options={bookingRuleOptions}
              />
            </FormField>
          )}
        </Popover.Content>
      </Popover>
      <Alert status="info" type="weak">
        <Body size="md" color="info">
          {bookingRuleHints[bookingRule]}
        </Body>
      </Alert>
    </div>
  );
};

export const SeriesDetailsGuestBookingUnavailableInfo: FC = () => {
  const { t } = useTranslation("series");

  return (
    <div className="flex items-center gap-xs text-onsurface-weak">
      <Icon icon="info-circle" size="sm" />
      <Body size="sm" color="weak">
        {t("form.basics.guestBookingUnavailable")}
      </Body>
    </div>
  );
};

export const SeriesDetailsVisibilitySection: FC<SeriesDetailsBaseProps> = ({
  disabled,
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("series");
  const visibleLabel = t(
    "seriesAddModal.steps.seriesDetails.bookingVisibility.visibility.options.visible.label",
  );
  const hiddenLabel = t(
    "seriesAddModal.steps.seriesDetails.bookingVisibility.visibility.options.hidden.label",
  );

  return (
    <section className="flex flex-col gap-xs">
      <VisibilitySelector
        fieldIdPrefix={fieldIdPrefix}
        fieldName="manager_only"
        title={t(
          "seriesAddModal.steps.seriesDetails.bookingVisibility.visibility.label",
        )}
        labels={{
          visible: {
            label: visibleLabel,
            buttonLabel: visibleLabel,
            helperText: t(
              "seriesAddModal.steps.seriesDetails.bookingVisibility.visibility.options.visible.description",
            ),
          },
          hidden: {
            label: hiddenLabel,
            buttonLabel: hiddenLabel,
            helperText: t(
              "seriesAddModal.steps.seriesDetails.bookingVisibility.visibility.options.hidden.description",
            ),
          },
        }}
        buttonClassName="w-full max-w-component-select"
        disabled={disabled}
      />
    </section>
  );
};

export const SeriesDetailsServiceSection: FC<{
  activity?: SeriesDetailsService;
  fieldIdPrefix: string;
}> = ({ activity, fieldIdPrefix }) => {
  const { t } = useTranslation("series");

  return (
    <section className="flex flex-col gap-md">
      <Title htmlVariant="h5" weight="stronger">
        {t("form.details.title")}
      </Title>
      <Avatar
        shape="squared"
        size="lg"
        src={activity?.cover_main}
        alt={activity?.alt_cover_main}
        iconName="target-04"
        className="cursor-default"
      />
      <TextField
        id={`${fieldIdPrefix}-activity`}
        label={t("form.details.service")}
        value={activity?.name ?? ""}
        disabled
        required
        fullWidth
        className="max-w-component-select"
      />
    </section>
  );
};

export const SeriesDetailsTagsSection: FC<
  SeriesDetailsBaseProps & {
    showHeader?: boolean;
  }
> = ({ disabled, fieldIdPrefix, showHeader = true }) => {
  const { t } = useTranslation("series");
  const placeholder = t("seriesAddModal.steps.seriesDetails.tags.placeholder");

  return (
    <section className="flex flex-col gap-md">
      {showHeader ? (
        <div className="flex flex-col gap-xs">
          <Title htmlVariant="h5" weight="stronger">
            {t("seriesAddModal.steps.seriesDetails.tags.title")}
          </Title>
          <Body color="weak" size="md">
            {t("seriesAddModal.steps.seriesDetails.tags.description")}
          </Body>
        </div>
      ) : null}
      <div className="flex flex-col gap-xs">
        <Body size="md">
          {t("seriesAddModal.steps.seriesDetails.tags.allowed.label")}
        </Body>
        <TagSelector<SeriesDetailsFormData, "whitelist_tags">
          id={`${fieldIdPrefix}-whitelist-tags`}
          fieldName="whitelist_tags"
          fetch={fetch}
          placeholder={placeholder}
          multiSelect
          disabled={disabled}
        />
        <Body size="sm" color="weak">
          {t("seriesAddModal.steps.seriesDetails.tags.allowed.helper")}
        </Body>
      </div>
      <div className="flex flex-col gap-xs">
        <Body size="md">
          {t("seriesAddModal.steps.seriesDetails.tags.notAllowed.label")}
        </Body>
        <TagSelector<SeriesDetailsFormData, "blacklist_tags">
          id={`${fieldIdPrefix}-blacklist-tags`}
          fieldName="blacklist_tags"
          fetch={fetch}
          placeholder={placeholder}
          multiSelect
          disabled={disabled}
        />
        <Body size="sm" color="weak">
          {t("seriesAddModal.steps.seriesDetails.tags.notAllowed.helper")}
        </Body>
      </div>
    </section>
  );
};
