import type {
  FetchGroupActivitiesParams,
  MetaActivity,
} from "@bsport/api-book";
import type { TextFieldProps } from "@bsport/kaizen-primitive-core";

import { BackendSelector } from "#src/components/BackendSelector/BackendSelector";
import { useFetchGroupActivities } from "#src/hooks/api/use-fetch-group-activities";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useTranslation } from "#src/utils/i18n";

type GroupActivitySelectorProps = {
  disabled?: boolean;
  onSelectActivity?: (selectedActivity: MetaActivity | null) => void;
  textfieldProps?: Partial<TextFieldProps>;
  mode: "groupActivity" | "workshop" | "all";
  defaultValues: number[];
};

export const MetaActivitySelector = ({
  defaultValues,
  disabled = false,
  textfieldProps,
  mode,
  onSelectActivity,
}: GroupActivitySelectorProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { handleSearchGroupActivities } = useFetchGroupActivities();
  const { searchedGroupActivities } =
    useGetMarketingNotificationDependenciesData();

  // Filter activities based on mode (if applicable)
  const filteredActivities = Object.values(searchedGroupActivities).filter(
    (activity) => {
      if (mode === "workshop") {
        return activity.is_workshop;
      } else if (mode === "groupActivity") {
        return !activity.is_workshop;
      }
    },
  );

  // Format activities for the autocomplete options
  const groupMetaActivities = (results: MetaActivity[]) => {
    return results.map((activity) => ({
      id: activity.id.toString(),
      label: activity.name,
    }));
  };

  const getTranslations = () => {
    if (mode === "workshop")
      return {
        label: t("steps.triggerType.selectors.workshop.label"),
        placeholder: t("steps.triggerType.selectors.workshop.placeholder"),
        loading: t("steps.triggerType.selectors.workshop.loading"),
      };
    else if (mode === "groupActivity") {
      return {
        label: t("steps.triggerType.selectors.groupActivity.label"),
        placeholder: t("steps.triggerType.selectors.groupActivity.placeholder"),
        loading: t("steps.triggerType.selectors.groupActivity.loading"),
      };
    }
    return {
      label: t("steps.triggerType.selectors.allActivities.label"),
      placeholder: t("steps.triggerType.selectors.allActivities.placeholder"),
      loading: t("steps.triggerType.selectors.allActivities.loading"),
    };
  };

  const defaultValueAsString = defaultValues.map(String);

  const translations = getTranslations();

  return (
    <BackendSelector<FetchGroupActivitiesParams, MetaActivity>
      className="w-full"
      disabled={disabled}
      storeConfig={{
        searchFn: (query, params) =>
          handleSearchGroupActivities(query, {
            ...params,
            page: 1,
            pageSize: 10,
            inIdList: params?.id__in?.split(",").map(Number),
            isWorkshop: mode === "all" ? undefined : mode === "workshop",
          }),
        data: filteredActivities,
      }}
      optionsFormatter={(results) => groupMetaActivities(results)}
      textfieldProps={{
        ...textfieldProps,
        id: "group-activity-selector-textfield",
        label: translations.label,
        placeholder: translations.placeholder,
        iconRight: "chevron-down",
      }}
      defaultValues={defaultValueAsString}
      loadingMessage={translations.loading}
      onSelect={(selected) => {
        if (onSelectActivity && selected) {
          // Find the activity from the data based on the selected id
          const selectedActivity = filteredActivities.find(
            (activity) => activity.id.toString() === selected,
          );
          onSelectActivity(selectedActivity || null);
        }
      }}
      onClear={() => {
        if (onSelectActivity) {
          onSelectActivity(null);
        }
      }}
    />
  );
};
