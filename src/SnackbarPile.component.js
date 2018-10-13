// @flow

import React from 'react';

import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

type Props = {
  messages: { message: string }[],
  classes: *,
  t: TFunction,
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
    backgroundColor: amber[700],
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
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open
          >
            <SnackbarContent
              className={classes[snack.kind]}
              message={t(snack.message)}
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

export default translate()(
  withStyles(styles)(connect(mapStateToProps)(SnackbarPile)),
);
