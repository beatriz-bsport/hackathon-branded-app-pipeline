import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type EstablishmentGroup,
  type UpdateEstablishmentPayload,
  establishmentGroupKeys,
  establishmentKeys,
  updateEstablishment,
  updateEstablishmentGroup,
} from "@bsport/api-book";
import { toast } from "@bsport/kaizen-primitive-core";

import { fetch, xhr } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

type UpdateVenueArgs = {
  id: number;
  payload: UpdateEstablishmentPayload;
  // Multi-localization only: the group the venue belonged to and the one it
  // should belong to after the edit. Either may be undefined (no/cleared group).
  previousGroup?: EstablishmentGroup;
  nextGroup?: EstablishmentGroup;
};

const reassignGroup = async (
  venueId: number,
  previousGroup?: EstablishmentGroup,
  nextGroup?: EstablishmentGroup,
) => {
  // Group membership lives on the group's establishment[] array, not on the
  // venue, so moving a venue means rewriting both groups.
  if (previousGroup?.id === nextGroup?.id) return;

  // Drop the venue from its old group.
  if (previousGroup) {
    await updateEstablishmentGroup(fetch, previousGroup.id, {
      name: previousGroup.name,
      establishment: previousGroup.establishment.filter((id) => id !== venueId),
    });
  }
  // Add the venue to the newly selected group.
  if (nextGroup) {
    await updateEstablishmentGroup(fetch, nextGroup.id, {
      name: nextGroup.name,
      establishment: [...nextGroup.establishment, venueId],
    });
  }
};

export const useUpdateVenue = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("venues-list");

  return useMutation({
    mutationFn: async ({
      id,
      payload,
      previousGroup,
      nextGroup,
    }: UpdateVenueArgs) => {
      const venue = await updateEstablishment(xhr, id, payload);
      await reassignGroup(id, previousGroup, nextGroup);
      return venue;
    },
    onSuccess: (_venue, { previousGroup, nextGroup }) => {
      queryClient.invalidateQueries({ queryKey: establishmentKeys.lists() });
      // Group lists only changed if the venue moved between groups.
      if (previousGroup?.id !== nextGroup?.id) {
        queryClient.invalidateQueries({
          queryKey: establishmentGroupKeys.lists(),
        });
      }
      toast({
        status: "default",
        icon: "check-circle",
        description: t("toasts.update"),
        buttonIcon: "x-close",
      });
    },
    onError: () => {
      toast({ status: "critical", description: t("toasts.updateError") });
    },
  });
};
