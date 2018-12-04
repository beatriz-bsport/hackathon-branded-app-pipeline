// @flow

import React from 'react';

import { withNamespaces } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default function withConfirm<T>(
  Component: React.Component<T>,
  handler: string,
  options: {},
): React.Component<T> {
  return withNamespaces()(
    class extends React.Component {
      state = {
        dialogOpen: false,
      };

      handleConfirm = () => {
        const { args } = this.state;
        this.props[handler](...args);
        this.setState({ dialogOpen: false, args: undefined });
      };

      handleCancel = () => {
        this.setState({ dialogOpen: false, args: undefined });
      };

      render() {
        const { t } = this.props;
        const mergedProps = {
          ...this.props,
          [handler]: (...args) => {
            this.setState({ dialogOpen: true, args });
          },
        };
        return (
          <div style={{ display: 'inline-block' }}>
            <Dialog open={this.state.dialogOpen}>
              <DialogTitle>{t(options.title)}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <options.Content t={t} />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.handleCancel}
                  color="primary"
                  variant="contained"
                >
                  {t(options.cancel)}
                </Button>
                <Button
                  onClick={this.handleConfirm}
                  color="secondary"
                  variant="contained"
                >
                  {t(options.confirm)}
                </Button>
              </DialogActions>
            </Dialog>
            <Component {...mergedProps} />
          </div>
        );
      }
    },
  );
}
