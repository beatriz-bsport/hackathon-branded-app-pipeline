import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  getEventCategoryIconAsString,
  getTriggerKind,
  getTriggerSpecificIcon,
} from '#libs/sequential_marketing/components/helpers/utils';
import {
  TriggerKind,
  SequentialMarketingColors,
} from '#libs/sequential_marketing/constants';
import { CustomMuiIcon } from '#components/icons/CustomMuiIcon.component';
import type {
  ConnectedTrigger,
  TriggerEventConfig,
} from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';
import { CadenceChip } from './CadenceChip.component';
import useConnectedTriggerChip from './useConnectedTriggerChip.hook';


export type ConnectedTriggerChipProps = {
  connectedTrigger: ConnectedTrigger;
  color: string;
  disabled?: boolean;
  getSmartlist: (id: number) => SmartList;
};

const ConnectedTriggerChip: React.FC<ConnectedTriggerChipProps> = ({
  connectedTrigger,
  color,
  disabled,
  getSmartlist,
}) => {
  const classes = useStyles();

  const { getTriggerLabel } = useConnectedTriggerChip();

  const triggerKind = useMemo(
    () => getTriggerKind(connectedTrigger),
    [connectedTrigger],
  );

  switch (triggerKind) {
    case TriggerKind.ONLY_EVENT_TRIGGER:
    case TriggerKind.ONLY_SMARTLIST_FILTERING:
    case TriggerKind.ONLY_TIMEOUT:
      return (
        <CadenceChip
          color={color}
          disabled={disabled}
          icon={getTriggerSpecificIcon(connectedTrigger)}
          name={getTriggerLabel(
            connectedTrigger,
            getSmartlist?.(connectedTrigger?.filtering_config?.smartlist_pk),
          )}
        />
      );
    case TriggerKind.EVENT_TRIGGER_AND_SMARTLIST_FILTERING:
      return (
        <>
          <CadenceChip
            color={color}
            disabled={disabled}
            icon={getEventCategoryIconAsString(
              (connectedTrigger?.trigger_config as TriggerEventConfig)
                ?.event_type,
            )}
            name={getTriggerLabel(connectedTrigger)}
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
              disabled={disabled}
              icon="People"
              name={
                getSmartlist?.(connectedTrigger?.filtering_config?.smartlist_pk)
                  ?.name
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
    justifyContent: 'flex-start',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}));

export default React.memo(ConnectedTriggerChip);
