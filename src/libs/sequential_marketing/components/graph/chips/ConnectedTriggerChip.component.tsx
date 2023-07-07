import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  TriggerText,
  getEventCategoryIconAsString,
  getTriggerKind,
} from '../../icons/utils';
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

  let triggerConfig = trigger.trigger_config;

  switch (triggerKind) {
    case TriggerKind.ONLY_EVENT_TRIGGER:
      triggerConfig = triggerConfig as TriggerEventConfig;
      return (
        <CadenceChip
          name={TriggerText({ connected_trigger_config: trigger })}
          icon={getEventCategoryIconAsString(triggerConfig.event_type)}
          color={color}
        />
      );
    case TriggerKind.ONLY_SMARTLIST_FILTERING:
      return (
        <CadenceChip
          name={TriggerText({
            connected_trigger_config: trigger,
            smartlist: getSmartlist(trigger?.filtering_config?.smartlist_pk),
          })}
          icon="People"
          color={color}
        />
      );
    case TriggerKind.ONLY_TIMEOUT:
      return (
        <CadenceChip
          name={TriggerText({ connected_trigger_config: trigger })}
          icon="Timer"
          color={color}
        />
      );
    case TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING:
      triggerConfig = triggerConfig as TriggerEventConfig;
      return (
        <>
          <CadenceChip
            name={TriggerText({ connected_trigger_config: trigger })}
            icon={getEventCategoryIconAsString(triggerConfig.event_type)}
            color={color}
          />
          <div className={classes.filter}>
            <CustomMuiIcon
              icon="FilterList"
              customColor={SequentialMarketingColors.GREY_FILTER_COLOR}
              withBackground={false}
              defaultBackGround
            />
            <CadenceChip
              name={getSmartlist(trigger?.filtering_config?.smartlist_pk)?.name}
              icon="People"
              color={color}
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
