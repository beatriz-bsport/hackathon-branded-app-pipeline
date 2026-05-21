import type { Establishment } from "@bsport/api-book";
import type { ListItemProps } from "@bsport/kaizen-primitive-core";

type BuildArchivedVenueListItemOptions = {
  groupName?: string;
  multiLoc?: boolean;
  unarchiveLabel: string;
  onUnarchive: (venue: Establishment) => void;
};

export const buildArchivedVenueListItem = (
  venue: Establishment,
  {
    groupName,
    multiLoc,
    unarchiveLabel,
    onUnarchive,
  }: BuildArchivedVenueListItemOptions,
): ListItemProps => {
  const { city, address } = venue.location;
  const description = [city, address].filter(Boolean).join(" · ");

  return {
    id: String(venue.id),
    title: venue.title,
    description,
    avatar: venue.cover
      ? { src: venue.cover, shape: "squared", size: "lg" }
      : undefined,
    chips:
      multiLoc && groupName
        ? [{ label: groupName, color: "default", type: "weak", size: "lg" }]
        : undefined,
    buttons: [
      {
        id: `unarchive-${venue.id}`,
        kind: "icon-button",
        label: unarchiveLabel,
        icon: "unarchive",
        intent: "flat",
        size: "md",
        color: "default",
        onClick: () => onUnarchive(venue),
      },
    ],
  };
};
