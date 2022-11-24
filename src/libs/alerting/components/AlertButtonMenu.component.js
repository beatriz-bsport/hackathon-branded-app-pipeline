// @flow

import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import { makeStyles } from '@material-ui/core/styles';
import NotificationIcon from '@material-ui/icons/Notifications';
import { push } from 'connected-react-router';
// eslint-disable-next-line bsport/no-redux-in-component
import { useDispatch } from 'react-redux';

import type { AlertGroup, DeleteAlert } from '../types';
import AlertList from './AlertList.component';

type Props = {
  setDialogOpen: (Object) => void,

  dialogOpen: ?Object,
  nbAlerting: number,
  countAlertingCommunication: number,
  alertings: Array<AlertGroup>,
  deleteAlert: DeleteAlert,
  showMore: (alert_kind: number) => void,
  overrideIcon: any,
};

export default function AlertButtonMenu(props: Props) {
  const { setDialogOpen, dialogOpen, nbAlerting, alertings, overrideIcon } =
    props;
  const dispatch = useDispatch();
  const pushRouter = (path) => {
    dispatch(push(path));
  };
  const classes = useStyles();
  const Icon = overrideIcon || NotificationIcon;
  return (
    <div>
      <IconButton
        onClick={(e) => {
          setDialogOpen(dialogOpen ? null : e.currentTarget);
        }}
      >
        <Badge badgeContent={nbAlerting || null} color="error">
          <Icon />
        </Badge>
      </IconButton>
      <Popper
        anchorEl={dialogOpen}
        open={!!dialogOpen}
        id={dialogOpen ? `simple-popper${overrideIcon}` : null}
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
            <ClickAwayListener
              onClickAway={(e) => {
                if (e.currentTarget === dialogOpen) {
                  return;
                }
                setDialogOpen(null);
              }}
            >
              <Paper square className={classes.menuContainer}>
                <AlertList
                  alertings={alertings}
                  totalCount={nbAlerting}
                  onClose={() => setDialogOpen(null)}
                  showMore={props.showMore}
                  deleteAlert={props.deleteAlert}
                  pushRouter={(path) => {
                    setDialogOpen(null);
                    pushRouter(path);
                  }}
                />
              </Paper>
            </ClickAwayListener>
          </Fade>
        )}
      </Popper>
    </div>
  );
}

const useStyles = makeStyles({
  menuContainer: {
    width: 400,
    maxHeight: '60vh',
    overflowY: 'auto',
  },
});
