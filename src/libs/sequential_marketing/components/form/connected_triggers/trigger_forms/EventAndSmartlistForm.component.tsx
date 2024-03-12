import React from 'react';
import Immutable from 'seamless-immutable';
import { ClickAwayListener, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

import useEventContext, {
  type EventOption,
} from '../hooks/useEventContext.hook';
import useSmartlistContext, {
  type SmartlistOption,
} from '../hooks/useSmartlistContext.hook';
import { CustomMuiIcon } from '#components/icons/CustomMuiIcon.component';
import { SequentialMarketingColors } from '#libs/sequential_marketing/constants';

import type {
  ConnectedTrigger,
  TriggerEventConfig,
} from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';
import { DEFAULT_REACT_SELECT_MAX_HEIGHT } from './constants';

type Props = {
  isFromMUIPopover: boolean;
  trigger: ConnectedTrigger;
  smartlists: Immutable.ImmutableArray<SmartList>;
  updateValue: (trigger: ConnectedTrigger) => void;
};

const EventAndSmartlistForm: React.FC<Props> = ({
  isFromMUIPopover,
  trigger,
  smartlists,
  updateValue,
}) => {
  const { t } = useTranslation('marketing');
  const [isEventMenuOpen, setIsEventMenuOpen] = React.useState(false);
  const [isSmartlistMenuOpen, setIsSmartlistMenuOpen] = React.useState(false);

  const classes = useStyles();

  const { eventSelected, selectEvent, CADENCE_EVENT_GROUPED_OPTIONS } =
    useEventContext();

  const {
    smartlistSelected,
    selectSmartlist,
    getSmartlistName,
    SMARTLIST_OPTIONS,
  } = useSmartlistContext(smartlists);

  React.useEffect(() => {
    const event = (trigger?.trigger_config as TriggerEventConfig)?.event_type;
    const smartlistId = trigger?.filtering_config?.smartlist_pk;

    if (event) {
      selectEvent({
        label: t(`cadence.form.event.${event}`),
        value: event,
      });
    }

    if (smartlistId) {
      selectSmartlist({
        label: getSmartlistName(smartlistId),
        value: smartlistId,
      });
    }
  }, [getSmartlistName, selectEvent, selectSmartlist, t, trigger]);

  const handleSelectEvent = React.useCallback(
    (option: EventOption) => {
      const updatedTrigger = {
        ...trigger,
        trigger_config: {
          ...trigger?.trigger_config,
          event_type: option?.value,
        },
      };
      selectEvent(option);
      updateValue?.(updatedTrigger);
    },
    [selectEvent, updateValue, trigger],
  );

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
        <div className={classes.filtering}>
          <CustomMuiIcon
            defaultBackGround
            customColor={SequentialMarketingColors.GREY_FILTER_COLOR}
            icon="Add"
            withBackground={false}
          />
          <div className={classes.selector}>
            <Select
              isClearable
              menuPlacement="auto"
              menuPosition="fixed"
              minMenuHeight={DEFAULT_REACT_SELECT_MAX_HEIGHT}
              onChange={handleSelectSmartlist}
              options={SMARTLIST_OPTIONS}
              placeholder={t('cadence.form.trigger.selectSmartlist')}
              value={smartlistSelected}
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
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
