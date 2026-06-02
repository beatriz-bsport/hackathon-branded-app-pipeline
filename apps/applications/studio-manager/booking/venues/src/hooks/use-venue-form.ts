import { useCallback, useEffect, useMemo } from "react";

import { type Establishment } from "@bsport/api-book";
import { useFormController } from "@bsport/form";

import { useCreateVenue } from "#src/hooks/api/use-create-venue";
import { useUpdateVenue } from "#src/hooks/api/use-update-venue";
import { useTranslation } from "#src/utils/i18n";
import {
  type VenueFormValues,
  buildVenueFormSchema,
  defaultVenueFormValues,
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

  const schema = useMemo(() => buildVenueFormSchema(t), [t]);

  const methods = useFormController({
    schema,
    mode,
    defaultValues: venue
      ? fromEstablishmentToVenueFormValues(venue)
      : defaultVenueFormValues,
  });

  useEffect(() => {
    methods.reset(
      venue
        ? fromEstablishmentToVenueFormValues(venue)
        : defaultVenueFormValues,
    );
  }, [methods, venue]);

  const { mutateAsync: updateAsync, isPending: isUpdating } = useUpdateVenue();
  const { mutateAsync: createAsync, isPending: isCreating } = useCreateVenue();

  const submit = useCallback(
    async (values: VenueFormValues): Promise<void> => {
      if (venue) {
        const updated = await updateAsync({
          id: venue.id,
          payload: toUpdateEstablishmentPayload(values),
        });
        methods.reset(fromEstablishmentToVenueFormValues(updated));
        return;
      }

      await createAsync({
        payload: toCreateEstablishmentPayload(values),
      });
    },
    [createAsync, methods, updateAsync, venue],
  );

  return {
    methods,
    isPending: isUpdating || isCreating,
    submit,
  };
};
