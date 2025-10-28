import type { TextFieldProps } from "@bsport/kaizen-primitive-core";
import type { FetchPassesParams, Pass } from "@bsport/store-buyables-pass";

import { BackendSelector } from "#src/components/BackendSelector/BackendSelector";
import { useFetchPasses } from "#src/hooks/api/use-fetch-passes";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useTranslation } from "#src/utils/i18n";

type PassSelectorProps = {
  disabled?: boolean;
  onSelectPasses?: (selectedPasses: Pass[]) => void;
  textfieldProps?: Partial<TextFieldProps>;
};

export const PassSelector = ({
  disabled = false,
  textfieldProps,
  onSelectPasses,
}: PassSelectorProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { searchedPasses, passesById } =
    useGetMarketingNotificationDependenciesData();
  const { handleSearchPasses } = useFetchPasses();

  const handleSelectPasses = (selectedValues: string | string[]) => {
    if (!onSelectPasses || !selectedValues) {
      return;
    }
    const isSelectedValuesArray =
      selectedValues && Array.isArray(selectedValues);
    const isSelectedValuesString =
      selectedValues && typeof selectedValues === "string";
    if (isSelectedValuesArray) {
      const passArray: Pass[] = [];
      selectedValues.forEach((passId) => {
        const parsedPassId = parseInt(passId);
        if (!isNaN(parsedPassId)) {
          passArray.push(passesById[parsedPassId]);
        }
      });
      onSelectPasses(passArray || []);
    }
    if (isSelectedValuesString) {
      const passArray: Pass[] = [];
      const parsedPassId = parseInt(selectedValues);
      if (!isNaN(parsedPassId)) {
        passArray.push(passesById[parsedPassId]);
      }
      onSelectPasses(passArray || []);
    }
  };

  // Format passes for the autocomplete options
  const groupPasses = (results: Pass[]) => {
    return results.map((pass) => ({
      id: pass.id.toString(),
      label: pass.name, // Adjust if pass has a different display field
    }));
  };

  return (
    <BackendSelector<FetchPassesParams, Pass>
      multiSelect
      className="w-full"
      disabled={disabled}
      storeConfig={{
        searchFn: (query, params) =>
          handleSearchPasses(query, {
            ...params,
            page: 1,
            page_size: 10,
          }),
        data: searchedPasses,
      }}
      optionsFormatter={(results) => groupPasses(results)}
      textfieldProps={{
        id: "pass-selector-textfield",
        label: t("steps.triggerType.selectors.pass.label"),
        placeholder: t("steps.triggerType.selectors.pass.placeholder"),
        iconRight: "chevron-down",
        ...textfieldProps,
      }}
      loadingMessage={t("steps.triggerType.selectors.pass.loading")}
      onSelect={handleSelectPasses}
      onClear={() => {
        if (onSelectPasses) {
          onSelectPasses([]);
        }
      }}
    />
  );
};
