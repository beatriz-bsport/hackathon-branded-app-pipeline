import React, { useCallback } from 'react';
import chroma from 'chroma-js';
import Immutable from 'seamless-immutable';

import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import MenuSelectorIconButton from '#components/menu/icon';
import NestedMenuSelectorIconButton from '#components/menu/nested';
import ConnectedTriggerChip from '#libs/sequential_marketing/components/graph/chips/ConnectedTriggerChip.component';
import { isTriggerValid } from '#libs/sequential_marketing/components/helpers/utils';
import {
  HEADER_FONT_SIZE,
  HEADER_ICON_SIZE,
  HEADER_MAX_WIDTH,
} from '#libs/sequential_marketing/constants/steps';

import type { ConnectedTrigger } from '#libs/sequential_marketing/types';
import type { SmartList } from '#libs/smart-list/types';
import type { MenuAction, NestedMenuAction } from '#components/menu/types';

type StylesProps = {
  color: string;
  squareIcon?: boolean;
  hasActions?: boolean;
};

type Props = {
  icon: string;
  name: string;
  actions?: Immutable.ImmutableArray<MenuAction | NestedMenuAction>;
  customIconForActions?: string;
  disabled?: boolean;
  hasNestedActions?: boolean;
  triggerList?: ConnectedTrigger[];
  getSmartlist?: (id: number) => SmartList;
  handleDisableRipple?: () => void;
} & Omit<StylesProps, 'hasActions'>;

const CadenceNodeTitle: React.FC<Props> = ({
  actions,
  customIconForActions,
  hasNestedActions,
  color,
  disabled,
  icon,
  name,
  squareIcon,
  triggerList,
  getSmartlist,
  handleDisableRipple,
}) => {
  const classes = useStyles({
    color,
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
          <div className={classes.diamond}>
            <div className={classes.centerAbsolute}>
              <CustomMuiIcon
                defaultBackGround
                customColor={color}
                fadeIcon={disabled}
                icon={icon}
                withBackground={false}
              />
            </div>
          </div>
          <Typography
            className={classes.label}
            color={disabled ? 'textSecondary' : 'textPrimary'}
            variant="subtitle2"
          >
            {name}
          </Typography>
        </div>
        {!!actions && actions.length > 0 && (
          <div className={classes.actionSection}>
            {actions.length > 1 ? (
              <>
                {hasNestedActions ? (
                  <NestedMenuSelectorIconButton
                    actionList={actions}
                    customIcon={customIconForActions}
                    optionOnClick={handleDisableRipple}
                  />
                ) : (
                  <MenuSelectorIconButton
                    actionList={actions}
                    customIcon={customIconForActions}
                    optionOnClick={handleDisableRipple}
                  />
                )}
              </>
            ) : (
              <Tooltip title={actions[0].label}>
                <ButtonBase
                  className={classes.button}
                  onClick={handleFirstAction}
                >
                  <CustomMuiIcon
                    defaultBackGround
                    customColor={actions[0].customColor}
                    icon={actions[0].icon}
                    withBackground={false}
                  />
                </ButtonBase>
              </Tooltip>
            )}
          </div>
        )}
      </div>
      {!!triggerList &&
        (triggerList.length > 1 || isTriggerValid(triggerList[0])) && (
          <div className={classes.chipSection}>
            {triggerList.map((connectedTrigger) => (
              <div
                key={connectedTrigger.trigger_config.uuid}
                className={classes.chip}
              >
                <ConnectedTriggerChip
                  color={disabled ? chroma(color).alpha(0.5).hex() : color}
                  connectedTrigger={connectedTrigger}
                  disabled={disabled}
                  getSmartlist={getSmartlist}
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
  diamond: {
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
