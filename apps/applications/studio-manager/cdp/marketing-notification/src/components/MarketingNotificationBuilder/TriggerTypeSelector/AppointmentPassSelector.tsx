import type { TextFieldProps } from "@bsport/kaizen-primitive-core";
import type {
  AppointmentPass,
  FetchAppointmentPassesParams,
} from "@bsport/store-buyables-appointment-pass";

import { handleSelectSingleOrMultipleItems } from "#src/components/BackendSelector";
import { BackendSelector } from "#src/components/BackendSelector/BackendSelector";
import { useFetchAppointmentPasses } from "#src/hooks/api/use-fetch-appointment-passes";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useTranslation } from "#src/utils/i18n";

type AppointmentPassSelectorProps = {
  defaultValues: number[];
  disabled?: boolean;
  onSelectAppointmentPasses?: (selectedPasses: AppointmentPass[]) => void;
  textfieldProps?: Partial<TextFieldProps>;
};

export const AppointmentPassSelector = ({
  defaultValues,
  disabled = false,
  textfieldProps,
  onSelectAppointmentPasses,
}: AppointmentPassSelectorProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { searchedAppointmentPasses, appointmentPassesById } =
    useGetMarketingNotificationDependenciesData();
  const { handleSearchAppointmentPasses } = useFetchAppointmentPasses();

  // Format passes for the autocomplete options
  const groupAppoinmentPasses = (results: AppointmentPass[]) => {
    return results.map((pass) => ({
      id: pass.id.toString(),
      label: pass.name, // Adjust if pass has a different display field
    }));
  };

  const defaultValueAsString = defaultValues.map(String);

  return (
    <BackendSelector<FetchAppointmentPassesParams, AppointmentPass>
      multiSelect
      className="w-full"
      disabled={disabled}
      storeConfig={{
        searchFn: (query, params) =>
          handleSearchAppointmentPasses(query, {
            ...params,
            page: 1,
            page_size: 10,
          }),
        data: searchedAppointmentPasses,
      }}
      defaultValues={defaultValueAsString}
      optionsFormatter={(results) => groupAppoinmentPasses(results)}
      textfieldProps={{
        id: "pass-selector-textfield",
        label: t("steps.triggerType.selectors.appointmentPass.label"),
        placeholder: t(
          "steps.triggerType.selectors.appointmentPass.placeholder",
        ),
        iconRight: "chevron-down",
        ...textfieldProps,
      }}
      loadingMessage={t("steps.triggerType.selectors.appointmentPass.loading")}
      onSelect={(selectedItems) =>
        handleSelectSingleOrMultipleItems<AppointmentPass>({
          onSelectItems: onSelectAppointmentPasses,
          selectedItems,
          itemsById: appointmentPassesById,
        })
      }
      onClear={() => {
        if (onSelectAppointmentPasses) {
          onSelectAppointmentPasses([]);
        }
      }}
    />
  );
};
