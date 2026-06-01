import { type FC, useMemo } from "react";

import { getRuntimeGoogleMapsApiKey } from "@bsport/fetch";
import { FormField, useWatch } from "@bsport/form";
import { AddressAutocompleteFormSelector } from "@bsport/kaizen-business-components/core/address-autocomplete";
import { FormMediaField } from "@bsport/kaizen-business-components/form/media-field";
import {
  Body,
  Select,
  type SelectProps,
  TextArea,
  type TextAreaProps,
  TextField,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import { type LatLng, MapPin, MapView } from "#src/components/venues-map";
import { useTranslation } from "#src/utils/i18n";
import { type VenueFormValues, fieldIdPrefix } from "#src/utils/venue-form";

type VenueFormFieldsProps = {
  multiLocalization: boolean;
  groupItems: SelectProps["items"];
};

export const VenueFormFields: FC<VenueFormFieldsProps> = ({
  multiLocalization,
  groupItems,
}) => {
  const { t } = useTranslation("venues-list");

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-2xs">
        <Body weight="strong">{t("venueModal.cover.label")}</Body>
        <FormMediaField<VenueFormValues, "cover">
          id={`${fieldIdPrefix}-cover`}
          fieldName="cover"
          inputName="venue-cover"
          fileExtensionList={["image/*"]}
          helperText={t("venueModal.cover.helper")}
        />
      </div>

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

      <LocationMapPreview />

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
          value: defaultProps.value == null ? "" : String(defaultProps.value),
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
  );
};

const LocationMapPreview: FC = () => {
  const location = useWatch<VenueFormValues, "location">({ name: "location" });
  const position = useMemo<LatLng | null>(() => {
    const lat = location?.geometry.x;
    const lng = location?.geometry.y;
    if (lat == null || lng == null) return null;
    if (lat === 0 && lng === 0) return null;
    return [lat, lng];
  }, [location]);
  const bounds = useMemo<LatLng[]>(
    () => (position ? [position] : []),
    [position],
  );

  if (!position) return null;

  return (
    <MapView bounds={bounds} height={200}>
      <MapPin position={position} />
    </MapView>
  );
};
