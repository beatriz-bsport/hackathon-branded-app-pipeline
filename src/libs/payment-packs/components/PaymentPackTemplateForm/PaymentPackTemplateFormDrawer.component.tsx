import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import { Form } from 'formik';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import PaymentPackTemplateEditConfirmationDialog from '#src/libs/payment-packs/components/PaymentPackTemplateEditConfirmationDialog.component';
// @ts-expect-error
import { Submit } from '../../../../components/forms';
import PaymentPackTemplateForm, {
  PaymentPackTemplateFormikHOC,
} from './PaymentPackTemplateForm.component';

type Props = {
  open?: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  handleSubmit: () => void;
  isSubmitting?: boolean;
  setSubmitting: (isSubmitting: boolean) => void;
  isEditConfirmationDialogOpen?: boolean;
  setIsEditConfirmationDialogOpen?: (
    isEditConfirmationDialogOpen: boolean,
  ) => void;
};

const PaymentPackTemplateFormDrawer: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation(['paymentPack']);
  const classes = useStyles();
  const { isSubmitting } = props;

  const handleCloseEditConfirmationDialog = useCallback(() => {
    props.setIsEditConfirmationDialogOpen(false);
    props.setSubmitting(false);
  }, [props]);
  return (
    <GenericResponsiveDrawer
      onClose={props.onClose}
      open={props.open}
      title={t('paymentPackTemplate.form.title')}
    >
      <Form>
        {/* @ts-expect-error */}
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
        <PaymentPackTemplateEditConfirmationDialog
          onClose={handleCloseEditConfirmationDialog}
          onSubmit={props.handleSubmit}
          open={props.isEditConfirmationDialogOpen}
        />
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
