import type { TextFieldProps } from "@bsport/kaizen-primitive-core";
import type {
  FetchSubscriptionQueryParams,
  Subscription,
} from "@bsport/store-buyables-subscription";

import { BackendSelector } from "#src/components/BackendSelector/BackendSelector";
import { useFetchSubscriptions } from "#src/hooks/api/use-fetch-subscription";
import { useGetMarketingNotificationDependenciesData } from "#src/hooks/api/use-get-marketing-notification-dependencies-data";
import { useTranslation } from "#src/utils/i18n";

type SubscriptionSelectorProps = {
  disabled?: boolean;
  onSelectSubscription?: (selectedSubscription: Subscription | null) => void;
  textfieldProps?: Partial<TextFieldProps>;
};

export const SubscriptionSelector = ({
  disabled = false,
  textfieldProps,
  onSelectSubscription,
}: SubscriptionSelectorProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const { searchedSubscriptions } =
    useGetMarketingNotificationDependenciesData();
  const { handleSearchSubscriptions } = useFetchSubscriptions();

  // Format subscriptions for the autocomplete options
  const groupSubscriptions = (results: Subscription[]) => {
    return results.map((subscription) => ({
      id: subscription.id.toString(),
      label: subscription.name, // Adjust if subscription has a different display field
    }));
  };

  return (
    <BackendSelector<FetchSubscriptionQueryParams, Subscription>
      className="w-full"
      disabled={disabled}
      storeConfig={{
        searchFn: (query, params) =>
          handleSearchSubscriptions(query, {
            ...params,
            page: 1,
            page_size: 10,
          }),
        data: searchedSubscriptions,
      }}
      optionsFormatter={(results) => groupSubscriptions(results)}
      textfieldProps={{
        id: "subscription-selector-textfield",
        label: t("steps.triggerType.selectors.subscription.label"),
        placeholder: t("steps.triggerType.selectors.subscription.placeholder"),
        iconRight: "chevron-down",
        ...textfieldProps,
      }}
      loadingMessage={t("steps.triggerType.selectors.subscription.loading")}
      onSelect={(selected) => {
        if (onSelectSubscription && selected) {
          const selectedSubscription = searchedSubscriptions.find(
            (subscription) => subscription.id.toString() === selected,
          );
          onSelectSubscription(selectedSubscription || null);
        }
      }}
      onClear={() => {
        if (onSelectSubscription) {
          onSelectSubscription(null);
        }
      }}
    />
  );
};
