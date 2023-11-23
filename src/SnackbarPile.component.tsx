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

  const uniqTopMessages = React.useMemo(
    () =>
      uniq(topMessages?.map((snack) => snack.id))?.map((snackId) =>
        topMessages?.find((snack) => snack.id === snackId),
      ) ?? [],
    [topMessages],
  );

  const uniqBottomMessages = React.useMemo(
    () =>
      uniq(bottomMessages?.map((snack) => snack.id))?.map((snackId) =>
        bottomMessages?.find((snack) => snack.id === snackId),
      ) ?? [],
    [bottomMessages],
  );

  return (
    <div>
      {uniqTopMessages?.map((snack) => (
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
      {uniqBottomMessages?.map((snack) => (
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
