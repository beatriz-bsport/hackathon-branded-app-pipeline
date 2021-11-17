// @flow

import React from 'react';

import { makeStyles, Theme } from '@material-ui/core/styles';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import amber from '@material-ui/core/colors/amber';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import { RootState } from '../../../reducers';
import { deleteBackgroundSnackbar } from '../../snackbar/actions.ts';
import { BackgroundSnack } from '../../snackbar/types';

type Props = {
  backgroundMessages: BackgroundSnack[];
  deleteBackgroundSnackbar: (uuid: string) => void;
} & ConnectedProps<typeof connector>;

const useStyles = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  pending: {
    backgroundColor: blue[800],
  },
  warning: {
    backgroundColor: amber[900],
  },
  circularProgress: {
    color: 'white',
    marginLeft: theme.spacing(1.5),
    marginRight: theme.spacing(1.5),
  },
  snackContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const SnackbarBackgroundTask = (props: Props) => {
  const { t } = useTranslation(['snackbar']);
  const classes = useStyles();

  return (
    <div>
      {props.backgroundMessages.map((snack: BackgroundSnack) => (
        <Snackbar
          key={snack.uuid}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open
        >
          <SnackbarContent
            className={classes[snack.kind]}
            message={t(snack.backgroundMessage)}
            action={
              <div className={classes.snackContainer}>
                {snack.kind === 'pending' ? (
                  <div className={classes.circularProgress}>
                    <CircularProgress disableShrink color="inherit" size={30} />
                  </div>
                ) : null}
                <div>
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={() => props.deleteBackgroundSnackbar(snack.uuid)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            }
          />
        </Snackbar>
      ))}
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    backgroundMessages: state.snackbar.backgroundMessages,
  }),
  {
    deleteBackgroundSnackbar,
  },
);

export default connector(SnackbarBackgroundTask);
