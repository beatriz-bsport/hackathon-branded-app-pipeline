import React from 'react';
import { useTranslation } from 'react-i18next';

import Select from 'react-select';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import type {
  CadenceFinerGrainEventsSearchObjectTypes,
  ConnectedTrigger,
  TriggerEventConfig,
} from '#src/libs/sequential_marketing/types';
import { CADENCE_FINER_GRAIN_ALLOWED_EVENTS_LIST } from '#src/libs/sequential_marketing/constants/event';
import type { SelectOption } from '#src/libs/types';
import { Events } from '#src/libs/sequential_marketing/constants';
import { DEFAULT_REACT_SELECT_MAX_HEIGHT } from './constants';
import useEventContext, {
  type EventOption,
} from '../hooks/useEventContext.hook';
import { removeFilteredPks } from '#src/libs/sequential_marketing/utils';
import FinerGrainItemSelector from '#src/libs/sequential_marketing/components/form/connected_triggers/trigger_forms/FinerGrainItemSelector.component';

type Props = {
  trigger: ConnectedTrigger;
  updateValue: (value: ConnectedTrigger, event: Events) => void;
};

const EventForm: React.FC<Props> = ({ trigger, updateValue }) => {
  const { t } = useTranslation('marketing');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [toggleSpecificItems, setToggleSpecificItems] = React.useState(false);
  const [initialFinerGrainItemIds, setInitialFinerGrainItemIds] =
    React.useState<number[]>([]);
  const [searchedObjectType, setSearchedObjectType] =
    React.useState<CadenceFinerGrainEventsSearchObjectTypes | null>(null);

  const { eventSelected, selectEvent, CADENCE_EVENT_GROUPED_OPTIONS } =
    useEventContext();

  const selectFinerGrainEventSearchObject = React.useCallback(
    (event: Events) => {
      switch (event) {
        case Events.CADENCE_EVENT_PURCHASE_PAYMENT_PACK:
          setSearchedObjectType('payment_pack');
          break;
        case Events.CADENCE_EVENT_PURCHASE_PRIVATE_PACK:
          setSearchedObjectType('private_pass');
          break;
        case Events.CADENCE_EVENT_PURCHASE_GIFT_CARD:
          setSearchedObjectType('giftcard');
          break;
        case Events.CADENCE_EVENT_PURCHASE_SHOP_ITEM:
          setSearchedObjectType('shop_item');
          break;
        case Events.CADENCE_EVENT_BILLING_PLAN_CREATED:
          setSearchedObjectType('contract');
          break;
        default:
          break;
      }
    },
    [setSearchedObjectType],
  );

  React.useEffect(() => {
    const event = (trigger?.trigger_config as TriggerEventConfig)?.event_type;

    if (event) {
      selectEvent({
        label: t(`cadence.form.event.${event}`),
        value: event,
      });
      selectFinerGrainEventSearchObject(event);
      const filteredItemsIds = (trigger?.trigger_config as TriggerEventConfig)
        ?.filtered_pks;
      if (
        filteredItemsIds &&
        CADENCE_FINER_GRAIN_ALLOWED_EVENTS_LIST.includes(event)
      ) {
        setInitialFinerGrainItemIds(filteredItemsIds);
        setToggleSpecificItems(true);
      }
    }
  }, [selectEvent, t, trigger, selectFinerGrainEventSearchObject]);

  const handleSelectEvent = React.useCallback(
    (option: EventOption) => {
      const updatedTrigger = {
        ...trigger,
        trigger_config: {
          ...removeFilteredPks(trigger?.trigger_config),
          event_type: option?.value,
        },
      };
      selectFinerGrainEventSearchObject(option?.value);
      selectEvent?.(option);
      updateValue?.(updatedTrigger, option?.value);
      setToggleSpecificItems(false);
    },
    [trigger, selectEvent, updateValue, selectFinerGrainEventSearchObject],
  );

  const handleSpecificItemChange = React.useCallback(
    (event: SelectOption<number>[]) => {
      const specificItemsIdsList: number[] = event?.map(
        (item: { label: string; value: number }) => item.value,
      );
      const eventTriggerConfig = trigger.trigger_config as TriggerEventConfig;
      const eventType = eventTriggerConfig.event_type;
      const updatedTriggerConfig = {
        ...trigger?.trigger_config,
        filtered_pks: specificItemsIdsList,
      };
      const updatedTrigger = {
        ...trigger,
        trigger_config: updatedTriggerConfig,
      };
      updateValue?.(updatedTrigger, eventType);
    },
    [trigger, updateValue],
  );

  const handleSpecificItemsToggle = React.useCallback(() => {
    setToggleSpecificItems(!toggleSpecificItems);
    if (toggleSpecificItems === true) {
      handleSpecificItemChange(null);
    }
  }, [setToggleSpecificItems, handleSpecificItemChange, toggleSpecificItems]);

  const handleCloseMenu = React.useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleOnMenuClick = React.useCallback(() => {
    setIsMenuOpen((prevState) => !prevState);
  }, []);
  return (
    <div>
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
      {eventSelected &&
        CADENCE_FINER_GRAIN_ALLOWED_EVENTS_LIST.includes(
          eventSelected.value,
        ) && (
          <FormControlLabel
            control={<Switch checked={toggleSpecificItems} color="primary" />}
            label={t('cadence.form.trigger.finerGrain.specifyItemsToggleLabel')}
            onClick={handleSpecificItemsToggle}
          />
        )}
      <FinerGrainItemSelector
        defaultItemsIds={initialFinerGrainItemIds}
        handleSpecificItemChange={handleSpecificItemChange}
        open={toggleSpecificItems}
        searchedObjectType={searchedObjectType}
      />
    </div>
  );
};

export default React.memo(EventForm);
