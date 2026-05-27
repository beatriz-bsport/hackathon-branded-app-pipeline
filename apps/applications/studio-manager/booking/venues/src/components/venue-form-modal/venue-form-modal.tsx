import { useQuery } from "@tanstack/react-query";
import { type FC, useEffect, useMemo } from "react";

import {
  type Establishment,
  fetchEstablishmentGroupsQueryOptions,
} from "@bsport/api-book";
import { getRuntimeGoogleMapsApiKey } from "@bsport/fetch";
import { FormField, FormProvider, useFormController } from "@bsport/form";
import { AddressAutocompleteFormSelector } from "@bsport/kaizen-business-components/core/address-autocomplete";
import { FormMediaField } from "@bsport/kaizen-business-components/form/media-field";
import {
  Modal,
  Select,
  type SelectProps,
  TextArea,
  type TextAreaProps,
  TextField,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import { useCreateVenue } from "#src/hooks/api/use-create-venue";
import { useUpdateVenue } from "#src/hooks/api/use-update-venue";
import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";
import {
  type VenueFormValues,
  buildVenueFormSchema,
  defaultVenueFormValues,
  fieldIdPrefix,
  findVenueGroup,
  fromEstablishmentToVenueFormValues,
  toCreateEstablishmentPayload,
  toUpdateEstablishmentPayload,
} from "#src/utils/venue-form";

type VenueFormModalProps = {
  multiLocalization: boolean;
  // When set the modal edits this venue; otherwise it creates a new one.
  venue?: Establishment | null;
  onClose: () => void;
};

export const VenueFormModal: FC<VenueFormModalProps> = ({
  multiLocalization,
  venue,
  onClose,
}) => {
  const { t } = useTranslation("venues-list");
  const isEdit = !!venue;
  const { mutate: createVenue, isPending: isCreating } = useCreateVenue();
  const { mutate: updateVenue, isPending: isUpdating } = useUpdateVenue();
  const isPending = isCreating || isUpdating;

  const schema = useMemo(
    () => buildVenueFormSchema(multiLocalization, t),
    [multiLocalization, t],
  );
  const methods = useFormController({
    schema,
    defaultValues: defaultVenueFormValues,
    mode: "onChange",
  });
  const { handleSubmit, reset, formState } = methods;

  const { data: groupsData } = useQuery({
    ...fetchEstablishmentGroupsQueryOptions(fetch, {}),
    enabled: multiLocalization,
  });
  const groups = useMemo(() => groupsData?.results ?? [], [groupsData]);

  // Edit under multi-loc needs groups loaded to prefill location; reset once
  // ready. Modal is conditionally mounted per open-session, so no need to
  // guard against re-running after user edits.
  const groupsReady = !multiLocalization || !venue || groupsData !== undefined;
  useEffect(() => {
    if (!groupsReady) return;
    reset(
      venue
        ? fromEstablishmentToVenueFormValues(venue, groups)
        : defaultVenueFormValues,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupsReady]);

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleClickOutside = () => {
    if (formState.isDirty || formState.isSubmitting) return;
    handleClose();
  };

  const groupItems = useMemo(
    () => [
      {
        id: "",
        label: t("venueModal.location.placeholder"),
        disabled: true,
      },
      ...groups.map((group) => ({ id: String(group.id), label: group.name })),
    ],
    [groups, t],
  );

  const onValid = (values: VenueFormValues) => {
    const nextGroup = multiLocalization
      ? groups.find((group) => String(group.id) === values.locationGroupId)
      : undefined;

    if (venue) {
      updateVenue(
        {
          id: venue.id,
          payload: toUpdateEstablishmentPayload(values),
          previousGroup: findVenueGroup(groups, venue.id),
          nextGroup,
        },
        { onSuccess: handleClose },
      );
      return;
    }

    createVenue(
      { payload: toCreateEstablishmentPayload(values), group: nextGroup },
      { onSuccess: handleClose },
    );
  };

  return (
    <Modal
      open
      size="md"
      title={isEdit ? t("venueModal.editTitle") : t("venueModal.createTitle")}
      onClose={handleClose}
      onClickOutside={handleClickOutside}
      confirmButton={{
        color: "main",
        label: isEdit
          ? t("venueModal.editConfirm")
          : t("venueModal.createConfirm"),
        onClick: () => handleSubmit(onValid)(),
        disabled: isPending || !formState.isValid || !formState.isDirty,
      }}
      cancelButton={{ label: t("venueModal.cancel"), onClick: handleClose }}
    >
      <FormProvider {...methods}>
        <div className="flex flex-col gap-md">
          <FormMediaField<VenueFormValues, "cover">
            id={`${fieldIdPrefix}-cover`}
            fieldName="cover"
            inputName="venue-cover"
            fileExtensionList={["image/*"]}
          />

          <FormField<VenueFormValues, "name", TextFieldProps>
            name="name"
            mapProps={({ form, defaultProps }) => ({
              ...defaultProps,
              onClear: () =>
                form.setValue("name", "", {
                  shouldDirty: true,
                  shouldValidate: true,
                }),
            })}
          >
            <TextField
              id={`${fieldIdPrefix}-name`}
              label={t("venueModal.name.label")}
              placeholder={t("venueModal.name.placeholder")}
              required
              fullWidth
            />
          </FormField>

          <FormField<
            VenueFormValues,
            "description",
            TextAreaProps
          > name="description">
            <TextArea
              id={`${fieldIdPrefix}-description`}
              label={t("venueModal.description.label")}
              placeholder={t("venueModal.description.placeholder")}
              required
            />
          </FormField>

          <AddressAutocompleteFormSelector<VenueFormValues, "location">
            fieldName="location"
            apiKey={getRuntimeGoogleMapsApiKey()}
            textfieldProps={{
              label: t("venueModal.address.label"),
              placeholder: t("venueModal.address.placeholder"),
              required: true,
            }}
            fullWidth
          />

          {/* TODO: mount the venue location map here once a Kaizen map component exists. */}

          {multiLocalization && (
            <FormField<VenueFormValues, "locationGroupId", SelectProps>
              name="locationGroupId"
              mapProps={({ form, defaultProps, fieldState }) => ({
                ...defaultProps,
                onChange: (id: string) =>
                  form.setValue("locationGroupId", id, {
                    shouldValidate: true,
                    shouldDirty: true,
                  }),
                status: fieldState.error ? "critical" : "default",
                errorText: fieldState.error?.message,
              })}
            >
              <Select
                id={`${fieldIdPrefix}-location`}
                label={t("venueModal.location.label")}
                size="md"
                required
                items={groupItems}
                fullWidth
              />
            </FormField>
          )}

          <FormField<VenueFormValues, "capacity", TextFieldProps>
            name="capacity"
            mapProps={({ form, defaultProps }) => ({
              ...defaultProps,
              type: "number",
              value:
                defaultProps.value == null ? "" : String(defaultProps.value),
              onChange: (event) =>
                form.setValue("capacity", Number(event.target.value), {
                  shouldDirty: true,
                  shouldValidate: true,
                }),
            })}
          >
            <TextField
              id={`${fieldIdPrefix}-capacity`}
              type="number"
              label={t("venueModal.capacity.label")}
              helperText={t("venueModal.capacity.helper")}
              required
            />
          </FormField>

          <FormField<
            VenueFormValues,
            "accessInformation",
            TextAreaProps
          > name="accessInformation">
            <TextArea
              id={`${fieldIdPrefix}-access-information`}
              label={t("venueModal.accessInformation.label")}
              placeholder={t("venueModal.accessInformation.placeholder")}
              helperText={t("venueModal.accessInformation.helper")}
            />
          </FormField>
        </div>
      </FormProvider>
    </Modal>
  );
};
