import type { TextFieldProps } from "@bsport/kaizen-primitive-core";
import type {
  Appointment,
  SearchAppointmentParams,
} from "@bsport/store-booking-appointment";

import { BackendSelector } from "#src/components/BackendSelector/BackendSelector";
import { useFetchAppointments } from "#src/hooks/api/use-fetch-appointment";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useTranslation } from "#src/utils/i18n";

type AppointmentSelectorProps = {
  disabled?: boolean;
  onSelectAppointment?: (selectedAppointment: Appointment | null) => void;
  textfieldProps?: Partial<TextFieldProps>;
};

export const AppointmentSelector = ({
  disabled = false,
  textfieldProps,
  onSelectAppointment,
}: AppointmentSelectorProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { searchedAppointments } =
    useGetMarketingNotificationDependenciesData();
  const { handleSearchAppointments } = useFetchAppointments();

  // Format appointments for the autocomplete options
  const groupAppointments = (results: Appointment[]) => {
    return results.map((appointment) => ({
      id: appointment.id.toString(),
      label: appointment.name, // Adjust if appointment has a different display field
    }));
  };

  return (
    <BackendSelector<SearchAppointmentParams, Appointment>
      className="w-full"
      disabled={disabled}
      storeConfig={{
        searchFn: (query, params) =>
          handleSearchAppointments(query, {
            ...params,
            q: query,
            page: 1,
            page_size: 10,
          }),
        data: searchedAppointments,
      }}
      optionsFormatter={(results) => groupAppointments(results)}
      textfieldProps={{
        id: "appointment-selector-textfield",
        label: t("steps.triggerType.selectors.appointment.label"),
        placeholder: t("steps.triggerType.selectors.appointment.placeholder"),
        iconRight: "chevron-down",
        ...textfieldProps,
      }}
      loadingMessage={t("steps.triggerType.selectors.appointment.loading")}
      onSelect={(selected) => {
        if (onSelectAppointment && selected) {
          const selectedAppointment = searchedAppointments.find(
            (appointment) => appointment.id.toString() === selected,
          );
          onSelectAppointment(selectedAppointment || null);
        }
      }}
      onClear={() => {
        if (onSelectAppointment) {
          onSelectAppointment(null);
        }
      }}
    />
  );
};
