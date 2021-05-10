import React from 'react';
import { compose } from 'recompose';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { Form } from 'formik';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CoachPaymentRuleFields, {
  CoachPaymentRuleFormHoc,
} from './coach-payment-rule-form/CoachPaymentRuleForm.component';
import { Submit } from '../../../components/forms';

type Props = {
  t: TFunction,
  open: boolean,
  handleClose: () => void,
  onSubmit: (data: any) => void,
  isSubmitting: boolean,
};

export function CoachPaymentRuleFormDialog(props: Props) {
  const { t, open, handleClose, isSubmitting } = props;
  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
      <Form>
        <DialogTitle id="form-dialog-title">
          {t('coach_payment_rules.addNewCoachPaymentRule')}
        </DialogTitle>
        <DialogContent>
          <CoachPaymentRuleFields {...props} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.handleClose}
            color="secondary"
            disabled={isSubmitting}
          >
            {t('cancel')}
          </Button>
          <Submit id="button_coach_remuneration_save" disabled={isSubmitting}>
            {t('save')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
}

export default compose(
  withTranslation(['paymentRules']),
  CoachPaymentRuleFormHoc,
)(CoachPaymentRuleFormDialog);
