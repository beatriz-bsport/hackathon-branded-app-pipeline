import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo } from "react";

import {
  type Establishment,
  fetchEstablishmentGroupsQueryOptions,
} from "@bsport/api-book";
import { useFormController } from "@bsport/form";
import { type SelectProps } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useCreateVenue } from "#src/hooks/api/use-create-venue";
import { useUpdateVenue } from "#src/hooks/api/use-update-venue";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";
import {
  type VenueFormValues,
  buildVenueFormSchema,
  defaultVenueFormValues,
  findVenueGroup,
  fromEstablishmentToVenueFormValues,
  toCreateEstablishmentPayload,
  toUpdateEstablishmentPayload,
} from "#src/utils/venue-form";

type VenueFormMode = "onChange" | "onSubmit";

type UseVenueFormArgs = {
  // When set the hook submits an update for this venue; otherwise it creates.
  venue?: Establishment | null;
  mode: VenueFormMode;
};

export const useVenueForm = ({ venue, mode }: UseVenueFormArgs) => {
  const { t } = useTranslation("venues-list");

  const multiLocalization =
    !!dataAccessLayer.useCompanyTheme()?.enable_multi_localization;

  const schema = useMemo(
    () => buildVenueFormSchema(multiLocalization, t),
    [multiLocalization, t],
  );

  const { data: groupsData } = useQuery({
    ...fetchEstablishmentGroupsQueryOptions(fetch, {}),
    enabled: multiLocalization,
  });
  const groups = useMemo(() => groupsData?.results ?? [], [groupsData]);

  const methods = useFormController({
    schema,
    mode,
    defaultValues: venue
      ? fromEstablishmentToVenueFormValues(venue, groups)
      : defaultVenueFormValues,
  });

  // Multi-loc edit needs groups loaded to resolve the venue's location group;
  // re-baseline form once groups arrive (and when venue id changes).
  const groupsReady = !multiLocalization || groupsData !== undefined;
  useEffect(() => {
    if (!groupsReady) return;
    methods.reset(
      venue
        ? fromEstablishmentToVenueFormValues(venue, groups)
        : defaultVenueFormValues,
    );
  }, [groups, groupsReady, methods, venue]);

  const groupItems = useMemo<SelectProps["items"]>(
    () => groups.map((group) => ({ id: String(group.id), label: group.name })),
    [groups],
  );

  const { mutateAsync: updateAsync, isPending: isUpdating } = useUpdateVenue();
  const { mutateAsync: createAsync, isPending: isCreating } = useCreateVenue();

  const submit = useCallback(
    async (values: VenueFormValues): Promise<void> => {
      const nextGroup = multiLocalization
        ? groups.find((group) => String(group.id) === values.locationGroupId)
        : undefined;

      if (venue) {
        const updated = await updateAsync({
          id: venue.id,
          payload: toUpdateEstablishmentPayload(values),
          previousGroup: findVenueGroup(groups, venue.id),
          nextGroup,
        });
        methods.reset(fromEstablishmentToVenueFormValues(updated, groups));
        return;
      }

      await createAsync({
        payload: toCreateEstablishmentPayload(values),
        group: nextGroup,
      });
    },
    [createAsync, groups, methods, multiLocalization, updateAsync, venue],
  );

  return {
    methods,
    multiLocalization,
    groupItems,
    isPending: isUpdating || isCreating,
    submit,
  };
};
