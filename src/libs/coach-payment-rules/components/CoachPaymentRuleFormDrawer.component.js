import React from 'react';
import { compose } from 'recompose';

import { withTranslation, TFunction } from 'react-i18next';
import { Form } from 'formik';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
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

export function CoachPaymentRuleFormDrawer(props: Props) {
  const { t, open, handleClose, isSubmitting } = props;
  return (
    <GenericResponsiveDrawer
      onClose={handleClose}
      open={open}
      title={t('coach_payment_rules.addNewCoachPaymentRule')}
    >
      <Form>
        <CoachPaymentRuleFields {...props} />
        <DialogActions>
          <Button
            color="secondary"
            disabled={isSubmitting}
            onClick={props.handleClose}
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

export default compose(
  withTranslation(['paymentRules']),
  CoachPaymentRuleFormHoc,
)(CoachPaymentRuleFormDrawer);
