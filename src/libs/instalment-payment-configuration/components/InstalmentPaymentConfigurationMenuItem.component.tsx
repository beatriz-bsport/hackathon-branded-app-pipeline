import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, ListItemText, MenuItem } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import { InstalmentPayment } from '../types';
import { generateInstalmentPaymentSecondaryText } from '../utils';
import GenericMuiDialog from '#components/genericDialog/GenericMuiDIalog';

type OwnProps = {
  instalmentPayment: InstalmentPayment;
  selected: boolean;
  onClickOnItem: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};
type Props = OwnProps;
export const InstalmentPaymentMenuItem: React.FC<Props> = (props) => {
  const { t } = useTranslation('instalmentPayment');
  const { instalmentPayment, selected, onClickOnItem, onEdit, onDelete } =
    props;
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false);
  if (!instalmentPayment?.id) {
    return null;
  }

  return (
    <>
      <MenuItem
        key={instalmentPayment.id}
        dense
        divider
        onClick={() => onClickOnItem(instalmentPayment.id)}
        selected={selected}
      >
        <ListItemText
          primary={instalmentPayment.name}
          secondary={generateInstalmentPaymentSecondaryText(
            t,
            instalmentPayment.recurrency,
            instalmentPayment.frequency,
            instalmentPayment.number_of_billing,
          )}
        />

        <IconButton
          color="primary"
          onClick={(event: React.MouseEvent) => {
            event.stopPropagation();
            onEdit(instalmentPayment.id);
          }}
        >
          <Edit />
        </IconButton>
        <IconButton>
          <Delete
            onClick={(event: React.MouseEvent) => {
              event.stopPropagation();
              setIsConfirmDeleteDialogOpen(true);
            }}
          />
        </IconButton>
      </MenuItem>
      <GenericMuiDialog
        confirmText={t('delete')}
        content={t('deleteDialog.content')}
        onCancel={() => setIsConfirmDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete(instalmentPayment.id);
          setIsConfirmDeleteDialogOpen(false);
        }}
        open={isConfirmDeleteDialogOpen}
        title={t('deleteDialog.title')}
      />
    </>
  );
};
export default InstalmentPaymentMenuItem;
