import React, { useCallback, useState } from 'react';
import chroma from 'chroma-js';
import Immutable from 'seamless-immutable';

import { makeStyles, Theme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';

export type Action = {
  label: string;
  icon: string;
  onClick: () => void;
  customColor?: string;
};

export const MULTIPLE_ACTION_BUTTON_MAX_SIZE = '32px';

type StylesProps = { color: string; open: boolean };

export type MultipleActionsButtonProps = {
  actionList: Immutable.ImmutableArray<Action>;
  customIcon?: string;
  customColor?: string;
  optionOnClick?: () => void;
};

const MultipleActionsButton: React.FC<MultipleActionsButtonProps> = ({
  actionList,
  customIcon,
  customColor,
  optionOnClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const classes = useStyles({ color: customColor, open: Boolean(anchorEl) });

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      event.preventDefault();
      optionOnClick?.();
      setAnchorEl(event.currentTarget);
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
          onClick={handleClick}
          onContextMenu={handleRightClick}
          className={classes.button}
        >
          <CustomMuiIcon
            icon={customIcon || 'MoreVert'}
            customColor={customColor || 'black'}
            withBackground={false}
            defaultBackGround
          />
        </ButtonBase>
      </ClickAwayListener>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={Boolean(anchorEl)}
        onClose={handleClickAway}
        PaperProps={{
          style: {
            marginTop: '4px',
          },
        }}
      >
        {actionList.map((action, index) => (
          <MenuItem
            key={`${index}${action.label}`}
            value={action.label}
            onClick={handleOnClickAction(action.onClick)}
            onContextMenu={handleRightClick}
          >
            <CustomMuiIcon
              icon={action.icon}
              customColor={action.customColor || customColor}
              withBackground={false}
              defaultBackGround
            />
            <Typography variant="body1" className={classes.label}>
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

export default React.memo(MultipleActionsButton);
