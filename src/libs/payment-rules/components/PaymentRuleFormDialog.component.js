// @flow

import React from 'react';
import { compose } from 'recompose';

import { Form } from 'formik';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Submit } from '../../../components/forms';

import PaymentRuleFields, {
  PaymentRuleFormHoc,
} from './PaymentRuleForm.component';

type Props = {
  t: TFunction,
  open: boolean,
  handleClose: () => void,
  onSubmit: (*) => void,
  isSubmitting: boolean,
};

export function PaymentRuleSetFormDialog(props: Props) {
  const { t, open, handleClose, isSubmitting } = props;
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <Form>
        <DialogTitle id="form-dialog-title">{t('addNew')}</DialogTitle>
        <DialogContent>
          <PaymentRuleFields {...props} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.handleClose}
            color="secondary"
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          <Submit disabled={isSubmitting}>{t('save')}</Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

export default compose(
  withNamespaces(['paymentRules']),
  PaymentRuleFormHoc,
)(PaymentRuleSetFormDialog);
