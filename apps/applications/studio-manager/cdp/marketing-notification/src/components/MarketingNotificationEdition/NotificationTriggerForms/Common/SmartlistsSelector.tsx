import type { TextFieldProps } from "@bsport/kaizen-primitive-core";
import type {
  FetchSmartlistsParams,
  Smartlist,
  SmartlistOptions,
} from "@bsport/store-cdp-smartlist";

import { handleSelectSingleOrMultipleItems } from "#src/components/BackendSelector";
import { BackendSelector } from "#src/components/BackendSelector/BackendSelector";
import { useFetchSmartlists } from "#src/hooks/api/use-fetch-smartlists";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useTranslation } from "#src/utils/i18n";

type SmartlistsSelectorProps = {
  disabled?: boolean;
  onSelectSmartlists?: (selectedPasses: Smartlist[]) => void;
  textfieldProps?: Partial<TextFieldProps>;
  defaultValues?: number[];
};

export const SmartlistsSelector = ({
  defaultValues,
  disabled = false,
  textfieldProps,
  onSelectSmartlists,
}: SmartlistsSelectorProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { searchedSmartlists, smartlistsById } =
    useGetMarketingNotificationDependenciesData();
  const { handleSearchSmartlists } = useFetchSmartlists();

  // Format passes for the autocomplete options
  const groupSmartlists = (results: Smartlist[]) => {
    return results.map((pass) => ({
      id: pass.id.toString(),
      label: pass.name, // Adjust if pass has a different display field
    }));
  };

  const defaultValueAsString = (defaultValues ?? []).map(String);

  return (
    <BackendSelector<
      Required<FetchSmartlistsParams> & SmartlistOptions,
      Smartlist
    >
      multiSelect
      className="w-full"
      disabled={disabled}
      storeConfig={{
        searchFn: (query, params) =>
          handleSearchSmartlists(query, {
            ...params,
            page: 1,
            page_size: 10,
            search: query,
          }),
        data: searchedSmartlists,
      }}
      defaultValues={defaultValueAsString}
      optionsFormatter={(results) => groupSmartlists(results)}
      textfieldProps={{
        id: "pass-selector-textfield",
        label: t("steps.triggerType.selectors.smartlists.label"),
        placeholder: t("steps.triggerType.selectors.smartlists.placeholder"),
        iconRight: "chevron-down",
        ...textfieldProps,
      }}
      loadingMessage={t("steps.triggerType.selectors.smartlists.loading")}
      onSelect={(selectedItems) =>
        handleSelectSingleOrMultipleItems<Smartlist>({
          onSelectItems: onSelectSmartlists,
          selectedItems,
          itemsById: smartlistsById,
        })
      }
      onClear={() => {
        if (onSelectSmartlists) {
          onSelectSmartlists([]);
        }
      }}
    />
  );
};
