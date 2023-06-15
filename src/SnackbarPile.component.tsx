import React from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core';
import {
  deleteBottomSnackbar as deleteBottomSnackbarAction,
  deleteSnackbar,
} from './libs/snackbar/actions';
import type { Snack } from './libs/snackbar/types';
import { RootState } from './reducers';

type Props = {
  topMessages: Snack[];
  bottomMessages: Snack[];
  deleteTopSnackbar: (id: number) => void;
  deleteBottomSnackbar: (id: number) => void;
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
  deleteTopSnackbar,
  deleteBottomSnackbar,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['snackbar']);

  const handleDeleteTopSnackbar = React.useCallback(
    (snackbarId: number) => () => deleteTopSnackbar(snackbarId),
    [deleteTopSnackbar],
  );

  const handleDeleteBottomSnackbar = React.useCallback(
    (snackbarId: number) => () => deleteBottomSnackbar(snackbarId),
    [deleteBottomSnackbar],
  );

  return (
    <div>
      {topMessages.map((snack) => (
        <Snackbar
          key={snack.id}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open
        >
          <SnackbarContent
            className={classes[snack.kind]}
            message={t(snack.message)}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleDeleteTopSnackbar(snack.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          />
        </Snackbar>
      ))}
      {bottomMessages.map((snack) => (
        <Snackbar
          key={snack.id}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open
        >
          <SnackbarContent
            className={classes[`bottom${snack.kind}`]}
            message={
              <Alert
                severity={snack.kind}
                variant="filled"
                className={classes.bottomalert}
              >
                {t(snack.message)}
              </Alert>
            }
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleDeleteBottomSnackbar(snack.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
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
  };
}

const mapDispatchToProps = {
  deleteTopSnackbar: deleteSnackbar,
  deleteBottomSnackbar: deleteBottomSnackbarAction,
};

export const SnackbarDataProvider = [mapStateToProps, mapDispatchToProps];

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(SnackbarPile));
