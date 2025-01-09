import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  CADENCE_EVENT_CATEGORY_CHOICES,
  CADENCE_EVENT_GROUPED_BY_CATEGORY,
  Events,
} from '#src/libs/sequential_marketing/constants';
import { CADENCE_EVENT_GROUPED_BY_CATEGORY_WITHOUT_NEW_PURCHASE_EVENTS } from '#src/libs/sequential_marketing/constants/event';
import useWhitelistFinnerGrainEvents from '#src/libs/sequential_marketing/components/graph/nodes/hooks/useWhitelistFinnerGrainEvents.hook';

export type EventOption = { label: string; value: Events };

type CategoryOption = {
  label: string;
  options: EventOption[];
};

export const useEventContext = () => {
  const { t } = useTranslation('marketing');
  const { isAudienceFinnerGrainEventsActivated } =
    useWhitelistFinnerGrainEvents();

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
    return CADENCE_EVENT_CATEGORY_CHOICES.reduce<CategoryOption[]>(
      (previousValue, currentValue) => {
        const cadenceEventGroupedByCategoryList =
          isAudienceFinnerGrainEventsActivated
            ? CADENCE_EVENT_GROUPED_BY_CATEGORY
            : CADENCE_EVENT_GROUPED_BY_CATEGORY_WITHOUT_NEW_PURCHASE_EVENTS;
        return [
          ...previousValue,
          {
            label: t(`cadence.form.event.${currentValue}`),
            options: cadenceEventGroupedByCategoryList[currentValue].map(
              (child: Events) => ({
                label: t(`cadence.form.event.${child}`),
                value: child,
              }),
            ),
          },
        ];
      },
      [] as CategoryOption[],
    );
  }, [t, isAudienceFinnerGrainEventsActivated]);

  return {
    eventSelected,
    selectEvent,
    CADENCE_EVENT_GROUPED_OPTIONS,
  };
};

export default useEventContext;
