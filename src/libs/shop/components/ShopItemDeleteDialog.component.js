// @flow
import React from 'react';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import RedButton from '../../../components/button/RedButton.component';

import type { ShopItem } from '../types';

type Props = {
  onSubmit: () => void,
  shopitem: ShopItem,
  onCancel: () => void,
  t: TFunction,
};

export function ShopItemDeleteDialog(props: Props) {
  const { onSubmit, onCancel, t, shopitem } = props;
  return (
    <React.Fragment>
      <DialogTitle id="alert-dialog-title">
        {t('dialog.delete.title', { shopitem })}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('dialog.delete.explain')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="secondary">
          {t('dialog.delete.cancel')}
        </Button>
        <RedButton onClick={onSubmit} color="primary" autoFocus>
          {t('dialog.delete.confirm')}
        </RedButton>
      </DialogActions>
    </React.Fragment>
  );
}

export default withTranslation(['shop'])(ShopItemDeleteDialog);
