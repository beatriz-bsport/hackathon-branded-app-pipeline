import type { Establishment } from "@bsport/api-book";
import { Button, type ListItemProps } from "@bsport/kaizen-primitive-core";

import type { TFunction } from "#src/utils/i18n";

type BuildVenueListItemOptions = {
  groupName?: string;
  multiLoc?: boolean;
  addToGroupLabel: string;
  t: TFunction;
};

export const buildVenueListItem = (
  venue: Establishment,
  { groupName, multiLoc, addToGroupLabel, t }: BuildVenueListItemOptions,
): ListItemProps => {
  const showGroupChip = multiLoc && !!groupName;
  const showAddToGroup = multiLoc && !groupName;

  return {
    id: String(venue.id),
    title: venue.title,
    avatar: venue.cover
      ? { src: venue.cover, shape: "squared", size: "lg" }
      : undefined,
    chips: showGroupChip
      ? [
          {
            label: groupName,
            color: "default",
            type: "weak",
            size: "lg",
          },
        ]
      : undefined,
    customNode: showAddToGroup ? (
      <Button
        kind="default"
        intent="flat"
        color="default"
        size="md"
        label={addToGroupLabel}
        iconLeft="plus"
        onClick={() => {}}
      />
    ) : undefined,
    buttons: [
      {
        id: `edit-${venue.id}`,
        kind: "icon-button",
        label: t("venueRow.edit"),
        icon: "edit-02",
        intent: "flat",
        size: "md",
        color: "default",
        onClick: () => {},
      },
      {
        id: `delete-${venue.id}`,
        kind: "icon-button",
        label: t("venueRow.delete"),
        icon: "trash-01",
        intent: "flat",
        size: "md",
        color: "default",
        onClick: () => {},
      },
    ],
    dropdownConfig: { visibleActionsDisplayLimit: 0 },
  };
};
