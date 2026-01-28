import React from 'react';
import Immutable from 'seamless-immutable';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

import type {
  CadenceFinerGrainEventsSearchObjectTypes,
  ConnectedTrigger,
  TriggerEventConfig,
} from '#src/libs/sequential_marketing/types';
import type { SelectOption } from '#src/libs/types';
import type { SmartList } from '#src/libs/smart-list/types';
import useSmartlistContext, {
  type SmartlistOption,
} from '../hooks/useSmartlistContext.hook';
import useEventContext, {
  type EventOption,
} from '../hooks/useEventContext.hook';
import { removeFilteredPks } from '#src/libs/sequential_marketing/utils';

import {
  CADENCE_FINER_GRAIN_ALLOWED_EVENTS_LIST,
  Events,
} from '#src/libs/sequential_marketing/constants/event';
import { DEFAULT_REACT_SELECT_MAX_HEIGHT } from './constants';

import { CustomMuiIcon } from '#src/components/icons/CustomMuiIcon.component';
import { SequentialMarketingColors } from '#src/libs/sequential_marketing/constants';
import FinerGrainItemSelector from '#src/libs/sequential_marketing/components/form/connected_triggers/trigger_forms/FinerGrainItemSelector.component';

type Props = {
  trigger: ConnectedTrigger;
  smartlists: Immutable.ImmutableArray<SmartList>;
  updateValue: (trigger: ConnectedTrigger) => void;
};

const EventAndSmartlistForm: React.FC<Props> = ({
  trigger,
  smartlists,
  updateValue,
}) => {
  const { t } = useTranslation('marketing');
  const [isEventMenuOpen, setIsEventMenuOpen] = React.useState(false);
  const [isSmartlistMenuOpen, setIsSmartlistMenuOpen] = React.useState(false);
  const [toggleSpecificItems, setToggleSpecificItems] = React.useState(false);
  const [initialFinerGrainItemIds, setInitialFinerGrainItemIds] =
    React.useState<number[]>([]);
  const [searchedObjectType, setSearchedObjectType] =
    React.useState<CadenceFinerGrainEventsSearchObjectTypes | null>(null);

  const classes = useStyles();

  const { eventSelected, selectEvent, CADENCE_EVENT_GROUPED_OPTIONS } =
    useEventContext();

  const {
    smartlistSelected,
    selectSmartlist,
    getSmartlistName,
    SMARTLIST_OPTIONS,
  } = useSmartlistContext(smartlists);

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
    const smartlistId = trigger?.filtering_config?.smartlist_pk;

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

    if (smartlistId) {
      selectSmartlist({
        label: getSmartlistName(smartlistId),
        value: smartlistId,
      });
    }
  }, [
    getSmartlistName,
    selectEvent,
    selectSmartlist,
    setToggleSpecificItems,
    setInitialFinerGrainItemIds,
    selectFinerGrainEventSearchObject,
    t,
    trigger,
  ]);

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
      updateValue?.(updatedTrigger);
      setToggleSpecificItems(false);
    },
    [trigger, selectEvent, updateValue, selectFinerGrainEventSearchObject],
  );

  const handleSpecificItemChange = React.useCallback(
    (event: SelectOption<number>[]) => {
      const specificItemsIdsList: number[] = event?.map(
        (item: { label: string; value: number }) => item.value,
      );
      const updatedTriggerConfig = {
        ...trigger?.trigger_config,
        filtered_pks: specificItemsIdsList,
      };
      const updatedTrigger = {
        ...trigger,
        trigger_config: updatedTriggerConfig,
      };
      updateValue?.(updatedTrigger);
    },
    [trigger, updateValue],
  );

  const handleSpecificItemsToggle = React.useCallback(() => {
    setToggleSpecificItems(!toggleSpecificItems);
    if (toggleSpecificItems === true) {
      handleSpecificItemChange(null);
    }
  }, [setToggleSpecificItems, handleSpecificItemChange, toggleSpecificItems]);

  const handleSelectSmartlist = React.useCallback(
    (option: SmartlistOption) => {
      const updatedTrigger = {
        ...trigger,
        filtering_config: {
          ...trigger?.filtering_config,
          smartlist_pk: option?.value,
        },
      };
      selectSmartlist?.(option);
      updateValue?.(updatedTrigger);
    },
    [selectSmartlist, updateValue, trigger],
  );
  const handleOnEventMenuClick = React.useCallback(() => {
    setIsEventMenuOpen((prevState) => !prevState);
  }, []);

  const handleEventMenuClose = React.useCallback(() => {
    setIsEventMenuOpen(false);
  }, []);

  const handleOnSmartlistMenuClick = React.useCallback(() => {
    setIsSmartlistMenuOpen((prevState) => !prevState);
  }, []);

  const handleSmartlistMenuClose = React.useCallback(() => {
    setIsSmartlistMenuOpen(false);
  }, []);

  return (
    <>
      <div>
        <ClickAwayListener onClickAway={handleEventMenuClose}>
          <div
            onClick={handleOnEventMenuClick}
            onKeyDown={handleOnEventMenuClick}
            role="button"
            style={{ paddingLeft: 1 }} // needed to fully display the left border when selected
            tabIndex={0}
          >
            <Select
              menuIsOpen={isEventMenuOpen}
              menuPlacement="auto"
              menuPortalTarget={document.body}
              minMenuHeight={DEFAULT_REACT_SELECT_MAX_HEIGHT}
              onBlur={handleEventMenuClose}
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
              label={t(
                'cadence.form.trigger.finerGrain.specifyItemsToggleLabel',
              )}
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

      <div className={classes.filtering}>
        <CustomMuiIcon
          defaultBackGround
          customColor={SequentialMarketingColors.GREY_FILTER_COLOR}
          icon="Add"
          withBackground={false}
        />
        <ClickAwayListener onClickAway={handleSmartlistMenuClose}>
          <div
            className={classes.selector}
            onClick={handleOnSmartlistMenuClick}
            onKeyDown={handleOnSmartlistMenuClick}
            role="button"
            tabIndex={0}
          >
            <Select
              menuIsOpen={isSmartlistMenuOpen}
              menuPlacement="auto"
              menuPortalTarget={document.body}
              minMenuHeight={DEFAULT_REACT_SELECT_MAX_HEIGHT}
              onBlur={handleSmartlistMenuClose}
              onChange={handleSelectSmartlist}
              options={SMARTLIST_OPTIONS}
              placeholder={t('cadence.form.trigger.selectSmartlist')}
              value={smartlistSelected}
            />
          </div>
        </ClickAwayListener>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  filtering: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  selector: {
    display: 'block',
    width: '100%',
  },
}));

export default React.memo(EventAndSmartlistForm);
