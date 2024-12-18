// @flow
import React, { useEffect, useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withTranslation, TFunction } from 'react-i18next';

import { pure, compose } from 'recompose';

import RedButton from '../../../components/button/RedButton.component';
import { COUPON_DELETE_MODAL_COOLDOWN_SECONDS } from '../constants';

type Props = {
  t: TFunction,
  open: boolean,
  onSubmit: () => void,
  onClose: () => void,
};

export const CouponDeleteModal = (props: Props) => {
  const { t } = props;

  const [modalCountdown, setModalCountdown] = useState(
    COUPON_DELETE_MODAL_COOLDOWN_SECONDS,
  );

  useEffect(() => {
    if (props.open) {
      const intervalId = setInterval(() => {
        setModalCountdown((seconds) => seconds - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
    return setModalCountdown(COUPON_DELETE_MODAL_COOLDOWN_SECONDS);
  }, [props.open]);

  return (
    <Dialog open={props.open}>
      <DialogTitle>{t('modal.delete.title')}</DialogTitle>
      <DialogContent>{t('modal.delete.content')}</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t('modal.delete.actions.cancel')}
        </Button>
        <RedButton disabled={modalCountdown > 0} onClick={props.onSubmit}>
          {modalCountdown > 0
            ? modalCountdown
            : t('modal.delete.actions.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default compose(pure, withTranslation(['coupon']))(CouponDeleteModal);
