import React, { useCallback, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import DeliveryFeeDialogForm from '#src/libs/order/components/DeliveryFeeDialogForm.component';
import ShopListSettingsSupplierModal from '#src/libs/shop/components/ShopListSettingsSupplierModal';
import ShopSupplierDeleteConfirmModal from '#src/libs/shop/components/ShopSupplierDeleteConfirmModal';

import type {
  ShopSupplier,
  ShopSupplierCreate,
  ShopSupplierUpdate,
} from '#src/libs/shop/types';
import type { ShopListSettingsSupplierValues } from '#src/libs/shop/components/ShopListSettingsSupplierModal/types';
import type {
  DeliveryConfiguration,
  DeliveryFee,
  DeliveryFeeCreationOrUpdatePayload,
} from '#src/libs/order/types';
import type { OptionCallback } from '#src/state/types';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

import DeliveryFeeTable from '#src/libs/order/components/DeliveryFeeTable.component';
import OrderConfigurationForm from '#src/libs/order/components/OrderConfigurationForm.component';
import ShopSupplierTable from '#src/libs/shop/components/ShopSupplierTable';
import { SHOP_SUPPLIER_PAGE_SIZE } from '#src/libs/shop/constants';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

type Props = {
  supplierList: ShopSupplier[];
  supplierListCount: number;
  supplierListPage: number;
  deliveryConfiguration: DeliveryConfiguration;
  deliveryFees: DeliveryFee[];
  isSupplierListLoading: boolean;
  isOrderConfigurationLoading: boolean;
  isOrderConfigurationUpdateLoading: boolean;
  createSupplier: (
    values: ShopSupplierCreate,
    options?: OptionCallback<ShopSupplier>,
  ) => void;
  updateSupplier: (
    values: ShopSupplierUpdate,
    options?: OptionCallback<ShopSupplier>,
  ) => void;
  deleteSupplier: (id: number, options: OptionCallback<number>) => void;
  createOrUpdateDeliveryFee: (data: DeliveryFeeCreationOrUpdatePayload) => void;
  patchDeliveryFee: (data: DeliveryConfiguration) => void;
  disableDeliveryFee: (deliveryFee: DeliveryFee) => void;
  changeSupplierPage: (
    page: number,
    page_size?: number,
    options?: OptionCallback<ShopSupplier[]>,
  ) => void;
};

const ShopReworkedSettings: React.FC<Props> = ({
  supplierList,
  supplierListCount,
  supplierListPage,
  deliveryConfiguration,
  deliveryFees,
  isSupplierListLoading,
  isOrderConfigurationLoading,
  isOrderConfigurationUpdateLoading,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  createOrUpdateDeliveryFee,
  patchDeliveryFee,
  disableDeliveryFee,
  changeSupplierPage,
}) => {
  const { t } = useTranslation(['shop', 'order']);

  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const [isSupplierDeleteModalOpen, setIsSupplierDeleteModalOpen] =
    useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState<null | ShopSupplier>(
    null,
  );

  const [selectedDeliveryFee, setSelectedDeliveryFee] =
    useState<null | DeliveryFee>(null);

  const classes = useStyles();

  const [isDeliveryFeeModalOpen, setIsDeliveryFeeModalOpen] = useState(false);

  // --------------------------------------------------ACTIONS ON DELIVERY FEE--------------------------------------------------

  const handleOpenDeliveryFeeModal = useCallback(
    () => setIsDeliveryFeeModalOpen(true),
    [],
  );

  const handleCloseDeliveryFeeModal = useCallback(() => {
    setIsDeliveryFeeModalOpen(false);
    setSelectedDeliveryFee(null);
  }, []);

  const handleEditDeliveryFee = useCallback(
    (deliveryFee: DeliveryFee) => {
      setSelectedDeliveryFee(deliveryFee);
      handleOpenDeliveryFeeModal();
    },
    [handleOpenDeliveryFeeModal],
  );

  // --------------------------------------------------ACTIONS ON SUPPLIERS--------------------------------------------------

  const handleOpenSupplierDeleteModal = useCallback(
    () => setIsSupplierDeleteModalOpen(true),
    [],
  );

  const handleOpenSupplierModal = useCallback(
    () => setIsSupplierModalOpen(true),
    [],
  );

  const handleUnsetSupplier = useCallback(() => setSelectedSupplier(null), []);

  const handleCloseSupplierModal = useCallback(() => {
    setIsSupplierModalOpen(false);
    handleUnsetSupplier();
  }, [handleUnsetSupplier]);

  const handleSupplierSubmit = useCallback(
    (values: ShopListSettingsSupplierValues, hasInitial?: boolean) => {
      if (hasInitial) {
        updateSupplier(values as ShopSupplierUpdate, {
          onSuccess: () => {
            handleCloseSupplierModal();
            handleUnsetSupplier();
          },
        });
      } else {
        createSupplier(values as ShopSupplierCreate, {
          onSuccess: () => {
            handleCloseSupplierModal();
          },
        });
      }
    },
    [
      updateSupplier,
      handleCloseSupplierModal,
      handleUnsetSupplier,
      createSupplier,
    ],
  );

  const handleCloseSupplierDeleteModal = useCallback(() => {
    setIsSupplierDeleteModalOpen(false);
    handleUnsetSupplier();
  }, [handleUnsetSupplier]);

  const handleDeleteSupplier = useCallback(() => {
    deleteSupplier(selectedSupplier?.id, {
      onSuccess: () => {
        handleCloseSupplierDeleteModal();
      },
    });
  }, [deleteSupplier, handleCloseSupplierDeleteModal, selectedSupplier?.id]);

  const handleSelectSupplierForDeletion = useCallback(
    (supplier: ShopSupplier) => {
      setSelectedSupplier(supplier);
      handleOpenSupplierDeleteModal();
    },
    [handleOpenSupplierDeleteModal],
  );

  const handleEditSupplier = useCallback(
    (supplier: ShopSupplier) => {
      setSelectedSupplier(supplier);
      handleOpenSupplierModal();
    },
    [handleOpenSupplierModal],
  );

  const handlePageChange = useCallback(
    (_: React.ChangeEvent, pageNumber: number) => {
      changeSupplierPage(pageNumber);
    },
    [changeSupplierPage],
  );

  return (
    <div className={classes.container}>
      <Grid container className={classes.sectionContainer}>
        <Grid item>
          <Typography className={classes.sectionTitle} variant="h5">
            {t('order:configuration.deliveryFee')}
          </Typography>
        </Grid>

        <Grid item>
          <Divider className={classes.divider} />
        </Grid>

        <Paper className={classes.paper}>
          <div className={classes.paperInner}>
            {!isOrderConfigurationLoading ? (
              <OrderConfigurationForm
                // @ts-expect-error
                configuration={deliveryConfiguration}
                deliveryFees={deliveryFees}
                onSubmit={patchDeliveryFee}
                processing={isOrderConfigurationUpdateLoading}
              />
            ) : (
              <LinearProgress />
            )}
          </div>
        </Paper>

        <Paper className={classes.paper}>
          <DeliveryFeeTable
            deliveryFees={deliveryFees}
            onDelete={disableDeliveryFee}
            onEdit={handleEditDeliveryFee}
          />
          <ObjectLevelPermissionWrapper
            forcedBehavior="hidden"
            requiredPermission="product.shopReworked.allowed_actions.editSettings"
          >
            <div className={classes.paperInner}>
              <Button
                color="primary"
                onClick={handleOpenDeliveryFeeModal}
                variant="outlined"
              >
                <AddIcon className={classes.leftIcon} />
                {t('order:deliveryFee.forms.create')}
              </Button>
            </div>
          </ObjectLevelPermissionWrapper>
        </Paper>
      </Grid>

      <Grid container className={classes.sectionContainer}>
        {isSupplierListLoading && <LinearProgress />}
        <Grid item>
          <Typography className={classes.sectionTitle} variant="h5">
            {t('shop:shopList.tab.settings.section.suppliers.title')}
          </Typography>
        </Grid>

        <Grid item>
          <Divider className={classes.divider} />
        </Grid>

        <Grid item>
          <Card>
            <ShopSupplierTable
              handleEditSupplier={handleEditSupplier}
              handleSelectSupplierForDeletion={handleSelectSupplierForDeletion}
              supplierList={supplierList}
            />

            <div className={classes.tableFooter}>
              <ObjectLevelPermissionWrapper
                forcedBehavior="hidden"
                requiredPermission="product.shopReworked.allowed_actions.editSettings"
              >
                <Button
                  color="primary"
                  onClick={handleOpenSupplierModal}
                  startIcon={<AddIcon />}
                  variant="outlined"
                >
                  {t(
                    'shop:shopList.tab.settings.section.suppliers.table.addSupplier',
                  )}
                </Button>
              </ObjectLevelPermissionWrapper>

              <Pagination
                className={classes.paginationContainer}
                count={Math.ceil(supplierListCount / SHOP_SUPPLIER_PAGE_SIZE)}
                onChange={handlePageChange}
                page={supplierListPage}
              />
            </div>
          </Card>
        </Grid>
      </Grid>

      <ShopListSettingsSupplierModal
        handleCancel={handleCloseSupplierModal}
        handleSubmit={handleSupplierSubmit}
        initial={selectedSupplier}
        open={isSupplierModalOpen}
      />

      <ShopSupplierDeleteConfirmModal
        onCancel={handleCloseSupplierDeleteModal}
        onSubmit={handleDeleteSupplier}
        open={isSupplierDeleteModalOpen}
        supplierName={selectedSupplier?.name}
      />

      <DeliveryFeeDialogForm
        deliveryFee={selectedDeliveryFee}
        onClose={handleCloseDeliveryFeeModal}
        onSubmit={createOrUpdateDeliveryFee}
        open={isDeliveryFeeModalOpen}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: theme.spacing(16),
  },
  contentContainer: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  sectionContainer: {
    flexDirection: 'column',
    marginBottom: theme.spacing(3),
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  tableFooter: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(3),
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  // delivery fees old classes
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  paper: {
    marginBottom: theme.spacing(2),
  },
  paperInner: {
    padding: theme.spacing(2),
  },
}));

export default React.memo(ShopReworkedSettings);
