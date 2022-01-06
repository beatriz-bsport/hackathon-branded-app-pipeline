import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { OptionCallback } from '../../../../state/types';
import RedButton from '../../../../components/button/RedButton.component';
import { PrivatePassTemplate } from '../types';

type Props = {
  open?: boolean;
  onClose: () => void;
  onSubmit: (id: number, options: OptionCallback) => void;
  privatePassTemplate: PrivatePassTemplate;
  companyId: number;
};

const PrivatePassTemplateDeleteDialog = (props: Props) => {
  const { t } = useTranslation(['privateService']);

  const [processing, setProcessing] = React.useState(false);

  return (
    <Dialog open={props.open}>
      <DialogTitle>
        {t('privatePassTemplateInstance.deleteForm.title')}
      </DialogTitle>
      <DialogContent>
        {t('privatePassTemplateInstance.deleteForm.content')}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} disabled={processing}>
          {t('privatePassTemplateInstance.deleteForm.actions.close')}
        </Button>
        <RedButton
          disabled={processing}
          delayBeforeActivation={5}
          onClick={() =>
            props.onSubmit(
              props.privatePassTemplate.private_pass_template_instances.find(
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
          {t('privatePassTemplateInstance.deleteForm.actions.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default PrivatePassTemplateDeleteDialog;
