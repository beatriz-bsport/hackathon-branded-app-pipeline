// @flow

import React from 'react';
import { compose } from 'recompose';

import { Form } from 'formik';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Submit } from '../../../components/forms';

import PaymentComboFields, {
  PaymentComboFormHoc,
} from './PaymentComboForm.component';

type Props = {
  open: boolean,
  handleClose: () => void,
  onSubmit: (*) => void,
  isSubmitting: boolean,
  fullScreen?: boolean,
  t: TFunction,
  classes: Object,
};

export function PaymentComboFormDialog(props: Props) {
  const { t, open, handleClose, fullScreen, isSubmitting, classes } = props;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullScreen={fullScreen}
    >
      <Form>
        <div className={classes.content}>
          <DialogTitle id="form-dialog-title">{t('form.title')}</DialogTitle>
          <DialogContent>
            {open ? <PaymentComboFields {...props} /> : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={props.handleClose} disabled={isSubmitting}>
              {t('form.actions.cancel')}
            </Button>
            <Submit disabled={isSubmitting}>{t('form.actions.submit')}</Submit>
          </DialogActions>
        </div>
      </Form>
    </Dialog>
  );
}
const styles = () => ({
  content: {
    minWidth: '30vw',
  },
});

export default compose(
  withStyles(styles),
  withTranslation(['paymentCombo']),
  PaymentComboFormHoc,
)(PaymentComboFormDialog);
