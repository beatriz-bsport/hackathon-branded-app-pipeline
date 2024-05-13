import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from '@material-ui/lab/Pagination';
import TabPanel from '@material-ui/lab/TabPanel';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

import ShopSupplierTable from '#libs/shop/components/ShopSupplierTable';

import type { ShopSupplierTemplate } from '#libs/shop/types';

import { ShopListTab } from '#libs/shop/components/ShopListTabs/constants';
import { SHOP_SUPPLIER_PAGE_SIZE } from '#libs/shop/constants';

type Props = {
  isSupplierTemplateListLoading?: boolean;
  supplierTemplateList: ShopSupplierTemplate[];
  supplierTemplateListCount: number;
  supplierTemplateListPage: number;
  handleSelectSupplierTemplateForDeletion: (
    supplier: ShopSupplierTemplate,
  ) => void;
  handleEditSupplierTemplate: (supplier: ShopSupplierTemplate) => void;
  handleOpenSupplierTemplateModal: () => void;
  changeSupplierTemplatePage: (page: number) => void;
};

const FranchiseShopListSettingsTab: React.FC<Props> = ({
  isSupplierTemplateListLoading,
  supplierTemplateList,
  supplierTemplateListCount,
  supplierTemplateListPage,
  handleSelectSupplierTemplateForDeletion,
  handleEditSupplierTemplate,
  handleOpenSupplierTemplateModal,
  changeSupplierTemplatePage,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('shop');

  const handlePageChange = useCallback(
    (_: React.ChangeEvent, pageNumber: number) =>
      changeSupplierTemplatePage(pageNumber),
    [changeSupplierTemplatePage],
  );

  return (
    <TabPanel className={classes.contentContainer} value={ShopListTab.SETTINGS}>
      <Grid container className={classes.sectionContainer}>
        {isSupplierTemplateListLoading && <LinearProgress />}
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
            <ShopSupplierTable
              handleEditSupplier={handleEditSupplierTemplate}
              handleSelectSupplierForDeletion={
                handleSelectSupplierTemplateForDeletion
              }
              supplierList={supplierTemplateList}
            />

            <div className={classes.tableFooter}>
              <Button
                color="primary"
                onClick={handleOpenSupplierTemplateModal}
                startIcon={<AddIcon />}
                variant="outlined"
              >
                {t('shopList.tab.settings.section.suppliers.table.addSupplier')}
              </Button>

              <Pagination
                className={classes.paginationContainer}
                count={Math.ceil(
                  supplierTemplateListCount / SHOP_SUPPLIER_PAGE_SIZE,
                )}
                onChange={handlePageChange}
                page={supplierTemplateListPage}
              />
            </div>
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
}));

export default React.memo(FranchiseShopListSettingsTab);
