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

import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import type { DeleteAlert } from '../types';
import AlertList from './AlertList.component';

type Props = {
  setDialogOpen: (dialogOpen: EventTarget) => void;
  dialogOpen?: EventTarget;
  nbAlerting: number;
  countAlertingCommunication: number;
  deleteAlert: DeleteAlert;
  showMore: (alert_kind: number) => void;
  overrideIcon: any;
  withCommunicationAlerts?: boolean;
};

const AlertButtonMenu: React.FC<Props> = (props) => {
  const { setDialogOpen, dialogOpen, nbAlerting, overrideIcon } = props;
  const dispatch = useDispatch();
  const pushRouter = (path: string) => {
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
        transition
        anchorEl={dialogOpen as Element}
        id={dialogOpen ? `simple-popper${overrideIcon}` : null}
        modifiers={{
          placement: 'bottom',
          disablePortal: true,
          preventOverflow: {
            enabled: true,
            boundariesElement: 'scrollParent',
          },
        }}
        open={!!dialogOpen}
        style={{ color: 'red', zIndex: 10000 }}
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
                <ObjectLevelPermissionProvider requiredPermission="billing.allowed_actions.readInvoices">
                  {(hasReadInvoicePermission: boolean) => (
                    <AlertList
                      deleteAlert={props.deleteAlert}
                      hasReadInvoicePermission={hasReadInvoicePermission}
                      onClose={() => setDialogOpen(null)}
                      pushRouter={(path) => {
                        setDialogOpen(null);
                        pushRouter(path);
                      }}
                      showMore={props.showMore}
                      totalCount={nbAlerting}
                      withCommunicationAlerts={!!props.withCommunicationAlerts}
                    />
                  )}
                </ObjectLevelPermissionProvider>
              </Paper>
            </ClickAwayListener>
          </Fade>
        )}
      </Popper>
    </div>
  );
};

const useStyles = makeStyles({
  menuContainer: {
    width: 400,
    maxHeight: '60vh',
    overflowY: 'auto',
  },
});

export default React.memo(AlertButtonMenu);
