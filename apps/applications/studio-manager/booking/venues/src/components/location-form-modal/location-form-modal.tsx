import { type FC, useId, useMemo } from "react";

import { type EstablishmentGroup } from "@bsport/api-book";
import { ControlledForm, FormField, useFormController } from "@bsport/form";
import {
  Autocomplete,
  type AutocompleteProps,
  Modal,
  TextField,
  type TextFieldProps,
  toast,
} from "@bsport/kaizen-primitive-core";

import { useCreateLocation } from "#src/hooks/api/use-create-location";
import { useEstablishmentGroupsQuery } from "#src/hooks/api/use-establishment-groups-query";
import { useUpdateLocation } from "#src/hooks/api/use-update-location";
import { useVenuesListQuery } from "#src/hooks/api/use-venues-list-query";
import { useTranslation } from "#src/utils/i18n";

import {
  type LocationFormData,
  useLocationFormSchema,
} from "./location-form-schema";

type LocationFormModalProps = {
  onClose: () => void;
  location?: EstablishmentGroup;
  preselectedVenueId?: number;
};

export const LocationFormModal: FC<LocationFormModalProps> = ({
  onClose,
  location,
  preselectedVenueId,
}) => {
  const formId = `location-form-${useId()}`;
  const { t } = useTranslation("location-form");

  const isEditing = !!location;

  const { data: venuesData } = useVenuesListQuery();
  const { data: groupsData } = useEstablishmentGroupsQuery();

  const assignedVenueIds = useMemo(() => {
    const ownEstablishments = new Set(location?.establishment ?? []);
    const ids = new Set<number>();
    for (const group of groupsData?.results ?? []) {
      for (const venueId of group.establishment) {
        if (!ownEstablishments.has(venueId)) ids.add(venueId);
      }
    }
    return ids;
  }, [groupsData, location]);

  const autocompleteItems = useMemo(
    () =>
      (venuesData?.results ?? [])
        .filter((venue) => !venue.disabled)
        .map((venue) => ({
          id: String(venue.id),
          label: venue.title,
          disabled: assignedVenueIds.has(venue.id),
        })),
    [venuesData, assignedVenueIds],
  );

  const { mutate: createLocation, isPending: isCreating } = useCreateLocation();
  const { mutate: updateLocation, isPending: isUpdating } = useUpdateLocation();
  const isLoading = isCreating || isUpdating;

  const locationFormSchema = useLocationFormSchema();

  const defaultValues: LocationFormData = isEditing
    ? { name: location.name, establishment: location.establishment }
    : {
        name: "",
        establishment: preselectedVenueId ? [preselectedVenueId] : [],
      };

  const methods = useFormController({
    mode: "onChange",
    schema: locationFormSchema,
    defaultValues,
  });

  const { isDirty, isSubmitting, isValid } = methods.formState;

  const closeModal = () => {
    methods.reset(defaultValues);
    onClose();
  };

  const handleClickOutside = () => {
    if (isDirty || isSubmitting) return;
    closeModal();
  };

  const handleSubmit = (data: LocationFormData) => {
    if (isEditing) {
      updateLocation(
        {
          id: location.id,
          payload: { name: data.name, establishment: data.establishment },
        },
        {
          onSuccess: () => {
            toast({
              status: "default",
              icon: "check",
              buttonIcon: "x-close",
              description: t("toasts.updateSuccess"),
            });
            closeModal();
          },
        },
      );
    } else {
      createLocation(
        {
          name: data.name,
          establishment: data.establishment,
        },
        { onSuccess: closeModal },
      );
    }
  };

  const venuesTextfieldProps: TextFieldProps = {
    id: `${formId}-venues`,
    label: t("fields.venues.label"),
    placeholder: t("fields.venues.placeholder"),
  };

  return (
    <Modal
      open
      size="md"
      title={isEditing ? t("edit.title") : t("create.title")}
      description={t("description")}
      onClose={closeModal}
      onClickOutside={handleClickOutside}
      confirmButton={{
        color: "main",
        label: isEditing ? t("edit.submit") : t("create.submit"),
        type: "submit",
        form: formId,
        iconLeft: isLoading ? "loading" : undefined,
        disabled: !isValid || !isDirty || isSubmitting || isLoading,
      }}
      cancelButton={{ label: t("cancel"), onClick: closeModal }}
    >
      <ControlledForm id={formId} onSubmit={handleSubmit} {...methods}>
        <div className="flex flex-col gap-md w-full">
          <FormField<LocationFormData, "name", TextFieldProps>
            name="name"
            mapProps={({ defaultProps, field }) => ({
              ...defaultProps,
              onClear: () => field.onChange(""),
            })}
          >
            <TextField
              id={`${formId}-name`}
              label={t("fields.name.label")}
              placeholder={t("fields.name.placeholder")}
              required
              fullWidth
            />
          </FormField>

          <FormField<LocationFormData, "establishment", AutocompleteProps>
            name="establishment"
            mapProps={({ form, field, fieldState, formState }) => ({
              defaultSelectedIds: (formState.isDirty
                ? field.value
                : defaultValues.establishment
              ).map(String),
              onSelect: (selectedIds: string[]) => {
                form.setValue("establishment", selectedIds.map(Number), {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              },
              textfieldProps: {
                ...venuesTextfieldProps,
                status: fieldState.error ? "error" : "default",
                statusText: fieldState.error?.message,
              },
            })}
          >
            <Autocomplete
              key={formId}
              multiSelect
              items={autocompleteItems}
              fullWidth
              textfieldProps={venuesTextfieldProps}
              menuProps={{
                className: "max-h-component-select overflow-y-auto",
              }}
            />
          </FormField>
        </div>
      </ControlledForm>
    </Modal>
  );
};
