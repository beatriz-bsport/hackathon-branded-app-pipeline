import type { FC, ReactNode } from "react";

import type { Tag } from "@bsport/api-cdp/tags";
import { Body, Card, Chip, Title } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useFetchLevels } from "#src/hooks/level/useFetchLevels";
import { useLevelName } from "#src/hooks/level/useLevelName";
import { useFetchTags } from "#src/hooks/tags/use-fetch-tags";
import { useTranslation } from "#src/utils/i18n";
import type { SeriesDetailsBookingRule } from "#src/utils/series-details-form";

type SeriesAddSummaryCardProps = {
  allowedTagIds?: number[];
  bookingRule: SeriesDetailsBookingRule;
  levelId?: number;
  managerOnly: boolean;
  notAllowedTagIds?: number[];
  seriesName: string;
  serviceName?: string;
};

const getSelectedTags = (
  tagIds: number[] | undefined,
  tagsById: Record<string, Tag | undefined> | undefined,
) =>
  (tagIds ?? []).flatMap((tagId) => {
    const tag = tagsById?.[tagId];
    return tag ? [tag] : [];
  });

const SummaryField: FC<{ label: string; children: ReactNode }> = ({
  label,
  children,
}) => (
  <div className="flex flex-col gap-2xs">
    <Body size="sm" color="weak">
      {label}
    </Body>
    {children}
  </div>
);

const SummaryTagField: FC<{ label: string; tags: Tag[] }> = ({
  label,
  tags,
}) => {
  if (tags.length === 0) return null;

  return (
    <SummaryField label={label}>
      <div className="flex flex-wrap gap-xs">
        {tags.map((tag) => (
          <Chip
            key={tag.id}
            color="main"
            customColor={tag.color}
            label={tag.name}
            rounded="lg"
            size="lg"
            type="weak"
          />
        ))}
      </div>
    </SummaryField>
  );
};

export const SeriesAddSummaryCard: FC<SeriesAddSummaryCardProps> = ({
  allowedTagIds,
  bookingRule,
  levelId,
  managerOnly,
  notAllowedTagIds,
  seriesName,
  serviceName,
}) => {
  const { t } = useTranslation("series");
  const companyId = dataAccessLayer.useCompanyTheme()?.company;
  const getLevelName = useLevelName();
  const { data: levelsById } = useFetchLevels(companyId);
  const { data: tagsById } = useFetchTags<Record<string, Tag | undefined>>();
  const level = levelId ? levelsById?.[levelId] : undefined;
  const levelName = getLevelName({
    levelId,
    levelName: level?.name,
  });
  const allowedTags = getSelectedTags(allowedTagIds, tagsById);
  const notAllowedTags = getSelectedTags(notAllowedTagIds, tagsById);

  return (
    <Card
      className="flex shrink-0 flex-col gap-sm border-none bg-surface-default-weaker"
      actionable={false}
    >
      <Title htmlVariant="h5" weight="stronger">
        {seriesName}
      </Title>
      <div className="grid gap-x-2xl gap-y-xs md:grid-cols-2">
        <SummaryField
          label={t("seriesAddModal.steps.addClasses.summary.service")}
        >
          <Body size="md">{serviceName}</Body>
        </SummaryField>
        <SummaryField
          label={t("seriesAddModal.steps.addClasses.summary.seriesType")}
        >
          <Body size="md">{t(`seriesTable.bookingRules.${bookingRule}`)}</Body>
        </SummaryField>
        <SummaryField
          label={t("seriesAddModal.steps.addClasses.summary.visibility")}
        >
          <Body size="md">
            {managerOnly
              ? t(
                  "seriesAddModal.steps.seriesDetails.bookingVisibility.visibility.options.hidden.label",
                )
              : t(
                  "seriesAddModal.steps.seriesDetails.bookingVisibility.visibility.options.visible.label",
                )}
          </Body>
        </SummaryField>
        <SummaryField label={t("form.basics.level.label")}>
          <Body size="md">{levelName}</Body>
        </SummaryField>
        <SummaryTagField
          label={t("seriesAddModal.steps.addClasses.summary.allowedTags")}
          tags={allowedTags}
        />
        <SummaryTagField
          label={t("seriesAddModal.steps.addClasses.summary.notAllowedTags")}
          tags={notAllowedTags}
        />
      </div>
    </Card>
  );
};
