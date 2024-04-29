import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import type { ShopSupplier } from '#libs/shop/types';

type Props = {
  supplierList: ShopSupplier[];
  handleEditSupplier: (supplier: ShopSupplier) => void;
  handleSelectSupplierForDeletion: (supplier: ShopSupplier) => void;
};

const ShopSupplierTable: React.FC<Props> = ({
  supplierList,
  handleEditSupplier,
  handleSelectSupplierForDeletion,
}) => {
  const { t } = useTranslation('shop');

  const classes = useStyles();

  const onEditSupplier = useCallback(
    (supplier: ShopSupplier) => () => handleEditSupplier(supplier),
    [handleEditSupplier],
  );

  const onDeleteSupplier = useCallback(
    (supplier: ShopSupplier) => () => handleSelectSupplierForDeletion(supplier),
    [handleSelectSupplierForDeletion],
  );

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            {t('shopList.tab.settings.section.suppliers.table.name')}
          </TableCell>
          <TableCell>
            {t('shopList.tab.settings.section.suppliers.table.notes')}
          </TableCell>
          <TableCell>
            {t('shopList.tab.settings.section.suppliers.table.actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(supplierList || []).map((supplier) => (
          <TableRow key={supplier.id}>
            <TableCell scope="row">{supplier.name}</TableCell>
            <TableCell scope="row">{supplier.description}</TableCell>
            <TableCell className={classes.rowActions} scope="row">
              <Tooltip
                title={t(
                  'shopList.tab.settings.section.suppliers.table.action.edit',
                )}
              >
                <IconButton color="primary" onClick={onEditSupplier(supplier)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t(
                  'shopList.tab.settings.section.suppliers.table.action.delete',
                )}
              >
                <IconButton onClick={onDeleteSupplier(supplier)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const useStyles = makeStyles(() => ({
  rowActions: {
    display: 'flex',
  },
}));

export default React.memo(ShopSupplierTable);
