import type { Establishment, EstablishmentGroup } from "@bsport/api-book";
import {
  Button,
  DropdownMenu,
  type ListItemProps,
} from "@bsport/kaizen-primitive-core";

type VenueRowLabels = {
  addToGroup: string;
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
  onEditLocation: (location: EstablishmentGroup) => void;
};

export const buildVenueListItem = (
  venue: Establishment,
  {
    group,
    multiLocalization,
    availableLocations,
    labels,
    onArchive,
    onAddVenueToLocation,
    onEditLocation,
  }: BuildVenueListItemOptions,
): ListItemProps => {
  const showGroupChip = multiLocalization && !!group;
  const showAddToGroup =
    Boolean(multiLocalization) && !group && availableLocations.length > 0;

  const buttons: ListItemProps["buttons"] = [];

  // TODO: temp, will be removed once the locations tabs will be live so we can edit locations properly
  if (showGroupChip) {
    buttons.push({
      id: `edit-location-${venue.id}`,
      kind: "icon-button",
      label: labels.editLocation,
      icon: "edit-02",
      intent: "flat",
      size: "md",
      color: "default",
      onClick: () => onEditLocation(group),
    });
  }

  buttons.push(
    {
      id: `edit-${venue.id}`,
      kind: "icon-button",
      label: labels.edit,
      icon: "edit-02",
      intent: "flat",
      size: "md",
      color: "default",
      onClick: () => {},
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
  );

  const locationItems = availableLocations.map((location) => ({
    id: String(location.id),
    label: location.name,
  }));

  return {
    id: String(venue.id),
    title: venue.title,
    avatar: venue.cover
      ? { src: venue.cover, shape: "squared", size: "lg" }
      : undefined,
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
          <Button
            kind="default"
            intent="flat"
            color="default"
            size="md"
            label={labels.addToGroup}
            iconLeft="plus"
            onClick={() => setIsPopoverOpened(!isPopoverOpened)}
          />
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
    buttons,
    dropdownConfig: { visibleActionsDisplayLimit: 0 },
  };
};
