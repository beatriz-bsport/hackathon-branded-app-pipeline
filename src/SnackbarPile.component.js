// @flow

import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { deleteSnackbar } from './actions/snackbar.actions';
import type { Snack } from './libs/snackbar/types';

type Props = {
  messages: Snack[],
  classes: *,
  t: TFunction,
  deleteSnackbar: (id: number) => void,
};

const styles = (theme) => ({
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
});

export class SnackbarPile extends React.Component<Props> {
  render() {
    const { classes, t } = this.props;
    return (
      <div>
        {this.props.messages.map((snack) => (
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
                  onClick={() => this.props.deleteSnackbar(snack.id)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
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
    messages: state.snackbar.messages,
  };
}

const mapDispatchToProps = {
  deleteSnackbar,
};

export default withTranslation(['snackbar'])(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(SnackbarPile),
  ),
);
