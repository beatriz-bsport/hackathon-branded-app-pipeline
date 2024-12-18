import React from 'react';

import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

type Props = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

const OfferFormTooltip = (props: Props) => {
  const { children, isOpen, onClose } = props;
  const { t } = useTranslation('common');

  return (
    <GenericResponsiveDialog
      noFullScreen
      maxWidth="xs"
      onClose={onClose}
      open={isOpen}
    >
      <DialogContent>
        <Typography>{children}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('close')}</Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};
export default OfferFormTooltip;
