import React, { useCallback } from 'react';
import chroma from 'chroma-js';
import Immutable from 'seamless-immutable';

import { makeStyles, Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import MultipleActionsMenuOnHover from '#components/button/MultipleActionsMenuOnHover.component';
import ConnectedTriggerChip from '#libs/sequential_marketing/components/graph/chips/ConnectedTriggerChip.component';
import TriggeredPersonIcon from '#components/icons/TriggeredPersonIcon.component';
import type { ConnectedTrigger } from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';
import type { Action } from '#components/button/MultipleActionsButton.component';
import {
  HEADER_FONT_SIZE,
  HEADER_ICON_SIZE,
  HEADER_MAX_WIDTH,
} from '#libs/sequential_marketing/constants/steps';

type StylesProps = {
  color: string;
  disabled?: boolean;
  squareIcon?: boolean;
  hasActions?: boolean;
};

export type CadenceNodeTitleProps = {
  name: string;
  icon: string;
  triggerList?: ConnectedTrigger[];
  actions?: Immutable.ImmutableArray<Action>;
  handleDisableRipple?: () => void;
  handleEnableRipple?: () => void;
  getSmartlist?: (id: number) => SmartList;
} & Omit<StylesProps, 'hasActions'>;

const CadenceNodeTitle: React.FC<CadenceNodeTitleProps> = ({
  name,
  icon,
  color,
  triggerList,
  actions,
  disabled,
  squareIcon,
  handleDisableRipple,
  handleEnableRipple,
  getSmartlist,
}) => {
  const classes = useStyles({
    color,
    disabled,
    squareIcon,
    hasActions: !!actions,
  });

  const handleFirstAction = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      !!actions && actions.length > 0 && actions[0].onClick?.();
    },
    [actions],
  );

  return (
    <div className={classes.title}>
      <div className={classes.upperTitle}>
        <div className={classes.flexIconAndText}>
          <div className={classes.losange}>
            <div className={classes.centerAbsolute}>
              {icon === 'TriggeredPerson' ? (
                <TriggeredPersonIcon fill={color} />
              ) : (
                <CustomMuiIcon
                  icon={icon}
                  customColor={color}
                  withBackground={false}
                  defaultBackGround
                  fadeIcon={disabled}
                />
              )}
            </div>
          </div>
          <Typography variant="subtitle2" className={classes.label}>
            {name}
          </Typography>
        </div>
        {!!actions && actions.length > 0 && (
          <div className={classes.actionSection}>
            {actions.length > 1 ? (
              <MultipleActionsMenuOnHover
                actionList={actions}
                optionOnClick={handleDisableRipple}
                optionOnLeave={handleEnableRipple}
              />
            ) : (
              <Tooltip title={actions[0].label}>
                <ButtonBase
                  onClick={handleFirstAction}
                  className={classes.button}
                >
                  <CustomMuiIcon
                    icon={actions[0].icon}
                    customColor={actions[0]?.customColor}
                    withBackground={false}
                    defaultBackGround
                  />
                </ButtonBase>
              </Tooltip>
            )}
          </div>
        )}
      </div>
      {!!triggerList && (
        <div className={classes.chipSection}>
          {triggerList.map((trigger, idx) => (
            <div className={classes.chip} key={idx}>
              <ConnectedTriggerChip
                trigger={trigger}
                getSmartlist={getSmartlist}
                color={disabled ? chroma(color).alpha(0.5).hex() : color}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  title: {
    display: 'absolute',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  upperTitle: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  flexIconAndText: {
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    width: '100%',
    maxWidth: ({ hasActions }) => hasActions && HEADER_MAX_WIDTH,
  },
  losange: {
    flexShrink: 0,
    position: 'relative',
    backgroundColor: ({ color }) =>
      chroma(color || theme.palette.primary.main)
        .alpha(0.09)
        .hex(),
    transform: ({ squareIcon }) => !squareIcon && 'rotate(45deg)',
    height: HEADER_ICON_SIZE,
    width: HEADER_ICON_SIZE,
    borderRadius: theme.spacing(0.5),
    margin: theme.spacing(1),
  },
  centerAbsolute: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: ({ squareIcon }) =>
      squareIcon
        ? 'translate(-45%,-45%)'
        : 'translate(-45%,-45%) rotate(-45deg)',
  },
  label: {
    fontSize: HEADER_FONT_SIZE,
    fontWeight: 'bold',
    overflow: 'hidden',
    display: '-webkit-box',
    whiteSpace: 'pre-wrap',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    textAlign: 'left',
    color: ({ disabled }) => (disabled ? theme.palette.grey[600] : 'default'),
  },
  actionSection: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  chipSection: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    gap: theme.spacing(2),
    width: '100%',
  },
  chip: {
    gap: theme.spacing(2),
  },
  button: {
    display: 'absolute',
    borderRadius: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: ({ color }) =>
        chroma(color || 'black')
          .alpha(0.06)
          .hex(),
    },
  },
}));

export default React.memo(CadenceNodeTitle);
