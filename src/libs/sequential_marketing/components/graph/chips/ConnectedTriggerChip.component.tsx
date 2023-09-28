import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  EventTriggerDetailText,
  TriggerText,
  getEventCategoryIconAsString,
  getTriggerKind,
} from '#libs/sequential_marketing/components/helpers/utils';
import {
  TriggerKind,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';
import { CadenceChip } from './CadenceChip.component';
import { CustomMuiIcon } from '#components/icons/CustomMuiIcon.component';

import type {
  ConnectedTrigger,
  TriggerEventConfig,
} from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';

export type ConnectedTriggerChipProps = {
  trigger: ConnectedTrigger;
  color: string;
  getSmartlist: (id: number) => SmartList;
};

const ConnectedTriggerChip: React.FC<ConnectedTriggerChipProps> = ({
  trigger,
  color,
  getSmartlist,
}) => {
  const classes = useStyles();

  const triggerKind = useMemo(() => getTriggerKind(trigger), [trigger]);

  let triggerConfig = trigger?.trigger_config;

  switch (triggerKind) {
    case TriggerKind.ONLY_EVENT_TRIGGER:
      triggerConfig = triggerConfig as TriggerEventConfig;
      return (
        <CadenceChip
          color={color}
          icon={getEventCategoryIconAsString(triggerConfig?.event_type)}
          name={TriggerText({ connected_trigger_config: trigger })}
          toolTipValue={EventTriggerDetailText({
            connected_trigger_config: trigger,
          })}
        />
      );
    case TriggerKind.ONLY_SMARTLIST_FILTERING:
      return (
        <CadenceChip
          color={color}
          icon="People"
          name={TriggerText({
            connected_trigger_config: trigger,
            smartlist: getSmartlist?.(trigger?.filtering_config?.smartlist_pk),
          })}
        />
      );
    case TriggerKind.ONLY_TIMEOUT:
      return (
        <CadenceChip
          color={color}
          icon="Timer"
          name={TriggerText({ connected_trigger_config: trigger })}
        />
      );
    case TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING:
      triggerConfig = triggerConfig as TriggerEventConfig;
      return (
        <>
          <CadenceChip
            color={color}
            icon={getEventCategoryIconAsString(triggerConfig?.event_type)}
            name={TriggerText({ connected_trigger_config: trigger })}
            toolTipValue={EventTriggerDetailText({
              connected_trigger_config: trigger,
            })}
          />
          <div className={classes.filter}>
            <CustomMuiIcon
              defaultBackGround
              customColor={SequentialMarketingColors.GREY_FILTER_COLOR}
              icon="Add"
              withBackground={false}
            />
            <CadenceChip
              color={color}
              icon="People"
              name={
                getSmartlist?.(trigger?.filtering_config?.smartlist_pk)?.name
              }
            />
          </div>
        </>
      );
    default:
      return null;
  }
};

const useStyles = makeStyles((theme) => ({
  filter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}));

export default React.memo(ConnectedTriggerChip);
