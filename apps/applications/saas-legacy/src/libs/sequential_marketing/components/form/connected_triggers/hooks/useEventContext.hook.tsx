import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  CADENCE_EVENT_CATEGORY_CHOICES,
  CADENCE_EVENT_GROUPED_BY_CATEGORY,
  Events,
} from '#src/libs/sequential_marketing/constants';
import { CADENCE_EVENT_GROUPED_BY_CATEGORY_WITHOUT_NEW_PURCHASE_EVENTS } from '#src/libs/sequential_marketing/constants/event';
import useWhitelistFinnerGrainEvents from '#src/libs/sequential_marketing/components/graph/nodes/hooks/useWhitelistFinnerGrainEvents.hook';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';

export type EventOption = { label: string; value: Events };

type CategoryOption = {
  label: string;
  options: EventOption[];
};

/**
 * Returns an array of Events that should be excluded based on feature flags.
 * Add new feature flag conditions here to control which specific events are hidden.
 */
const getExcludedEvents = (featureFlags: {
  showLeadFormSubmittedEvent: boolean;
}): Events[] => {
  const excludedEvents: Events[] = [];

  if (!featureFlags.showLeadFormSubmittedEvent) {
    excludedEvents.push(Events.CADENCE_EVENT_LEAD_FORM_SUBMITTED);
  }

  return excludedEvents;
};

export const useEventContext = () => {
  const { t } = useTranslation('marketing');
  const { isAudienceFinnerGrainEventsActivated } =
    useWhitelistFinnerGrainEvents();
  const showLeadFormSubmittedEvent = useSafeFlag(
    FeatureFlags.AUDIENCE_LEAD_FORM_SUBMITTED_EVENT,
  );

  const [eventSelected, setEventSelected] = React.useState<EventOption | null>(
    null,
  );

  const selectEvent = React.useCallback(
    (option: EventOption) => setEventSelected(option),
    [],
  );

  // Constant declaration building a object shaped such as the selector component groups the options
  // by category. It is placed here since some dynamic translations have to be done.
  const CADENCE_EVENT_GROUPED_OPTIONS = React.useMemo(() => {
    const excludedEvents = getExcludedEvents({
      showLeadFormSubmittedEvent,
    });

    return CADENCE_EVENT_CATEGORY_CHOICES.reduce<CategoryOption[]>(
      (previousValue, currentValue) => {
        const cadenceEventGroupedByCategoryList =
          isAudienceFinnerGrainEventsActivated
            ? CADENCE_EVENT_GROUPED_BY_CATEGORY
            : CADENCE_EVENT_GROUPED_BY_CATEGORY_WITHOUT_NEW_PURCHASE_EVENTS;

        // Filter out excluded events from this category
        const filteredEvents = cadenceEventGroupedByCategoryList[currentValue]
          .filter((event: Events) => !excludedEvents.includes(event))
          .map((child: Events) => ({
            label: t(`cadence.form.event.${child}`),
            value: child,
          }));

        // Only include the category if it has events after filtering
        if (filteredEvents.length === 0) {
          return previousValue;
        }

        return [
          ...previousValue,
          {
            label: t(`cadence.form.event.${currentValue}`),
            options: filteredEvents,
          },
        ];
      },
      [] as CategoryOption[],
    );
  }, [t, isAudienceFinnerGrainEventsActivated, showLeadFormSubmittedEvent]);

  return {
    eventSelected,
    selectEvent,
    CADENCE_EVENT_GROUPED_OPTIONS,
  };
};

export default useEventContext;
