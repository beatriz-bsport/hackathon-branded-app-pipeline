import type { FC } from "react";
import { useNavigate } from "react-router";

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

import { SMARTLIST_APP_LINKS } from "#src/urls";
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
  const navigate = useNavigate();

  const prebuiltSegments = {
    customers: {
      title: t("prebuilt.segments.customers.title"),
      description: t("prebuilt.segments.customers.description"),
      isAIAssisted: false,
      segmentId: "customers",
    },
    active_members: {
      title: t("prebuilt.segments.active_members.title"),
      description: t("prebuilt.segments.active_members.description"),
      isAIAssisted: false,
      segmentId: "active_members",
    },
    active_trials: {
      title: t("prebuilt.segments.active_trials.title"),
      description: t("prebuilt.segments.active_trials.description"),
      isAIAssisted: false,
      segmentId: "active_trials",
    },
  } satisfies Record<string, PrebuiltSegment>;

  const listItems: ListItemProps[] = Object.entries(prebuiltSegments).map(
    ([id, segment]) => ({
      id,
      title: segment.title,
      description: segment.description,
      onClick: () => {
        navigate(SMARTLIST_APP_LINKS.prebuiltDetailsSegment(segment.segmentId));
      },
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
            size="md"
            intent="default"
            color="main"
            label={t("prebuilt.information.label")}
            onMouseOver={() => setIsPopoverOpened(true)}
            onMouseLeave={() => setIsPopoverOpened(false)}
            onClick={(event) => {
              event.stopPropagation();
              setIsPopoverOpened((prev) => !prev);
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
