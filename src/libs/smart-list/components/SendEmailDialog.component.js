// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

type Props = { open: boolean, onClose: () => void };
export const SendEmailDialog = (props: Props) => {
  return (
    <Dialog open={props.open}>
      <DialogTitle>Email groupé</DialogTitle>
      <DialogContent>
        {
          // eslint-disable-next-line
          "Votre email est configuré sur do-not-reply@bsport.io. Vous devez d'abord configurer l'envoi d'email depuis l'adresse de votre studio. Contactez votre chargé de compte bsport pour le configurer."
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendEmailDialog;
