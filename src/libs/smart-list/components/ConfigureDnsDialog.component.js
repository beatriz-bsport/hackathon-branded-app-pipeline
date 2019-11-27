// @flow
import React, { Component } from 'react';
// import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

import { withNamespaces } from 'react-i18next';
// import type { TFunction } from 'react-i18next';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import DialogTitle from '@material-ui/core/DialogTitle';
import { compose } from 'recompose';

type Props = {
  open: boolean,
  onClose: () => void,
};

export class ConfigureDnsDialog extends Component<Props> {
  render() {
    return (
      <Dialog open={this.props.open}>
        <DialogTitle> Paramètrage </DialogTitle>

        <DialogContent>
          {
            // eslint-disable-next-line
            "Votre email est configuré sur do-not-reply@bsport.io. Vous devez d'abord configurer l'envoi d'email depuis l'adresse de votre studio. Contactez votre chargé de compte bsport pour le configurer."
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose}>OK</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

// const styles = (theme) => ({});
export default compose(
  withNamespaces(['smartList']),
  // withStyles(styles),
)(ConfigureDnsDialog);
