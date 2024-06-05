import React from 'react';
import { useTranslation } from 'react-i18next';

import Select from 'react-select';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import type {
  ConnectedTrigger,
  TriggerEventConfig,
} from '#libs/sequential_marketing/types';
import { Events } from '#libs/sequential_marketing/constants';
import useEventContext, {
  type EventOption,
} from '../hooks/useEventContext.hook';
import { DEFAULT_REACT_SELECT_MAX_HEIGHT } from './constants';

type Props = {
  isFromMUIPopover: boolean;
  trigger: ConnectedTrigger;
  updateValue: (value: ConnectedTrigger, event: Events) => void;
};

const EventForm: React.FC<Props> = ({
  isFromMUIPopover,
  trigger,
  updateValue,
}) => {
  const { t } = useTranslation('marketing');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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

  const handleCloseMenu = React.useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleOnMenuClick = React.useCallback(() => {
    setIsMenuOpen((prevState) => !prevState);
  }, []);
  if (isFromMUIPopover) {
    return (
      <div
        style={{ paddingLeft: 1 }} // needed to fully display the left border when selected
      >
        <Select
          isClearable
          menuPlacement="auto"
          menuPosition="fixed"
          minMenuHeight={DEFAULT_REACT_SELECT_MAX_HEIGHT}
          onChange={handleSelectEvent}
          options={CADENCE_EVENT_GROUPED_OPTIONS}
          placeholder={t('cadence.form.trigger.selectEvent')}
          value={eventSelected}
        />
      </div>
    );
  }
  return (
    <ClickAwayListener onClickAway={handleCloseMenu}>
      <div
        onClick={handleOnMenuClick}
        onKeyDown={handleOnMenuClick}
        role="button"
        style={{ paddingLeft: 1 }} // needed to fully display the left border when selected
        tabIndex={0}
      >
        <Select
          menuIsOpen={isMenuOpen}
          menuPlacement="auto"
          menuPortalTarget={document.body}
          minMenuHeight={DEFAULT_REACT_SELECT_MAX_HEIGHT}
          onBlur={handleCloseMenu}
          onChange={handleSelectEvent}
          options={CADENCE_EVENT_GROUPED_OPTIONS}
          placeholder={t('cadence.form.trigger.selectEvent')}
          value={eventSelected}
        />
      </div>
    </ClickAwayListener>
  );
};

export default React.memo(EventForm);
