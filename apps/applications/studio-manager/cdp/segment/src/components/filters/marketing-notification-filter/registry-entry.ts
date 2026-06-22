import { FILTER_SELECTOR_CATEGORIES } from "../filter-selector.constants";
import { renderStandardFilterCard } from "../segment-filters-registry/render-helpers";
import { defineSegmentFilterEntry } from "../segment-filters-registry/types";
import { SMARTLIST_FILTERS_MANAGER_FILTER_TYPES } from "../shared/types-guards";
import { MarketingNotificationFilterCard } from "./components/marketing-notification-filter-card";
import { createDefaultMarketingNotificationFilter } from "./default-value";
import { mapMarketingNotificationFilterToFormValue } from "./mappers/api-to-form-value";

export const marketingNotificationFilterRegistryEntry =
  defineSegmentFilterEntry({
    filterType: SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.marketingNotification,
    queryDataKey: "marketingNotificationFilters",
    savedKeyPrefix: "saved-marketing-notification",
    selector: {
      titleKey: "filters.103.title",
      descriptionKey:
        "filterSelector.options.marketingNotification.description",
      category: FILTER_SELECTOR_CATEGORIES.memberInformations,
    },
    createDefault: createDefaultMarketingNotificationFilter,
    mapToFormValue: mapMarketingNotificationFilterToFormValue,
    render: (context, params) =>
      renderStandardFilterCard(
        MarketingNotificationFilterCard,
        context.smartlistId,
        params,
      ),
  });
