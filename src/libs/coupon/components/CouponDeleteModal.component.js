// @flow
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { pure, compose } from 'recompose';

import RedButton from '../../../components/button/RedButton.component';

type Props = {
  t: TFunction,
  open: boolean,
  onSubmit: () => void,
  onClose: () => void,
};

export const CouponDeleteModal = (props: Props) => {
  const { t } = props;
  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('modal.delete.title')}</DialogTitle>
      <DialogContent>{t('modal.delete.content')}</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t('modal.delete.actions.cancel')}
        </Button>
        <RedButton onClick={props.onSubmit}>
          {t('modal.delete.actions.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default compose(pure, withTranslation(['coupon']))(CouponDeleteModal);
