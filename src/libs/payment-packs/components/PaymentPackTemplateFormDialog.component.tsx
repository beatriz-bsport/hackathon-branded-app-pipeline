import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Form } from 'formik';
import { Submit } from '../../../components/forms';

import PaymentPackTemplateForm, {
  PaymentPackTemplateFormikHOC,
} from './PaymentPackTemplateForm.component';

type Props = {
  open?: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
};

const PaymentPackTemplateFormDialog = (props: Props) => {
  const { t } = useTranslation(['paymentPack']);
  const classes = useStyles();
  const { isSubmitting } = props;

  return (
    <Dialog open={props.open}>
      <Form>
        <DialogTitle>{t('paymentPackTemplate.form.title')}</DialogTitle>
        <DialogContent>
          <PaymentPackTemplateForm {...props} />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} disabled={isSubmitting}>
            {t('paymentPackTemplate.form.actions.close')}
          </Button>
          <Submit disabled={isSubmitting}>
            {isSubmitting && (
              <CircularProgress
                className={classes.progress}
                size={12}
                color="inherit"
              />
            )}
            {t('paymentPackTemplate.form.actions.submit')}
          </Submit>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  progress: { marginRight: theme.spacing(1) },
}));

export default PaymentPackTemplateFormikHOC(PaymentPackTemplateFormDialog);
