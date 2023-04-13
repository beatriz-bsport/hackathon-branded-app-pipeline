import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

type Props = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

const OfferFormTooltip = (props: Props) => {
  const { children, isOpen, onClose } = props;
  const { t } = useTranslation('common');

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs">
      <DialogContent>
        <Typography>{children}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('close')}</Button>
      </DialogActions>
    </Dialog>
  );
};
export default OfferFormTooltip;
