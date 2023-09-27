import React from 'react';
import { useTranslation } from 'react-i18next';

import useEventContext, {
  type EventOption,
} from '../hooks/useEventContext.hook';
import MaterialUISelector from '#components/Selector/MaterialUISelector.component';
import type {
  ConnectedTrigger,
  TriggerEventConfig,
} from '#libs/sequential_marketing/types';
import { Events } from '#libs/sequential_marketing/constants';

export type Props = {
  trigger: ConnectedTrigger;
  updateValue: (value: ConnectedTrigger, event: Events) => void;
};

const EventForm: React.FC<Props> = ({ trigger, updateValue }) => {
  const { t } = useTranslation('marketing');

  const { eventSelected, selectEvent, CADENCE_EVENT_GROUPED_OPTIONS } =
    useEventContext();

  React.useEffect(() => {
    const event = (trigger?.trigger_config as TriggerEventConfig)?.event_type;

    if (event) {
      selectEvent({
        label: t(`cadence.form.event.${event}`),
        value: event,
      });
    }
  }, [selectEvent, t, trigger]);

  const handleSelectEvent = React.useCallback(
    (option: EventOption) => {
      const updatedTrigger = {
        ...trigger,
        trigger_config: {
          ...trigger?.trigger_config,
          event_type: option?.value,
        },
      };
      selectEvent?.(option);
      updateValue?.(updatedTrigger, option?.value);
    },
    [trigger, selectEvent, updateValue],
  );

  return (
    <MaterialUISelector
      isClearable
      onChange={handleSelectEvent}
      options={CADENCE_EVENT_GROUPED_OPTIONS}
      placeholder={t('cadence.form.trigger.selectEvent')}
      value={eventSelected}
    />
  );
};

export default React.memo(EventForm);
