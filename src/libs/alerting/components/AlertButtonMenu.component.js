// @flow

import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import withStyles from '@material-ui/core/styles/withStyles';
import NotificationIcon from '@material-ui/icons/Notifications';
import { compose, withState } from 'recompose';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import type { Alerting } from '../types';
import AlertList from './AlertList.component';

type Props = {
  setDialogOpen: (Object) => void,
  dialogOpen: ?Object,
  nbAlerting: number,
  alertings: Array<Alerting>,
  pushRouter: (path: string) => void,
  classes: Object,
};

export function AlertButtonMenu(props: Props) {
  const {
    setDialogOpen,
    classes,
    dialogOpen,
    nbAlerting,
    alertings,
    pushRouter,
  } = props;
  return (
    <div>
      <IconButton
        onClick={(e) => {
          setDialogOpen(dialogOpen ? null : e.currentTarget);
        }}
      >
        <Badge badgeContent={nbAlerting || null} color="error">
          <NotificationIcon />
        </Badge>
      </IconButton>
      <Popper
        anchorEl={dialogOpen}
        open={!!dialogOpen}
        id={dialogOpen ? 'simple-popper' : null}
        style={{ color: 'red', zIndex: 10000 }}
        modifiers={{
          placement: 'bottom',
          disablePortal: true,
          preventOverflow: {
            enabled: true,
            boundariesElement: 'scrollParent',
          },
        }}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={250}>
            <Paper square className={classes.menuContainer}>
              <ClickAwayListener
                onClickAway={(e) => {
                  if (e.currentTarget === dialogOpen) {
                    return;
                  }
                  setDialogOpen(null);
                }}
              >
                <AlertList
                  alertings={alertings}
                  onClose={() => setDialogOpen(null)}
                  pushRouter={(path) => {
                    setDialogOpen(null);
                    pushRouter(path);
                  }}
                />
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
}

const styles = () => ({
  menuContainer: {
    width: 400,
    maxHeight: '60vh',
    overflowY: 'auto',
  },
});

export default compose(
  withStyles(styles),
  withState('dialogOpen', 'setDialogOpen', null),
  connect(
    null,
    { pushRouter: push },
  ),
)(AlertButtonMenu);
