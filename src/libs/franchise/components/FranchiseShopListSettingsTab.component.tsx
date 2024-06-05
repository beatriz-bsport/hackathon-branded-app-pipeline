import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Pagination from '@material-ui/lab/Pagination';
import Switch from '@material-ui/core/Switch';
import TabPanel from '@material-ui/lab/TabPanel';
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';

import ShopSupplierTable from '#src/libs/shop/components/ShopSupplierTable';

import type { ShopSupplierTemplate } from '#src/libs/shop/types';

import { ShopListTab } from '#src/libs/shop/components/ShopListTabs/constants';
import { SHOP_SUPPLIER_PAGE_SIZE } from '#src/libs/shop/constants';

type Props = {
  isSupplierTemplateListLoading?: boolean;
  supplierTemplateList: ShopSupplierTemplate[];
  supplierTemplateListCount: number;
  supplierTemplateListPage: number;
  isFranchiseLoading?: boolean;
  isFranchiseeSupplierPriceHidden?: boolean;
  handleSelectSupplierTemplateForDeletion: (
    supplier: ShopSupplierTemplate,
  ) => void;
  handleEditSupplierTemplate: (supplier: ShopSupplierTemplate) => void;
  handleOpenSupplierTemplateModal: () => void;
  changeSupplierTemplatePage: (page: number) => void;
  changeHideShopSupplierPrice: (
    event: React.ChangeEvent<HTMLInputElement>,
    hideShopSupplierPriceForFranchisees: boolean,
  ) => void;
};

const FranchiseShopListSettingsTab: React.FC<Props> = ({
  isSupplierTemplateListLoading,
  supplierTemplateList,
  supplierTemplateListCount,
  supplierTemplateListPage,
  isFranchiseLoading,
  isFranchiseeSupplierPriceHidden,
  handleSelectSupplierTemplateForDeletion,
  handleEditSupplierTemplate,
  handleOpenSupplierTemplateModal,
  changeSupplierTemplatePage,
  changeHideShopSupplierPrice,
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

      <Card className={classes.supplierPriceSettingsContainer}>
        <Typography variant="h6">
          {t('shopList.tab.settings.section.supplierPrices.title')}
        </Typography>

        <div className={classes.supplierPriceSettingsList}>
          <FormControlLabel
            control={
              <Switch
                checked={isFranchiseeSupplierPriceHidden}
                color="primary"
                disabled={isFranchiseLoading}
                onChange={changeHideShopSupplierPrice}
              />
            }
            label={t(
              'shopList.tab.settings.section.supplierPrices.hideSupplierPricesForFranchisees',
            )}
          />
        </div>
      </Card>
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
  supplierPriceSettingsContainer: {
    padding: theme.spacing(3),
  },
  supplierPriceSettingsList: {
    paddingTop: theme.spacing(2),
  },
}));

export default React.memo(FranchiseShopListSettingsTab);
