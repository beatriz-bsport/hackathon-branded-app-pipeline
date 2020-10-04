// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Form } from 'formik';
import { Submit } from '../../../components/forms';

import RecurrenceRuleBookingFields, {
  RecurrenceRuleBookingFormikHOC,
} from './RecurrenceRuleBookingForm.component';

type Props = {
  onClose: () => void,
  isSubmitting: boolean,
};

export const RecurrenceRuleBookingFormDialog = (props: Props) => {
  const { t } = useTranslation(['booking']);
  return (
    <Dialog open>
      <DialogTitle>{t('recurrenceRule.form.title')}</DialogTitle>
      <Form>
        <DialogContent>
          <RecurrenceRuleBookingFields {...props} />
        </DialogContent>
        <DialogActions>
          <Button disabled={props.isSubmitting} onClick={props.onClose}>
            {t('recurrenceRule.actions.close')}
          </Button>
          <Submit disabled={props.isSubmitting}>
            {t('recurrenceRule.actions.save')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default RecurrenceRuleBookingFormikHOC(RecurrenceRuleBookingFormDialog);
