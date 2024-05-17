import React from 'react';

import { compose } from 'recompose';

import { withTranslation, WithTranslation } from 'react-i18next';
import { Form } from 'formik';

import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
// @ts-expect-error
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
export function CoachPaymentRuleGroupFormDrawer(props: Props) {
  const { t, open, handleClose, isSubmitting } = props;
  return (
    <GenericResponsiveDrawer
      onClose={handleClose}
      open={open}
      title={t('coach_payment_rule_groups.dialogTitle')}
    >
      <Form>
        {/* @ts-expect-error */}
        <CoachPaymentRuleFormGroupFields {...props} />
        <DialogActions>
          <Button
            color="secondary"
            disabled={isSubmitting}
            onClick={handleClose}
          >
            {t('cancel')}
          </Button>
          <Submit disabled={isSubmitting} id="button_coach_remuneration_save">
            {t('save')}
          </Submit>
        </DialogActions>
      </Form>
    </GenericResponsiveDrawer>
  );
}

export default compose<any, OwnProps>(
  withTranslation(['paymentRules']),
  CoachPaymentRuleGroupFormHOC,
)(CoachPaymentRuleGroupFormDrawer);
