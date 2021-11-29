// @flow

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { withTranslation, TFunction } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import amber from '@material-ui/core/colors/amber';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { deleteBackgroundSnackbar } from './actions/snackbar.actions';
import type { BackgroundSnack } from './libs/snackbar/types';

type Props = {
  backgroundMessages: BackgroundSnack[],
  classes: any,
  t: TFunction,
  deleteBackgroundSnackbar: (uuid: string) => void,
};

const styles = (theme) => ({
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
});

export class SnackbarBackgroundTask extends React.Component<Props> {
  render() {
    const { classes, t } = this.props;
    return (
      <div>
        {this.props.backgroundMessages.map((snack) => (
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
                      <CircularProgress
                        disableShrink
                        color="inherit"
                        size={30}
                      />
                    </div>
                  ) : null}
                  <div>
                    <IconButton
                      size="small"
                      aria-label="close"
                      color="inherit"
                      onClick={() =>
                        this.props.deleteBackgroundSnackbar(snack.uuid)
                      }
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
  }
}

function mapStateToProps(state) {
  return {
    backgroundMessages: state.snackbar.backgroundMessages,
  };
}

const mapDispatchToProps = {
  deleteBackgroundSnackbar,
};

export default withTranslation(['snackbar'])(
  withStyles(styles)(
    connect(mapStateToProps, mapDispatchToProps)(SnackbarBackgroundTask),
  ),
);
