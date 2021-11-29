// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import { withTranslation, TFunction } from 'react-i18next';
import { Form } from 'formik';
import { Submit } from '../../../components/forms';

import SubscriptionContractFields, {
  SubscriptionContractFormHoc,
} from './SubscriptionContractForm.component';

type Props = {
  t: TFunction,
  open: boolean,
  onClose: () => void,
  isSubmitting: boolean,
};
export const SubscriptionContractFormDialog = (props: Props) => {
  return (
    <Dialog open={props.open}>
      <Form>
        <DialogTitle>{props.t('contract.form.title')}</DialogTitle>
        <DialogContent>
          <SubscriptionContractFields {...props} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={props.onClose}
            color="secondary"
            disabled={props.isSubmitting}
          >
            {props.t('cancel')}
          </Button>
          <Submit disabled={props.isSubmitting}>{props.t('save')}</Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

const styles = () => ({
  container: {},
});

export default compose(
  withTranslation(['subscription']),
  withStyles(styles),
  SubscriptionContractFormHoc,
)(SubscriptionContractFormDialog);
