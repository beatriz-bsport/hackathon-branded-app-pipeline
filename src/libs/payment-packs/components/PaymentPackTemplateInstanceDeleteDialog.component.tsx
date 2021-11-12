import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { OptionCallback } from '../../../state/types';
import RedButton from '../../../components/button/RedButton.component';
import { PaymentPackTemplate } from '../types';

type Props = {
  open?: boolean;
  onClose: () => void;
  onSubmit: (id: number, options: OptionCallback) => void;
  paymentPackTemplate: PaymentPackTemplate;
  companyId: number;
};

const PaymentPackTemplateDeleteDialog = (props: Props) => {
  const { t } = useTranslation(['paymentPack']);

  const [processing, setProcessing] = React.useState(false);

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        {t('paymentPackTemplateInstance.deleteForm.title')}
      </DialogTitle>
      <DialogContent>
        {t('paymentPackTemplateInstance.deleteForm.content')}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} disabled={processing}>
          {t('paymentPackTemplateInstance.deleteForm.actions.close')}
        </Button>
        <RedButton
          disabled={processing}
          delayBeforeActivation={5}
          onClick={() =>
            props.onSubmit(
              props.paymentPackTemplate.payment_pack_template_instances.find(
                (ppti) => ppti.company === props.companyId,
              ).id,
              {
                onSuccess: () => setProcessing(false),
                onError: () => setProcessing(false),
              },
            )
          }
        >
          {processing && (
            <CircularProgress
              style={{ marginRight: 12 }}
              color="inherit"
              size={12}
            />
          )}
          {t('paymentPackTemplateInstance.deleteForm.actions.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentPackTemplateDeleteDialog;
