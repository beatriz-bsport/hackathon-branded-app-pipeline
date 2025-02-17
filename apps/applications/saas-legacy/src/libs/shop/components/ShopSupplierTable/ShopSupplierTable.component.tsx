import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

import useIsTextExpandable from '#src/hooks/useIsTextExpandable';

import type { ShopSupplier, ShopSupplierTemplate } from '#src/libs/shop/types';

import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

type Props = {
  supplierList: ShopSupplier[] | ShopSupplierTemplate[];
  handleEditSupplier: (supplier: ShopSupplier | ShopSupplierTemplate) => void;
  handleSelectSupplierForDeletion: (
    supplier: ShopSupplier | ShopSupplierTemplate,
  ) => void;
};

type ShopSupplierListItemProps = {
  supplier: ShopSupplier | ShopSupplierTemplate;
  handleEditSupplier: (supplier: ShopSupplier | ShopSupplierTemplate) => void;
  handleSelectSupplierForDeletion: (
    supplier: ShopSupplier | ShopSupplierTemplate,
  ) => void;
  handleShowSupplierDetails: (
    supplier: ShopSupplier | ShopSupplierTemplate,
  ) => void;
  isMobile: boolean;
};

const ShopSupplierListItem: React.FC<ShopSupplierListItemProps> = React.memo(
  ({
    supplier,
    handleEditSupplier,
    handleSelectSupplierForDeletion,
    handleShowSupplierDetails,
    isMobile,
  }) => {
    const { t } = useTranslation('shop');
    const classes = useStyles();
    const descriptionText = useIsTextExpandable(false);
    const shouldShowDescriptionOnMobile = isMobile && supplier.description;

    const onShowSupplierDetails = useCallback(
      () => handleShowSupplierDetails(supplier),
      [handleShowSupplierDetails, supplier],
    );

    const onEditSupplier = useCallback(
      () => handleEditSupplier(supplier),
      [handleEditSupplier, supplier],
    );

    const onDeleteSupplier = useCallback(
      () => handleSelectSupplierForDeletion(supplier),
      [handleSelectSupplierForDeletion, supplier],
    );

    return (
      <TableRow key={supplier.id}>
        <TableCell className={classes.noWrap} scope="row">
          {supplier.name}
        </TableCell>
        {!isMobile && (
          <TableCell scope="row">
            <p ref={descriptionText.ref} className={classes.description}>
              {supplier.description}
            </p>
          </TableCell>
        )}
        <TableCell className={classes.rowActions} scope="row">
          <Tooltip
            className={
              descriptionText.isExpandable || shouldShowDescriptionOnMobile
                ? classes.visible
                : classes.hidden
            }
            title={t(
              'shopList.tab.settings.section.suppliers.table.action.showInfos',
            )}
          >
            <IconButton onClick={onShowSupplierDetails}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {!supplier?.supplier_template && (
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="product.shopReworked.allowed_actions.editSettings"
            >
              <>
                <Tooltip
                  title={t(
                    'shopList.tab.settings.section.suppliers.table.action.edit',
                  )}
                >
                  <IconButton color="primary" onClick={onEditSupplier}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={t(
                    'shopList.tab.settings.section.suppliers.table.action.delete',
                  )}
                >
                  <IconButton onClick={onDeleteSupplier}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            </ObjectLevelPermissionWrapper>
          )}
        </TableCell>
      </TableRow>
    );
  },
);

const ShopSupplierTable: React.FC<Props> = ({
  supplierList,
  handleEditSupplier,
  handleSelectSupplierForDeletion,
}) => {
  const classes = useStyles();

  const [selectedSupplier, setSelectedSupplier] = useState<ShopSupplier | null>(
    null,
  );
  const [isSupplierDetailsModalOpen, setIsSupplierDetailsModalOpen] =
    useState(false);
  const { t } = useTranslation(['common', 'shop']);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const handleShowSupplierDetails = useCallback((supplier: ShopSupplier) => {
    setSelectedSupplier(supplier);
    setIsSupplierDetailsModalOpen(true);
  }, []);

  const closeSupplierDetailsModal = useCallback(() => {
    setIsSupplierDetailsModalOpen(false);
  }, []);

  return (
    <Table>
      <GenericResponsiveDialog
        maxWidth="sm"
        onClose={closeSupplierDetailsModal}
        open={!!selectedSupplier && isSupplierDetailsModalOpen}
      >
        <DialogTitle>
          {t('shop:shopList.tab.settings.section.suppliers.detailsModal.title')}
          {selectedSupplier?.name}
        </DialogTitle>
        <DialogContent className={classes.descriptionDialog}>
          {selectedSupplier?.description}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSupplierDetailsModal}>
            {t('common:close')}
          </Button>
        </DialogActions>
      </GenericResponsiveDialog>

      <TableHead>
        <TableRow>
          <TableCell>
            {t('shop:shopList.tab.settings.section.suppliers.table.name')}
          </TableCell>
          {!isMobile && (
            <TableCell>
              {t('shop:shopList.tab.settings.section.suppliers.table.notes')}
            </TableCell>
          )}
          <TableCell>
            {t('shop:shopList.tab.settings.section.suppliers.table.actions')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {(supplierList || []).map((supplier) => (
          <ShopSupplierListItem
            key={supplier.id}
            handleEditSupplier={handleEditSupplier}
            handleSelectSupplierForDeletion={handleSelectSupplierForDeletion}
            handleShowSupplierDetails={handleShowSupplierDetails}
            isMobile={isMobile}
            supplier={supplier}
          />
        ))}
      </TableBody>
    </Table>
  );
};

const useStyles = makeStyles(() => ({
  description: {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 1,
    overflow: 'hidden',
    margin: 0,
  },
  rowActions: {
    display: 'flex',
  },
  noWrap: {
    whiteSpace: 'nowrap',
  },
  visible: {
    visibility: 'visible',
  },
  hidden: {
    visibility: 'hidden',
  },
  descriptionDialog: {
    whiteSpace: 'pre-wrap',
  },
}));

export default React.memo(ShopSupplierTable);
