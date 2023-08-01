// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import { Form } from 'formik';
import { Submit } from '../../../../components/forms';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import PaymentPackTemplateForm, {
  PaymentPackTemplateFormikHOC,
} from './PaymentPackTemplateForm.component';

type Props = {
  open?: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
};

const PaymentPackTemplateFormDrawer: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation(['paymentPack']);
  const classes = useStyles();
  const { isSubmitting } = props;

  return (
    <GenericResponsiveDrawer
      onClose={props.onClose}
      open={props.open}
      title={t('paymentPackTemplate.form.title')}
    >
      <Form>
        <PaymentPackTemplateForm {...props} />
        <DialogActions className={classes.actions}>
          <Button disabled={isSubmitting} onClick={props.onClose}>
            {t('paymentPackTemplate.form.actions.close')}
          </Button>
          <Submit disabled={isSubmitting}>
            {isSubmitting && (
              <CircularProgress
                className={classes.progress}
                color="inherit"
                size={12}
              />
            )}
            {t('paymentPackTemplate.form.actions.submit')}
          </Submit>
        </DialogActions>
      </Form>
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  progress: {
    marginRight: theme.spacing(1),
  },
  actions: {
    paddingBottom: theme.spacing(2),
  },
}));

export default PaymentPackTemplateFormikHOC(PaymentPackTemplateFormDrawer);
