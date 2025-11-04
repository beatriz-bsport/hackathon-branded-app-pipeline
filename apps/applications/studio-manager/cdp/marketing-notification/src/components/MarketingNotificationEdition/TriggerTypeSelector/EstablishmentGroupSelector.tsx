import type { TextFieldProps } from "@bsport/kaizen-primitive-core";
import type {
  EstablishmentGroup,
  FetchEstablishmentGroupQueryParams,
} from "@bsport/store-core-data-establishment";

import { BackendSelector } from "#src/components/BackendSelector/BackendSelector";
import { useFetchEstablishments } from "#src/hooks/api/use-fetch-establishments";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useTranslation } from "#src/utils/i18n";

type EstablishmentGroupSelectorProps = {
  defaultValues: number[];
  disabled?: boolean;
  onSelectEstablishmentGroup?: (
    selectedGroup: EstablishmentGroup | null,
  ) => void;
  textfieldProps?: Partial<TextFieldProps>;
};

export const EstablishmentGroupSelector = ({
  defaultValues,
  disabled = false,
  textfieldProps,
  onSelectEstablishmentGroup,
}: EstablishmentGroupSelectorProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { searchedEstablishments } =
    useGetMarketingNotificationDependenciesData();
  const { handleSearchEstablishments } = useFetchEstablishments();

  // Format establishment groups for the autocomplete options
  const groupEstablishments = (results: EstablishmentGroup[]) => {
    return results.map((establishment) => ({
      id: establishment.id.toString(),
      label: establishment.name,
    }));
  };

  const defaultValueAsString = defaultValues.map(String);

  return (
    <BackendSelector<FetchEstablishmentGroupQueryParams, EstablishmentGroup>
      className="w-full"
      disabled={disabled}
      storeConfig={{
        searchFn: (query, params) =>
          handleSearchEstablishments(query, {
            ...params,
            page: 1,
            page_size: 10,
          }),
        data: searchedEstablishments,
      }}
      defaultValues={defaultValueAsString}
      optionsFormatter={(results) => groupEstablishments(results)}
      textfieldProps={{
        id: "establishment-group-selector-textfield",
        label: t("steps.triggerType.selectors.establishment.label"),
        placeholder: t("steps.triggerType.selectors.establishment.placeholder"),
        iconRight: "chevron-down",
        ...textfieldProps,
      }}
      loadingMessage={t("steps.triggerType.selectors.establishment.loading")}
      onSelect={(selected) => {
        if (onSelectEstablishmentGroup && selected) {
          const selectedGroup = searchedEstablishments.find(
            (establishment) => establishment.id.toString() === selected,
          );
          onSelectEstablishmentGroup(selectedGroup || null);
        }
      }}
      onClear={() => {
        if (onSelectEstablishmentGroup) {
          onSelectEstablishmentGroup(null);
        }
      }}
    />
  );
};
