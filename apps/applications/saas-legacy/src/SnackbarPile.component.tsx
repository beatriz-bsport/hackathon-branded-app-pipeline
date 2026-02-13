import React from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import uniq from 'lodash/uniq';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core';
import AccessControlSnackBar from '#src/libs/access-control/components/AccessControlSnackBar/AccessControlSnackBar.component';
import { getPerformAccessMonitoringUrl } from '#src/libs/access-control/utils';
import {
  deleteAccessControlSnackbar as deleteAccessControlSnackbarAction,
  deleteBottomSnackbar as deleteBottomSnackbarAction,
  deleteSnackbar,
} from './libs/snackbar/actions';
import { RootState } from './reducers';

import type { AccessControlSnack, Snack } from './libs/snackbar/types';
import { openNewBackOfficeWindow } from './utils/windows';

type Props = {
  topMessages: Snack[];
  bottomMessages: Snack[];
  accessControlMessages: AccessControlSnack[];
  deleteTopSnackbar: (id: number) => void;
  deleteBottomSnackbar: (id: number) => void;
  deleteAccessControlSnackbar: (id: number) => void;
};

const useStyles = makeStyles((theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[900],
  },
  bottomsuccess: {
    backgroundColor: theme.palette.success.main,
  },
  bottomerror: {
    backgroundColor: theme.palette.error.main,
  },
  bottominfo: {
    backgroundColor: theme.palette.info.main,
  },
  bottomwarning: {
    backgroundColor: theme.palette.warning.main,
  },
  bottomalert: {
    padding: 0,
  },
}));

export const SnackbarPile: React.FC<Props> = ({
  topMessages,
  bottomMessages,
  accessControlMessages,
  deleteTopSnackbar,
  deleteBottomSnackbar,
  deleteAccessControlSnackbar,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('snackbar');

  const handleDeleteTopSnackbar = React.useCallback(
    (snackbarId: number) => () => deleteTopSnackbar(snackbarId),
    [deleteTopSnackbar],
  );

  const handleDeleteBottomSnackbar = React.useCallback(
    (snackbarId: number) => () => deleteBottomSnackbar(snackbarId),
    [deleteBottomSnackbar],
  );

  const handleDeleteAccessControlSnackbar = React.useCallback(
    (snackbarId: number) => () => deleteAccessControlSnackbar(snackbarId),
    [deleteAccessControlSnackbar],
  );

  const uniqTopMessages = React.useMemo(
    () =>
      uniq(topMessages?.map((snack) => snack.id))
        ?.map((snackId) => topMessages?.find((snack) => snack.id === snackId))
        .filter((snack) => !!snack) ?? [],
    [topMessages],
  );

  const uniqBottomMessages = React.useMemo(
    () =>
      uniq(bottomMessages?.map((snack) => snack.id))
        ?.map((snackId) =>
          bottomMessages?.find((snack) => snack.id === snackId),
        )
        .filter((snack) => !!snack) ?? [],
    [bottomMessages],
  );

  const uniqAccessControlMessages = React.useMemo(
    () =>
      uniq(accessControlMessages?.map((snack) => snack.id))
        ?.map((snackId) =>
          accessControlMessages?.find((snack) => snack.id === snackId),
        )
        .filter((snack) => !!snack) ?? [],
    [accessControlMessages],
  );

  return (
    <div>
      {uniqTopMessages.map((snack) => (
        <Snackbar
          key={`topMessage-${snack.id}-${snack.message}`}
          open
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <SnackbarContent
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                onClick={handleDeleteTopSnackbar(snack.id)}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            className={classes[snack.kind]}
            message={t(snack.message)}
          />
        </Snackbar>
      ))}

      {uniqAccessControlMessages.map((snack) => (
        <AccessControlSnackBar
          key={`accessControlMessage-${snack.id}`}
          open
          accessStatus={snack.accessStatus}
          handleClose={handleDeleteAccessControlSnackbar(snack.id)}
          handleOpen={() =>
            openNewBackOfficeWindow(
              getPerformAccessMonitoringUrl({ id: snack.id }),
            )
          }
          member={snack.member}
        />
      ))}

      {uniqBottomMessages.map((snack) => (
        <Snackbar
          key={`bottomMessage-${snack.id}-${snack.message}`}
          open
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <SnackbarContent
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                onClick={handleDeleteBottomSnackbar(snack.id)}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            className={classes[`bottom${snack.kind}`]}
            message={
              <Alert
                className={classes.bottomalert}
                severity={snack.kind}
                variant="filled"
              >
                {t(snack.message)}
              </Alert>
            }
          />
        </Snackbar>
      ))}
    </div>
  );
};

function mapStateToProps(state: RootState) {
  return {
    topMessages: state.snackbar.topMessages,
    bottomMessages: state.snackbar.bottomMessages,
    accessControlMessages: state.snackbar.accessControlMessages,
  };
}

const mapDispatchToProps = {
  deleteTopSnackbar: deleteSnackbar,
  deleteBottomSnackbar: deleteBottomSnackbarAction,
  deleteAccessControlSnackbar: deleteAccessControlSnackbarAction,
};

// Unused export used in bsport-widget
export const SnackbarDataProvider = [mapStateToProps, mapDispatchToProps];

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(SnackbarPile));
