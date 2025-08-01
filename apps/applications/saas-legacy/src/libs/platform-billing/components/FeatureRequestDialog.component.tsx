import React from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

type Props = {
  open: boolean;
  content?: string;
  onClose: () => void;
};

export const FeatureRequestDialog: React.FC<Props> = ({
  open,
  content,
  onClose,
}) => {
  const { t } = useTranslation(['platformBilling']);
  return (
    <Dialog disableEnforceFocus open={open}>
      <DialogTitle>{t('featureRequest.header')}</DialogTitle>
      <DialogContent>
        {content || t('featureRequest.interestMessageWithChat')}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('featureRequest.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(FeatureRequestDialog);
