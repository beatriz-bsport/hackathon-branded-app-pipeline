import React, { useCallback, useState } from 'react';
import chroma from 'chroma-js';
import Immutable from 'seamless-immutable';

import { makeStyles, type Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import type { Action } from '../icon';

type StylesProps = { color: string; open: boolean };

type Props = {
  actionList: Immutable.ImmutableArray<Action> | Action[];
  label: string;
  customColor?: string;
  optionOnClick?: () => void;
};

const MenuSelectorTextButton: React.FC<Props> = ({
  actionList,
  label,
  customColor,
  optionOnClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const classes = useStyles({ color: customColor, open: Boolean(anchorEl) });

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const current = event?.currentTarget;
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
        <Button className={classes.button} onClick={handleClick} variant="text">
          {label}
        </Button>
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
        {actionList.map((action) => (
          <MenuItem
            key={`${action.icon}_${action.label}`}
            onClick={handleOnClickAction(action.onClick)}
            onContextMenu={handleRightClick}
            value={action.label}
          >
            <CustomMuiIcon
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
    elevation: 5,
    borderRadius: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    fontWeight: 'bold',
    color: ({ color }) => color || 'black',
    backgroundColor: ({ open, color }) =>
      open &&
      chroma(color || 'black')
        .alpha(0.15)
        .hex(),
    '&:hover': {
      backgroundColor: ({ color }) =>
        chroma(color || 'black')
          .alpha(0.1)
          .hex(),
    },
  },
  label: {
    fontSize: '15.5px',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
}));

export default React.memo(MenuSelectorTextButton);
