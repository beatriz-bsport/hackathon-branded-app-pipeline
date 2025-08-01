import React, { useCallback, useState } from 'react';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import ShopItemUpdateProvisionDialog from '#src/libs/shop/components/ShopItemUpdateProvisionDialog';

import type {
  Provision,
  ProvisionCreate,
  ShopItem,
} from '#src/libs/shop/types';
import type { OptionCallback } from '#src/state/types';
import type { SelectOption } from '#src/libs/types';

import { ShopItemDetailInventoryFormType } from '#src/libs/shop/constants';

type Props = {
  formType: `${ShopItemDetailInventoryFormType}`;
  shopItemTemplateInstanceList: ShopItem[];
  variantSizeFilterOptionList: SelectOption[];
  variantSizeFilterOptionValueList: SelectOption[];
  variantColorFilterOptionList: SelectOption[];
  variantColorFilterOptionValueList: SelectOption[];
  variantCompanyFilterOptionList: SelectOption[];
  variantCompanyFilterOptionValueList: SelectOption[];
  isUpdatingVariant?: boolean;
  createShopItemProvision: (
    data: ProvisionCreate,
    options?: OptionCallback<Provision>,
  ) => void;
  changeInventoryVariantFilter: (
    type: 'colors' | 'sizes' | 'company',
  ) => (options: SelectOption[]) => void;
};

const FranchiseShopItemDetailInventoryListMobile: React.FC<Props> = ({
  formType,
  shopItemTemplateInstanceList,
  variantSizeFilterOptionList,
  variantSizeFilterOptionValueList,
  variantColorFilterOptionList,
  variantColorFilterOptionValueList,
  variantCompanyFilterOptionList,
  variantCompanyFilterOptionValueList,
  isUpdatingVariant,
  createShopItemProvision,
  changeInventoryVariantFilter,
}) => {
  const { t } = useTranslation('shop');

  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  const [isProvisionDialogOpen, setIsProvisionDialogOpen] = useState(false);

  const classes = useStyles();

  const getListItemTitle = useCallback(
    (color: string, size: string) =>
      [color, size].filter((string) => !!string).join(' '),
    [],
  );

  const handleOpenProvisionDialog = useCallback(
    (id: number) => () => {
      setSelectedVariant(id);
      setIsProvisionDialogOpen(true);
    },
    [],
  );

  const handleCloseProvisionDialog = useCallback(
    () => setIsProvisionDialogOpen(false),
    [],
  );

  const handleSubmitProvisionForm = useCallback(
    (values: { quantity: number }) => {
      createShopItemProvision(
        {
          qty: values.quantity,
          shop_item: selectedVariant,
        },
        { onSuccess: handleCloseProvisionDialog },
      );
    },
    [createShopItemProvision, handleCloseProvisionDialog, selectedVariant],
  );

  return (
    <>
      <div
        className={clsx(
          classes.filtersContainer,
          classes.flexColumn,
          classes.flexGap,
        )}
      >
        <Select
          isClearable
          isMulti
          onChange={changeInventoryVariantFilter('company')}
          options={variantCompanyFilterOptionList}
          placeholder={t(
            'shopItemDetail.table.inventory.filterPlaceholder.company',
          )}
          value={variantCompanyFilterOptionValueList}
        />
        {formType === ShopItemDetailInventoryFormType.VARIANTS && (
          <div className={classes.flexGap}>
            <Select
              isClearable
              isMulti
              className={classes.flexGrow}
              onChange={changeInventoryVariantFilter('sizes')}
              options={variantSizeFilterOptionList}
              placeholder={t(
                'shopItemDetail.table.inventory.filterPlaceholder.size',
              )}
              value={variantSizeFilterOptionValueList}
            />
            <Select
              isClearable
              isMulti
              className={classes.flexGrow}
              onChange={changeInventoryVariantFilter('colors')}
              options={variantColorFilterOptionList}
              placeholder={t(
                'shopItemDetail.table.inventory.filterPlaceholder.color',
              )}
              value={variantColorFilterOptionValueList}
            />
          </div>
        )}
      </div>

      {formType === ShopItemDetailInventoryFormType.VARIANTS && (
        <List className={classes.listContainer}>
          {shopItemTemplateInstanceList.map((variant) => (
            <ListItem
              key={variant.id}
              className={clsx(classes.listItemContainer, classes.flexColumn)}
            >
              <Typography className={classes.listItemTitle}>
                {getListItemTitle(variant.color, variant.size)}
              </Typography>

              <div className={classes.listItemDetails}>
                <Typography>{`${t(
                  'shopItemDetail.table.inventory.currentStock',
                )}: ${variant.current_stock}`}</Typography>
                <Typography>{`${t(
                  'shopItemDetail.table.inventory.totalSales',
                )}: ${variant.total_sales}`}</Typography>
              </div>

              {!!variant.company_details.is_multi_location_webshop_enabled ? (
                <Tooltip
                  title={t(
                    'shopItemDetail.table.inventory.tooltipForMultiLocationWebshop',
                  )}
                >
                  <span className={classes.fullWidth}>
                    <Button
                      fullWidth
                      color="primary"
                      disabled={
                        !!variant.company_details
                          .is_multi_location_webshop_enabled
                      }
                      onClick={handleOpenProvisionDialog(variant.id)}
                      variant="outlined"
                    >
                      {t('shopItemDetail.table.inventory.stockAdjustment')}
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                <Button
                  fullWidth
                  color="primary"
                  onClick={handleOpenProvisionDialog(variant.id)}
                  variant="outlined"
                >
                  {t('shopItemDetail.table.inventory.stockAdjustment')}
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      )}

      {formType === ShopItemDetailInventoryFormType.STANDALONE && (
        <List className={classes.listContainer}>
          {(shopItemTemplateInstanceList ?? []).map((shopItem) => (
            <ListItem
              key={shopItem.id}
              className={clsx(classes.listItemContainer, classes.flexColumn)}
            >
              <Typography className={classes.listItemTitle}>
                {shopItem.company_details.name}
              </Typography>

              <div className={classes.listItemDetails}>
                <Typography>{`${t(
                  'shopItemDetail.table.inventory.currentStock',
                )}: ${shopItem.current_stock}`}</Typography>
                <Typography>{`${t(
                  'shopItemDetail.table.inventory.totalSales',
                )}: ${shopItem.total_sales}`}</Typography>
              </div>

              {!!shopItem.company_details.is_multi_location_webshop_enabled ? (
                <Tooltip
                  title={t(
                    'shopItemDetail.table.inventory.tooltipForMultiLocationWebshop',
                  )}
                >
                  <span className={classes.fullWidth}>
                    <Button
                      fullWidth
                      color="primary"
                      disabled={
                        !!shopItem.company_details
                          .is_multi_location_webshop_enabled
                      }
                      onClick={handleOpenProvisionDialog(shopItem.id)}
                      variant="outlined"
                    >
                      {t('shopItemDetail.table.inventory.stockAdjustment')}
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                <Button
                  fullWidth
                  color="primary"
                  onClick={handleOpenProvisionDialog(shopItem.id)}
                  variant="outlined"
                >
                  {t('shopItemDetail.table.inventory.stockAdjustment')}
                </Button>
              )}
            </ListItem>
          ))}
        </List>
      )}

      <ShopItemUpdateProvisionDialog
        isLoading={isUpdatingVariant}
        isOpen={!!selectedVariant && isProvisionDialogOpen}
        onClose={handleCloseProvisionDialog}
        onSubmit={handleSubmitProvisionForm}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  filtersContainer: {
    paddingBottom: theme.spacing(1),
  },
  listContainer: {
    padding: 0,
  },
  listItemContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    alignItems: 'flex-start',
    gap: theme.spacing(4),
    '&:not(:last-of-type)': {
      borderBottom: `solid ${theme.palette.grey[300]} 1px`,
    },
  },
  listItemTitle: {
    fontWeight: 700,
  },
  listItemDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  variantTextContainer: {
    flex: 1,
  },
  variantImage: {
    width: 48,
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexGap: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  flexGrow: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
}));

export default React.memo(FranchiseShopItemDetailInventoryListMobile);
