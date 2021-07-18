import React from 'react';

import { compose } from 'recompose';

import { withTranslation, WithTranslation } from 'react-i18next';
import { Form } from 'formik';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Submit } from '../../../components/forms';

import CoachPaymentRuleFormGroupFields, {
  CoachPaymentRuleGroupFormHOC,
} from './coach-payment-rule-group-form/CoachPaymentRuleGroupForm.component';

type OwnProps = {
  open: boolean;
  handleClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
};
type Props = OwnProps & WithTranslation & {};
export function CoachPaymentRuleGroupFormDialog(props: Props) {
  const { t, open, handleClose, isSubmitting } = props;
  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <Form>
        <DialogTitle id="form-dialog-title">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {t('coach_payment_rule_groups.dialogTitle')}
          </div>
        </DialogTitle>

        <DialogContent>
          <CoachPaymentRuleFormGroupFields {...props} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
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

export default compose<any, OwnProps>(
  withTranslation(['paymentRules']),
  CoachPaymentRuleGroupFormHOC,
)(CoachPaymentRuleGroupFormDialog);
