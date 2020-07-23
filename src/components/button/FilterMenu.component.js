// @flow

import React from 'react';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { MenuItem } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FilterListIcon from '@material-ui/icons/FilterList';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ExpandMoreSharpIcon from '@material-ui/icons/ExpandMoreSharp';
import { compose } from 'redux';
import { withState } from 'recompose';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

type Props = {
  menu: any,

  anchorEl: any,
  setAnchorEl: any,
};

const ITEM_HEIGHT = 48;

export const FilterMenu = (props: Props) => {
  const { menu } = props;
  const classes = useStyles();
  const open = Boolean(props.anchorEl);

  // handling the open and close of the the main Menu
  const handleClick = (event) => {
    event.stopPropagation();
    props.setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    props.setAnchorEl(null);
  };
  const noFilter = menu.reduce(
    (acc, m) => acc && m.subMenu.filter((s) => s.show).length === 0,
    true,
  );
  return (
    <div className={classes.row}>
      <div>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <FilterListIcon />
        </IconButton>
        {noFilter && props.emptyLabel && (
          <Typography
            className={classes.emptyText}
            variant="caption"
            colot="textSecondary"
          >
            {props.emptyLabel}
          </Typography>
        )}
        <Menu
          id="short-menu"
          anchorEl={props.anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 6.5,
              width: '33ch',
            },
          }}
        >
          {menu.map((m) => (
            <div key={m.label}>
              <MenuItem
                dense
                className={m.openFunction && classes.subMenu}
                onClick={
                  m.openFunction
                    ? (ev) => {
                        ev.stopPropagation();
                        ev.preventDefault();
                        m.openFunction();
                      }
                    : (ev) => {
                        ev.stopPropagation();
                        ev.preventDefault();
                        m.onClick();
                        props.setAnchorEl(null);
                      }
                }
              >
                {!m.openFunction && (
                  <ListItemIcon>
                    <m.icon color="primary" />
                  </ListItemIcon>
                )}
                <Typography variant="inherit">{m.label}</Typography>
                {m.openFunction && !m.open && (
                  <ListItemIcon button>
                    <ExpandMoreSharpIcon color="primary" />
                  </ListItemIcon>
                )}
                {m.openFunction && m.open && (
                  <ListItemIcon button>
                    <ExpandLessIcon color="primary" />
                  </ListItemIcon>
                )}
              </MenuItem>
              <Collapse in={m.open}>
                <List subheader={<li />}>
                  {m.subMenu.map((s) => (
                    <ListItem
                      key={s.label}
                      button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        ev.preventDefault();
                        s.onClick();
                        props.setAnchorEl(null);
                        m.openFunction();
                      }}
                    >
                      <ListItemIcon>
                        <s.icon color="primary" />
                      </ListItemIcon>
                      <Typography variant="inherit">{s.label}</Typography>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </div>
          ))}
        </Menu>
      </div>
      <div className={classes.actionFilterList}>
        {menu.map((m) => (
          <div key={m.label}>
            {m.onClick ? (
              <div>
                {m.show && (
                  <Chip
                    icon={<m.icon />}
                    label={m.label}
                    onDelete={m.onDelete}
                    variant="outlined"
                    size="small"
                  />
                )}
              </div>
            ) : (
              <div className={classes.Filters}>
                {m.subMenu.map((s) => (
                  <div key={s.label}>
                    {s.show && (
                      <Chip
                        icon={<s.icon />}
                        label={s.label}
                        onDelete={s.onDelete}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  emptyText: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  subMenu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(0),
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  Filters: {
    flexWrap: 'wrap',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  actionFilterList: {
    flexWrap: 'wrap',
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'flex-start',
    maxWidth: '100%',
    '& > *': {
      margin: theme.spacing(1) / 2,
    },
  },
}));

export default compose(withState('anchorEl', 'setAnchorEl', null))(FilterMenu);
