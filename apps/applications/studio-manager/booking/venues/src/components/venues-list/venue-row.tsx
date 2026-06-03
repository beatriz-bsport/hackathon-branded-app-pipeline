import type { Establishment, EstablishmentGroup } from "@bsport/api-book";
import {
  Button,
  DropdownMenu,
  type ListItemProps,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

type VenueRowLabels = {
  addToGroup: string;
  addToGroupTooltip: string;
  editLocation: string;
  edit: string;
  archive: string;
};

type BuildVenueListItemOptions = {
  group?: EstablishmentGroup;
  multiLocalization?: boolean;
  availableLocations: EstablishmentGroup[];
  labels: VenueRowLabels;
  onArchive: (venue: Establishment) => void;
  onAddVenueToLocation: (
    venue: Establishment,
    location: EstablishmentGroup,
  ) => void;
  onEdit: (venue: Establishment) => void;
  onRowClick: (venue: Establishment) => void;
};

const getInitials = (title: string): string =>
  title
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

export const buildVenueListItem = (
  venue: Establishment,
  {
    group,
    multiLocalization,
    availableLocations,
    labels,
    onArchive,
    onAddVenueToLocation,
    onEdit,
    onRowClick,
  }: BuildVenueListItemOptions,
): ListItemProps => {
  const showGroupChip = multiLocalization && !!group;
  const showAddToGroup =
    Boolean(multiLocalization) && !group && availableLocations.length > 0;

  const locationItems = availableLocations.map((location) => ({
    id: String(location.id),
    label: location.name,
  }));

  return {
    id: String(venue.id),
    title: venue.title,
    avatar: venue.cover
      ? { src: venue.cover, shape: "squared", size: "lg" }
      : { initials: getInitials(venue.title), shape: "squared", size: "lg" },
    chips: showGroupChip
      ? [
          {
            label: group.name,
            color: "default",
            type: "weak",
            size: "lg",
          },
        ]
      : undefined,
    customNode: showAddToGroup ? (
      <DropdownMenu
        target={({ isPopoverOpened, setIsPopoverOpened }) => (
          <Tooltip label={labels.addToGroupTooltip} placement="top">
            <Button
              kind="default"
              intent="flat"
              color="default"
              size="md"
              label={labels.addToGroup}
              iconLeft="plus"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPopoverOpened(!isPopoverOpened);
              }}
            />
          </Tooltip>
        )}
        items={locationItems}
        onSelectOption={({ id, setIsPopoverOpened }) => {
          const location = availableLocations.find(
            (loc) => String(loc.id) === id,
          );
          if (!location) return;
          onAddVenueToLocation(venue, location);
          setIsPopoverOpened(false);
        }}
      />
    ) : undefined,
    buttons: [
      {
        id: `edit-${venue.id}`,
        kind: "icon-button",
        label: labels.edit,
        icon: "edit-02",
        intent: "flat",
        size: "md",
        color: "default",
        onClick: () => onEdit(venue),
      },
      {
        id: `archive-${venue.id}`,
        kind: "icon-button",
        label: labels.archive,
        icon: "archive",
        intent: "flat",
        size: "md",
        color: "default",
        onClick: () => onArchive(venue),
      },
    ],
    dropdownConfig: { visibleActionsDisplayLimit: 0 },
    onItemClick: () => onRowClick(venue),
  };
};
