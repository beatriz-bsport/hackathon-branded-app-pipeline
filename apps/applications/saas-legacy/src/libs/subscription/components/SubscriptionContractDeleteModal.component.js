// @flow
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import RedButton from '../../../components/button/RedButton.component';

type Props = {
  contractToDeleteId: number,
  onClose: () => void,
  deleteContract: (id: number) => void,
};

export const ContractDeleteDialog = (props: Props) => {
  const deleteObject = (id) => {
    props.deleteContract(id);
    props.onClose();
  };
  const { t } = useTranslation(['subscription']);

  return (
    <div>
      <Dialog open={!!props.contractToDeleteId}>
        <DialogTitle>{t('contract.deleteForm.title')}</DialogTitle>
        <DialogContent>{t('contract.deleteForm.content')}</DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>
            {t('contract.deleteForm.actions.cancel')}
          </Button>
          <RedButton onClick={() => deleteObject(props.contractToDeleteId)}>
            {t('contract.deleteForm.actions.confirm')}
          </RedButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContractDeleteDialog;
