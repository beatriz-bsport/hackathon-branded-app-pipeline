import React, { useCallback, useState } from 'react';
import chroma from 'chroma-js';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import {
  MULTIPLE_ACTION_BUTTON_MAX_SIZE,
  type Action,
} from './MultipleActionsButton.component';

type StylesProps = { color: string; open: boolean };

export type MultipleActionsMenuOnHoverProps = {
  actionList: Action[];
  customIcon?: string;
  customColor?: string;
  optionOnClick?: () => void;
};

const MultipleActionsMenuOnHover: React.FC<MultipleActionsMenuOnHoverProps> = ({
  actionList,
  customIcon,
  customColor,
  optionOnClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const classes = useStyles({ color: customColor, open: Boolean(anchorEl) });

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
      event.preventDefault();
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLMenuElement>) => {
      event.preventDefault();
      setAnchorEl(null);
    },
    [],
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
      <div
        onMouseEnter={handleMouseEnter}
        onContextMenu={handleRightClick}
        className={classes.button}
      >
        <CustomMuiIcon
          icon={customIcon || 'MoreVert'}
          customColor={customColor || 'black'}
          withBackground={false}
          defaultBackGround
        />
      </div>
      <Menu
        id="action-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={Boolean(anchorEl)}
        onClose={handleClickAway}
        MenuListProps={{
          onMouseLeave: handleMouseLeave,
        }}
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

export default React.memo(MultipleActionsMenuOnHover);
