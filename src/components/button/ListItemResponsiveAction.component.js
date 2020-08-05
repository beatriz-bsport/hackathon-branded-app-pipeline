// @flow

import React from 'react';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';
import { MenuItem } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';

type Props = {
  actions: Array<Object>,
};

// ------------------------ Menu handler ---------------------

export default function ListItemResponsiveAction(props: Props) {
  return (
    <div>
      <Hidden xsDown>
        <ShortMenu actions={props.actions} />
      </Hidden>
      <Hidden smUp>
        <HiddenShortMenu actions={props.actions} />
      </Hidden>
    </div>
  );
}

// ------------------------ Explicit Menu --------------------------------------

function ShortMenu(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {props.actions
        .filter((o) => o && !!o.onClick && !o.iconButtonComponent)
        .map((option) => (
          <IconButton
            key={option.label}
            onClick={(ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              option.onClick();
            }}
            color={option.color}
          >
            <option.icon />
          </IconButton>
        ))}
      {props.actions
        .filter((o) => o && !!o.iconButtonComponent)
        .map((option) => (
          <option.iconButtonComponent
            onClick={() => {
              option.onClick();
            }}
            color={option.color}
          />
        ))}
    </div>
  );
}

// ------------------------Hidden  Menu -----------------------------
const ITEM_HEIGHT = 48;

function HiddenShortMenu(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  if (
    !props.actions.filter((o) => !!o && (!!o.onClick || !!o.menuItemComponent))
      .length
  ) {
    return null;
  }
  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="short-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {props.actions
          .filter((o) => o && !!o.onClick && !o.menuItemComponent)
          .map((option) => (
            <MenuItem
              onClick={(ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                option.onClick();
                setAnchorEl(null);
              }}
              key={option.label}
            >
              <ListItemIcon>
                <option.icon color={option.color} />
              </ListItemIcon>
              <Typography>{option.label}</Typography>
            </MenuItem>
          ))}
        {props.actions
          .filter((o) => o && !!o.menuItemComponent)
          .map((option) => (
            <option.menuItemComponent
              onClick={() => {
                option.onClick();
                setAnchorEl(null);
              }}
              color={option.color}
            />
          ))}
      </Menu>
    </div>
  );
}
