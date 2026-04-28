import type { FC } from "react";

import {
  Body,
  Card,
  Divider,
  List,
  type ListItemProps,
} from "@bsport/kaizen-primitive-core";

import { CardLoader } from "#src/components/query-boundary/fallbacks";
import { useMembersByIdQuery } from "#src/hooks/api/use-members-by-id-query";
import { useVideoViewsQuery } from "#src/hooks/api/use-video-views-query";
import { getNameInitials } from "#src/utils/get-name-initials";
import { useTranslation } from "#src/utils/i18n";

type MediaDetailsViewersListProps = {
  videoId: number;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const MediaDetailsViewersList: FC<MediaDetailsViewersListProps> = ({
  videoId,
}) => {
  const { t } = useTranslation("media-details");

  const { views, totalItems, paginationProps, isLoading, isError } =
    useVideoViewsQuery(videoId);

  const memberIds = views.map((view) => view.member_id);
  const { data: membersById } = useMembersByIdQuery(memberIds);

  const items: ListItemProps[] = views.map((view) => {
    const member = membersById?.get(view.member_id);
    return {
      id: `view-${view.id}`,
      title: member?.name ?? "—",
      description: t("panel.viewedAt", { date: formatDate(view.date_created) }),
      avatar: {
        shape: "round",
        size: "md",
        src: member?.photo,
        initials: member?.name ? getNameInitials(member.name) : undefined,
      },
    };
  });

  const isEmpty = !isLoading && (isError || totalItems === 0);

  return (
    <section className="flex flex-col gap-md">
      <Body size="lg" weight="strong">
        {t("panel.viewersTitle")}
      </Body>

      {isLoading ? (
        <CardLoader />
      ) : isEmpty ? (
        <Card className="flex items-center justify-center px-md py-lg">
          <Body size="md" color="default">
            {t("panel.viewersEmpty")}
          </Body>
        </Card>
      ) : (
        <Card className="flex flex-col">
          <List
            id="media-details-viewers-list"
            items={items}
            paginationProps={paginationProps}
          />
          <Divider className="my-sm" weight="extra-thin" />
          <div className="flex justify-center py-xs">
            <Body size="sm" color="weak">
              {t("panel.viewersCount", { count: totalItems })}
            </Body>
          </div>
        </Card>
      )}
    </section>
  );
};
