import React from 'react';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';

type Props = {
  open?: boolean;
  supplierName: string;
  onCancel: () => void;
  onSubmit: () => void;
};

const ShopSupplierDeleteConfirmModal: React.FC<Props> = ({
  open,
  supplierName,
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslation(['shop', 'common']);

  return (
    <GenericResponsiveDialog maxWidth="sm" open={open}>
      <DialogTitle>
        {t('shop:shopList.tab.settings.section.suppliers.deleteModal.title', {
          supplierName,
        })}
      </DialogTitle>
      <DialogContent>
        {t('shop:shopList.tab.settings.section.suppliers.deleteModal.message')}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('common:cancel')}</Button>
        <Button color="primary" onClick={onSubmit}>
          {t('common:confirm')}
        </Button>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

export default React.memo(ShopSupplierDeleteConfirmModal);
