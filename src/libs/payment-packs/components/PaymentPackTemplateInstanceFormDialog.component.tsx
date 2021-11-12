import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import { Form } from 'formik';
import PaymentPackTemplateInstanceForm, {
  PaymentPackTemplateInstanceFormikHOC,
} from './PaymentPackTemplateInstanceForm.component';

import { Submit } from '../../../components/forms';

type Props = {
  onClose: () => void;
  open?: boolean;
  isSubmitting?: boolean;
};

const PaymentPackTemplateInstanceFormDialog = (props: Props) => {
  const { t } = useTranslation(['paymentPack']);
  const classes = useStyles();
  const { isSubmitting } = props;
  return (
    <Dialog open={props.open}>
      <Form>
        <DialogTitle>{t('paymentPackTemplateInstance.form.title')}</DialogTitle>
        <DialogContent>
          <PaymentPackTemplateInstanceForm {...props} />
        </DialogContent>
        <DialogActions>
          <Button disabled={isSubmitting} onClick={props.onClose}>
            {t('paymentPackTemplateInstance.form.actions.close')}
          </Button>
          <Submit disabled={isSubmitting}>
            {isSubmitting && (
              <CircularProgress
                className={classes.progress}
                size={12}
                color="inherit"
              />
            )}
            {t('paymentPackTemplateInstance.form.actions.submit')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  progress: { marginRight: theme.spacing(1) },
}));

export default PaymentPackTemplateInstanceFormikHOC(
  PaymentPackTemplateInstanceFormDialog,
);
