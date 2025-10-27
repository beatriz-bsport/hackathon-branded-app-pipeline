import type { TextFieldProps } from "@bsport/kaizen-primitive-core";
import type {
  Establishment,
  FetchEstablishmentParams,
} from "@bsport/store-core-data-establishment";

import { BackendSelector } from "#src/components/BackendSelector/BackendSelector";
import { useFetchLocations } from "#src/hooks/api/use-fetch-location";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useTranslation } from "#src/utils/i18n";

type LocationSelectorProps = {
  disabled?: boolean;
  onSelectLocation?: (selectedLocation: Establishment | null) => void;
  textfieldProps?: Partial<TextFieldProps>;
};

export const LocationSelector = ({
  disabled = false,
  textfieldProps,
  onSelectLocation,
}: LocationSelectorProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { handleSearchLocations } = useFetchLocations();
  const { searchedLocations } = useGetMarketingNotificationDependenciesData();

  // Format activities for the autocomplete options
  const groupLocations = (results: Establishment[]) => {
    return results.map((location) => ({
      id: location.id.toString(),
      label: location.title,
    }));
  };

  return (
    <BackendSelector<FetchEstablishmentParams, Establishment>
      className="w-full"
      disabled={disabled}
      storeConfig={{
        searchFn: (query, params) =>
          handleSearchLocations(query, {
            ...params,
            page: 1,
            page_size: 10,
          }),
        data: searchedLocations,
      }}
      optionsFormatter={(results) => groupLocations(results)}
      textfieldProps={{
        id: "location-selector-textfield",
        label: t("steps.triggerType.selectors.location.label"),
        placeholder: t("steps.triggerType.selectors.location.placeholder"),
        iconRight: "chevron-down",
        ...textfieldProps,
      }}
      loadingMessage={t("steps.triggerType.selectors.location.loading")}
      onSelect={(selected) => {
        if (onSelectLocation && selected) {
          // Find the location from the data based on the selected id
          const selectedLocation = searchedLocations.find(
            (location) => location.id.toString() === selected,
          );
          onSelectLocation(selectedLocation || null);
        }
      }}
      onClear={() => {
        if (onSelectLocation) {
          onSelectLocation(null);
        }
      }}
    />
  );
};
