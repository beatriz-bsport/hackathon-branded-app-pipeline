import { z } from "zod";

import type {
  CreateEstablishmentPayload,
  Establishment,
  EstablishmentGroup,
  EstablishmentLocationInput,
  UpdateEstablishmentPayload,
} from "@bsport/api-book";
import type { AddressSuggestion } from "@bsport/kaizen-business-components/core/address-autocomplete";

import { type NamespacedTFunction } from "#src/utils/i18n";

export const fieldIdPrefix = "create-venue";

export type VenueFormValues = {
  name: string;
  description: string;
  accessInformation: string;
  capacity: number;
  location: AddressSuggestion | null;
  cover: File | string | null;
  locationGroupId: string;
};

export const defaultVenueFormValues: VenueFormValues = {
  name: "",
  description: "",
  accessInformation: "",
  capacity: 30,
  location: null,
  cover: null,
  locationGroupId: "",
};

export const buildVenueFormSchema = (
  multiLoc: boolean,
  t: NamespacedTFunction<"venues-list">,
) => {
  const requiredMessage = t("venueModal.errors.requiredField");

  return z
    .object({
      name: z.string().trim().min(1, requiredMessage),
      description: z.string().trim().min(1, requiredMessage),
      accessInformation: z.string(),
      capacity: z.number().int().min(0),
      location: z.custom<AddressSuggestion | null>(),
      cover: z.union([z.instanceof(File), z.string(), z.null()]),
      locationGroupId: z.string(),
    })
    .refine((data) => data.location != null, {
      message: requiredMessage,
      path: ["location"],
    })
    .refine((data) => !multiLoc || data.locationGroupId.length > 0, {
      message: requiredMessage,
      path: ["locationGroupId"],
    });
};

const mapAddressSuggestionToLocation = (
  suggestion: AddressSuggestion,
): EstablishmentLocationInput => ({
  address: suggestion.generated_address,
  address_line_1: suggestion.address_line_1,
  address_line_2: suggestion.address_line_2,
  zipcode: suggestion.zipcode,
  city: suggestion.city,
  state: suggestion.state,
  country: suggestion.country,
  country_code: suggestion.country_code,
  geometry: { x: suggestion.geometry.x, y: suggestion.geometry.y },
  geocoded_data: {},
});

// Caller guarantees `location` is set (enforced by the schema before submit).
export const toCreateEstablishmentPayload = (
  values: VenueFormValues,
): CreateEstablishmentPayload => ({
  title: values.name.trim(),
  specific_info: values.description.trim(),
  practical_info: values.accessInformation,
  capacity: values.capacity,
  location: mapAddressSuggestionToLocation(
    values.location as AddressSuggestion,
  ),
  cover: values.cover,
});

export const toUpdateEstablishmentPayload = (
  values: VenueFormValues,
): UpdateEstablishmentPayload => toCreateEstablishmentPayload(values);

export const findVenueGroup = (
  groups: EstablishmentGroup[],
  venueId: number,
): EstablishmentGroup | undefined =>
  groups.find((group) => group.establishment.includes(venueId));

// Rebuilds the address-autocomplete value from a persisted establishment so the
// edit form can prefill the field (geometry x = latitude, y = longitude).
const mapEstablishmentToAddressSuggestion = (
  venue: Establishment,
): AddressSuggestion => ({
  place_id: `establishment-${venue.id}`,
  generated_address: venue.location.address,
  address_line_1: venue.location.address_line_1,
  address_line_2: venue.location.address_line_2,
  city: venue.location.city,
  state: venue.location.state,
  zipcode: venue.location.zipcode,
  country: venue.location.country,
  country_code: venue.location.country_code,
  geometry: { x: venue.location.latitude, y: venue.location.longitude },
});

export const fromEstablishmentToVenueFormValues = (
  venue: Establishment,
  groups: EstablishmentGroup[],
): VenueFormValues => ({
  name: venue.title,
  description: venue.specific_info,
  accessInformation: venue.practical_info,
  capacity: venue.capacity,
  location: mapEstablishmentToAddressSuggestion(venue),
  cover: venue.cover,
  locationGroupId: String(findVenueGroup(groups, venue.id)?.id ?? ""),
});
