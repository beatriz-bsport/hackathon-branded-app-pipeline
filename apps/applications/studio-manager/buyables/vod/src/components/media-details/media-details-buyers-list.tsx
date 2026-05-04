import type { FC } from "react";

import {
  Avatar,
  type AvatarProps,
  Body,
  Card,
  Divider,
  List,
} from "@bsport/kaizen-primitive-core";

import { CardLoader } from "#src/components/query-boundary/fallbacks";
import { useMembersByIdQuery } from "#src/hooks/api/use-members-by-id-query";
import { useVideoPurchasesQuery } from "#src/hooks/api/use-video-purchases-query";
import { getNameInitials } from "#src/utils/get-name-initials";
import { useTranslation } from "#src/utils/i18n";

type BuyerItem = {
  id: string;
  title: string;
  description: string;
  avatar: AvatarProps;
};

const BuyerListItem: FC<BuyerItem> = ({ title, description, avatar }) => (
  <div className="flex items-center gap-md px-md py-xs border-b border-b-stroke-divider min-h-2xl">
    <Avatar {...avatar} className="shrink-0" />
    <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
      <span className="text-body-lg leading-md truncate">{title}</span>
      <span className="text-body-md leading-sm text-onsurface-weak truncate">
        {description}
      </span>
    </div>
  </div>
);

type MediaDetailsBuyersListProps = {
  videoId: number;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(value));

export const MediaDetailsBuyersList: FC<MediaDetailsBuyersListProps> = ({
  videoId,
}) => {
  const { t } = useTranslation("media-details");

  const { purchases, totalItems, paginationProps, isLoading } =
    useVideoPurchasesQuery(videoId);

  const memberIds = purchases.map((purchase) => purchase.member_id);
  const { data: membersById } = useMembersByIdQuery(memberIds);

  const items: BuyerItem[] = purchases.map((purchase) => {
    const member = membersById?.get(purchase.member_id);
    return {
      id: `purchase-${purchase.id}`,
      title: member?.name ?? "—",
      description: t("panel.purchasedAt", {
        date: formatDate(purchase.date_created),
      }),
      avatar: {
        shape: "round",
        size: "md",
        src: member?.photo,
        initials: member?.name ? getNameInitials(member.name) : undefined,
      },
    };
  });

  const isEmpty = !isLoading && totalItems === 0;

  return (
    <section className="flex flex-col gap-md">
      <Body size="lg" weight="strong">
        {t("panel.buyersTitle")}
      </Body>

      {isLoading ? (
        <CardLoader />
      ) : isEmpty ? (
        <Card className="flex items-center justify-center px-md py-lg">
          <Body size="md" color="default">
            {t("panel.buyersEmpty")}
          </Body>
        </Card>
      ) : (
        <Card className="flex flex-col">
          <List
            id="media-details-buyers-list"
            items={items}
            ListItem={BuyerListItem}
            paginationProps={paginationProps}
          />
          <Divider className="my-sm" weight="extra-thin" />
          <div className="flex justify-center py-xs">
            <Body size="sm" color="weak">
              {t("panel.buyersCount", { count: totalItems })}
            </Body>
          </div>
        </Card>
      )}
    </section>
  );
};
