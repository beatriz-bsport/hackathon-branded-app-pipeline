import React, { useCallback, useState } from 'react';
import chroma from 'chroma-js';
import Immutable from 'seamless-immutable';

import makeStyles from '@material-ui/core/styles/makeStyles';
import type { Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CustomMuiIcon from '#src/components/icons/CustomMuiIcon.component';

import { MULTIPLE_ACTION_BUTTON_MAX_SIZE } from '#src/components/menu/constants';
import type { MenuAction } from '#src/components/menu/types';

type StylesProps = { color: string; open: boolean };

type Props = {
  actionList: Immutable.ImmutableArray<MenuAction> | MenuAction[];
  customIcon?: string;
  customColor?: string;
  optionOnClick?: () => void;
};

const MenuSelectorIconButton: React.FC<Props> = ({
  actionList,
  customIcon,
  customColor,
  optionOnClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const classes = useStyles({ color: customColor, open: Boolean(anchorEl) });

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const current = event.currentTarget;
      event.stopPropagation();
      event.preventDefault();
      optionOnClick?.();
      setAnchorEl(current);
    },
    [optionOnClick],
  );

  const handleRightClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      optionOnClick?.();
    },
    [optionOnClick],
  );

  const handleClickAway = useCallback(
    (event: React.MouseEvent<Document, MouseEvent>) => {
      event.stopPropagation();
      event.preventDefault();
      setAnchorEl(null);
    },
    [],
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
      <ClickAwayListener onClickAway={handleClickAway}>
        <ButtonBase
          className={classes.button}
          onClick={handleClick}
          onContextMenu={handleRightClick}
        >
          <CustomMuiIcon
            defaultBackGround
            customColor={customColor || 'black'}
            icon={customIcon || 'MoreVert'}
            withBackground={false}
          />
        </ButtonBase>
      </ClickAwayListener>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        getContentAnchorEl={null}
        id="action-menu"
        onClose={handleClickAway}
        open={!!anchorEl}
        PaperProps={{
          style: {
            marginTop: '4px',
          },
        }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {actionList.map((action, index) => (
          <MenuItem
            key={`${index}-${action.label}`}
            onClick={handleOnClickAction(action.onClick)}
            onContextMenu={handleRightClick}
            value={action.label}
          >
            <CustomMuiIcon
              defaultBackGround
              customColor={action.customColor || customColor}
              icon={action.icon}
              withBackground={false}
            />
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
    display: 'absolute',
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
    '&:hover': {
      backgroundColor: ({ color }) =>
        chroma(color || 'black')
          .alpha(0.06)
          .hex(),
    },
  },
  label: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

export default React.memo(MenuSelectorIconButton);
