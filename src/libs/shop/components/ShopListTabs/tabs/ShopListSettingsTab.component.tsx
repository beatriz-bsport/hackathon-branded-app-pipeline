import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from '@material-ui/lab/Pagination';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TabPanel from '@material-ui/lab/TabPanel';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import DeliveryFeeTable from '#libs/order/components/DeliveryFeeTable.component';
import OrderConfigurationForm from '#libs/order/components/OrderConfigurationForm.component';

import type { DeliveryConfiguration, DeliveryFee } from '#libs/order/types';
import type { ShopSupplier } from '#libs/shop/types';
import type { OptionCallback } from '../../../../../state/types';

import { ShopListTab } from '#libs/shop/components/ShopListTabs/constants';
import { SHOP_SUPPLIER_PAGE_SIZE } from '#libs/shop/constants';

type Props = {
  isSupplierListLoading?: boolean;
  supplierList: ShopSupplier[];
  supplierListCount: number;
  supplierListPage: number;
  deliveryConfiguration: DeliveryConfiguration;
  deliveryFees: DeliveryFee[];
  isOrderConfigurationLoading?: boolean;
  isOrderConfigurationUpdateLoading?: boolean;
  handleSelectSupplierForDeletion: (supplier: ShopSupplier) => () => void;
  handleEditSupplier: (supplier: ShopSupplier) => () => void;
  handleOpenSupplierModal: () => void;
  handleOpenDeliveryFeeModal: () => void;
  handleEditDeliveryFee: (deliveryFee: DeliveryFee) => void;
  patchDeliveryFee: (data: DeliveryConfiguration) => void;
  disableDeliveryFee: (deliveryFee: DeliveryFee) => void;
  changeSupplierPage: (
    page: number,
    options?: OptionCallback<ShopSupplier[]>,
  ) => void;
};

const ShopListSettingsTab: React.FC<Props> = ({
  isSupplierListLoading,
  supplierList,
  supplierListCount,
  supplierListPage,
  deliveryConfiguration,
  deliveryFees,
  isOrderConfigurationLoading,
  isOrderConfigurationUpdateLoading,
  handleSelectSupplierForDeletion,
  handleEditSupplier,
  handleOpenDeliveryFeeModal,
  handleOpenSupplierModal,
  handleEditDeliveryFee,
  patchDeliveryFee,
  disableDeliveryFee,
  changeSupplierPage,
}) => {
  const classes = useStyles();

  const { t } = useTranslation(['shop', 'order']);

  const handlePageChange = useCallback(
    (_: React.ChangeEvent, pageNumber: number) => {
      changeSupplierPage(pageNumber);
    },
    [changeSupplierPage],
  );

  return (
    <TabPanel className={classes.contentContainer} value={ShopListTab.SETTINGS}>
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {t(
                      'shop:shopList.tab.settings.section.suppliers.table.name',
                    )}
                  </TableCell>
                  <TableCell>
                    {t(
                      'shop:shopList.tab.settings.section.suppliers.table.notes',
                    )}
                  </TableCell>
                  <TableCell>
                    {t(
                      'shop:shopList.tab.settings.section.suppliers.table.actions',
                    )}
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
                          'shop:shopList.tab.settings.section.suppliers.table.action.edit',
                        )}
                      >
                        <IconButton
                          color="primary"
                          onClick={handleEditSupplier(supplier)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={t(
                          'shop:shopList.tab.settings.section.suppliers.table.action.delete',
                        )}
                      >
                        <IconButton
                          onClick={handleSelectSupplierForDeletion(supplier)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className={classes.tableFooter}>
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

      <Grid container className={classes.sectionContainer}>
        {isOrderConfigurationLoading ? (
          <LinearProgress />
        ) : (
          <>
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
                <OrderConfigurationForm
                  // @ts-expect-error
                  configuration={deliveryConfiguration}
                  deliveryFees={deliveryFees}
                  onSubmit={patchDeliveryFee}
                  processing={isOrderConfigurationUpdateLoading}
                />
              </div>
            </Paper>

            <Paper className={classes.paper}>
              <DeliveryFeeTable
                deliveryFees={deliveryFees}
                onDelete={disableDeliveryFee}
                onEdit={handleEditDeliveryFee}
              />
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
            </Paper>
          </>
        )}
      </Grid>
    </TabPanel>
  );
};

const useStyles = makeStyles((theme) => ({
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
  rowActions: {
    display: 'flex',
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

export default React.memo(ShopListSettingsTab);
