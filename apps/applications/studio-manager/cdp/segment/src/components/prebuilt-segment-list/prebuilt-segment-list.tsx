import type { FC } from "react";

import {
  Body,
  Button,
  Icon,
  List,
  type ListItemProps,
  ListLayout,
  Popover,
  type TabsProps,
  Title,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type Props = {
  pageTabs?: TabsProps;
};

type PrebuiltSegment = {
  title: string;
  description: string;
  isAIAssisted: boolean;
  segmentId: string;
};

export const PrebuiltSegmentList: FC<Props> = ({ pageTabs }: Props) => {
  const { t } = useTranslation("list");

  const prebuiltSegments = {
    customers: {
      title: t("prebuilt.segments.customers.title"),
      description: t("prebuilt.segments.customers.description"),
      isAIAssisted: false,
      segmentId: "customers",
    },
    activeMembers: {
      title: t("prebuilt.segments.activeMembers.title"),
      description: t("prebuilt.segments.activeMembers.description"),
      isAIAssisted: false,
      segmentId: "custom_members",
    },
    activeTrials: {
      title: t("prebuilt.segments.activeTrials.title"),
      description: t("prebuilt.segments.activeTrials.description"),
      isAIAssisted: false,
      segmentId: "active_trials",
    },
  } satisfies Record<string, PrebuiltSegment>;

  const listItems: ListItemProps[] = Object.entries(prebuiltSegments).map(
    ([id, segment]) => ({
      id,
      title: segment.title,
      description: segment.description,
      chips: segment.isAIAssisted
        ? [
            {
              label: t("prebuilt.aiAssisted"),
              type: "weak",
              color: "default",
              size: "lg",
              iconLeft: "sparkles",
            },
          ]
        : undefined,
      chipsDirection: "end",
    }),
  );

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("title")}
        pageTabs={pageTabs}
        endGroupActions={[<InformationPopover key="prebuilt-info" />]}
      />
      <ListLayout.Content>
        <div className="w-full h-full">
          <List id="prebuilt-segments-list" items={listItems} />
        </div>
      </ListLayout.Content>
    </ListLayout>
  );
};

function InformationPopover() {
  const { t } = useTranslation("list");

  return (
    <Popover>
      <Popover.Anchor>
        {({ setIsPopoverOpened }) => (
          <Button
            kind="icon-button"
            icon="info-circle"
            size="sm"
            intent="flat"
            color="default"
            label={t("prebuilt.information.label")}
            onClick={(event) => {
              event.stopPropagation();
              setIsPopoverOpened(true);
            }}
          />
        )}
      </Popover.Anchor>
      <Popover.Content placement="bottom-right" maxWidthPx={320}>
        {() => (
          <div className="flex flex-col gap-md p-xs">
            <div className="flex gap-xs items-center">
              <span className="flex items-center justify-center shrink-0 h-lg w-lg bg-surface-main-weak text-onsurface-main-strong rounded-sm">
                <Icon icon="info-circle" size="sm" />
              </span>
              <Title htmlVariant="h5" weight="stronger" color="default">
                {t("prebuilt.information.title")}
              </Title>
            </div>
            <Body size="sm" color="default">
              {t("prebuilt.information.description")}
            </Body>
            <Body size="sm" color="default">
              {t("prebuilt.information.update")}
            </Body>
            <Body size="sm" color="default">
              {t("prebuilt.information.custom")}
            </Body>
          </div>
        )}
      </Popover.Content>
    </Popover>
  );
}
