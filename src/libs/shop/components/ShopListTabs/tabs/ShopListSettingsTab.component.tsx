import React from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TabPanel from '@material-ui/lab/TabPanel';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import type { ShopSupplier } from '#libs/shop/types';

// @ts-expect-error
// eslint-disable-next-line
import { ShopListTab } from '#libs/shop/components/ShopListTabs/constants';

type Props = {
  isSupplierListLoading?: boolean;
  supplierList: ShopSupplier[];
  handleSelectSupplierForDeletion: (supplier: ShopSupplier) => () => void;
  handleEditSupplier: (supplier: ShopSupplier) => () => void;
  handleOpenSupplierModal: () => void;
};

const ShopListSettingsTab: React.FC<Props> = ({
  isSupplierListLoading,
  supplierList,
  handleSelectSupplierForDeletion,
  handleEditSupplier,
  handleOpenSupplierModal,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('shop');

  return (
    <TabPanel className={classes.contentContainer} value={ShopListTab.SETTINGS}>
      <Grid container className={classes.sectionContainer}>
        {isSupplierListLoading && <LinearProgress />}
        <Grid item>
          <Typography className={classes.sectionTitle} variant="h5">
            {t('shopList.tab.settings.section.suppliers.title')}
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
              <TableFooter>
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
                </div>
              </TableFooter>
            </Table>
          </Card>
        </Grid>
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
  },
  sectionTitle: {
    marginBottom: theme.spacing(1),
  },
  rowActions: {
    display: 'flex',
  },
  tableFooter: {
    padding: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(3),
  },
}));

export default React.memo(ShopListSettingsTab);
