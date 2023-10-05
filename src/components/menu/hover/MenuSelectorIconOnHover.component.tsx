import React, { useCallback, useState } from 'react';
import chroma from 'chroma-js';
import Immutable from 'seamless-immutable';

import { makeStyles, type Theme } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import { MULTIPLE_ACTION_BUTTON_MAX_SIZE, type Action } from '../icon';
import { TriggeredPersonIcon } from '#components/icons/TriggeredPersonIcon.component';

type StylesProps = { color: string; open: boolean };

type Props = {
  actionList: Immutable.ImmutableArray<Action>;
  customIcon?: string;
  customColor?: string;
  optionOnClick?: () => void;
  optionOnLeave?: () => void;
};

const MenuSelectorIconOnHover: React.FC<Props> = ({
  actionList,
  customIcon,
  customColor,
  optionOnClick,
  optionOnLeave,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const classes = useStyles({ color: customColor, open: !!anchorEl });

  // ----- Prevent right click propagation -----

  const handleRightClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      optionOnClick?.();
    },
    [optionOnClick],
  );

  // -------------------------------------------

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const current = event.currentTarget;
      event.preventDefault();
      optionOnClick?.();
      setAnchorEl(current);
    },
    [optionOnClick],
  );

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLMenuElement>) => {
      event.preventDefault();
      optionOnLeave?.();
      setAnchorEl(null);
    },
    [optionOnLeave],
  );

  const handleClickAway = useCallback(
    (event: React.MouseEvent<Document, MouseEvent>) => {
      event.stopPropagation();
      event.preventDefault();
      optionOnLeave?.();
      setAnchorEl(null);
    },
    [optionOnLeave],
  );

  const handleOnClickAction = useCallback(
    (onClick: () => void) => (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();
      onClick?.();
    },
    [],
  );

  return (
    <div className={classes.container}>
      <div
        className={classes.button}
        onContextMenu={handleRightClick}
        onMouseEnter={handleMouseEnter}
      >
        <CustomMuiIcon
          defaultBackGround
          customColor={customColor || 'black'}
          icon={customIcon || 'MoreVert'}
          withBackground={false}
        />
      </div>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        getContentAnchorEl={null}
        id="action-menu"
        MenuListProps={{
          onMouseLeave: handleMouseLeave,
        }}
        onClose={handleClickAway}
        open={Boolean(anchorEl)}
        PaperProps={{
          style: {
            marginTop: '4px',
          },
        }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {actionList.map((action, index) => (
          <MenuItem
            key={`${index}${action.label}`}
            onClick={handleOnClickAction(action.onClick)}
            onContextMenu={handleRightClick}
            value={action.label}
          >
            {action.icon === 'TriggeredPerson' ? (
              <TriggeredPersonIcon fill={action.customColor || customColor} />
            ) : (
              <CustomMuiIcon
                defaultBackGround
                customColor={action.customColor || customColor}
                icon={action.icon}
                withBackground={false}
              />
            )}
            <Typography className={classes.label} variant="body1">
              {action.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

const useStyles = makeStyles<Theme, StylesProps>((theme) => ({
  container: {
    display: 'flex',
    borderRadius: theme.spacing(1),
  },
  button: {
    display: 'flex',
    borderRadius: theme.spacing(1),
    width: MULTIPLE_ACTION_BUTTON_MAX_SIZE,
    height: MULTIPLE_ACTION_BUTTON_MAX_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ({ open, color }) =>
      open &&
      chroma(color || 'black')
        .alpha(0.15)
        .hex(),
  },
  label: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export default React.memo(MenuSelectorIconOnHover);
