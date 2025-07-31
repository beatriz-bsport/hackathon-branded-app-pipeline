import React, { useCallback, useState } from 'react';

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography';

import ShopItemUpdateProvisionDialog from '#src/libs/shop/components/ShopItemUpdateProvisionDialog';

import useShopItemDetailInventoryFilters from '#src/libs/shop/hooks/useShopItemDetailInventoryFilters';

import type {
  Provision,
  ProvisionCreate,
  ShopItem,
} from '#src/libs/shop/types';
import { ShopItemDetailInventoryFormType } from '#src/libs/shop/constants';
import type { OptionCallback } from '../../../../state/types';
import { SelectOption } from '#src/libs/types';

type Props = {
  formType: `${ShopItemDetailInventoryFormType}`;
  shopItem: ShopItem;
  shopItemVariantList: ShopItem[];
  isUpdatingVariant?: boolean;
  createShopItemProvision: (
    data: ProvisionCreate,
    options?: OptionCallback<Provision>,
  ) => void;
  changeEstablishmentBillingGroupFilter: (options: SelectOption) => void;
  establishmentBillingGroupFilterOptionList: SelectOption[];
  variantEstablishmentBillingGroupFilterOptionValue: SelectOption;
  isMultiLocationWebshopEnabled: boolean;
};

const ShopItemDetailInventoryListMobile: React.FC<Props> = ({
  formType,
  shopItem,
  shopItemVariantList,
  isUpdatingVariant,
  createShopItemProvision,
  changeEstablishmentBillingGroupFilter,
  establishmentBillingGroupFilterOptionList,
  variantEstablishmentBillingGroupFilterOptionValue,
  isMultiLocationWebshopEnabled,
}) => {
  const { t } = useTranslation('shop');

  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  const [isProvisionDialogOpen, setIsProvisionDialogOpen] = useState(false);

  const classes = useStyles();

  const {
    variantSizeFilterOptionList,
    variantColorFilterOptionList,
    filteredVariantList,
    handleFilterValueChange,
  } = useShopItemDetailInventoryFilters(shopItemVariantList);

  const shouldDisplayEstablishmentBillingGroupFilter =
    establishmentBillingGroupFilterOptionList.length > 0 &&
    isMultiLocationWebshopEnabled;

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
          shop_item: selectedVariant,
          qty: values.quantity,
          ...(shouldDisplayEstablishmentBillingGroupFilter
            ? {
                establishment_billing_group: Number(
                  variantEstablishmentBillingGroupFilterOptionValue.value,
                ),
              }
            : {}),
        },
        { onSuccess: handleCloseProvisionDialog },
      );
    },
    [
      createShopItemProvision,
      handleCloseProvisionDialog,
      selectedVariant,
      shouldDisplayEstablishmentBillingGroupFilter,
      variantEstablishmentBillingGroupFilterOptionValue.value,
    ],
  );

  return (
    <>
      {formType === ShopItemDetailInventoryFormType.VARIANTS && (
        <div
          className={clsx(
            classes.filtersContainer,
            classes.flexColumn,
            classes.flexGap,
          )}
        >
          <div
            className={clsx(classes.flexGap, {
              [classes.flexColumn]:
                shouldDisplayEstablishmentBillingGroupFilter,
            })}
          >
            {shouldDisplayEstablishmentBillingGroupFilter && (
              <Select
                className={classes.flexGrow}
                onChange={changeEstablishmentBillingGroupFilter}
                options={establishmentBillingGroupFilterOptionList}
                placeholder={t(
                  'shopItemDetail.table.inventory.filterPlaceholder.establishmentBillingGroup',
                )}
                value={variantEstablishmentBillingGroupFilterOptionValue}
              />
            )}
            <Select
              isClearable
              className={classes.flexGrow}
              onChange={handleFilterValueChange('size')}
              options={variantSizeFilterOptionList}
              placeholder={t(
                'shopItemDetail.table.inventory.filterPlaceholder.size',
              )}
            />
            <Select
              isClearable
              className={classes.flexGrow}
              onChange={handleFilterValueChange('color')}
              options={variantColorFilterOptionList}
              placeholder={t(
                'shopItemDetail.table.inventory.filterPlaceholder.color',
              )}
            />
          </div>
        </div>
      )}

      {formType === ShopItemDetailInventoryFormType.VARIANTS && (
        <List className={classes.listContainer}>
          {filteredVariantList.map((variant) => (
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

              <Button
                fullWidth
                color="primary"
                onClick={handleOpenProvisionDialog(variant.id)}
                variant="outlined"
              >
                {t('shopItemDetail.table.inventory.stockAdjustment')}
              </Button>
            </ListItem>
          ))}
        </List>
      )}

      {formType === ShopItemDetailInventoryFormType.STANDALONE && (
        <>
          {shouldDisplayEstablishmentBillingGroupFilter && (
            <Select
              className={classes.flexGrow}
              onChange={changeEstablishmentBillingGroupFilter}
              options={establishmentBillingGroupFilterOptionList}
              placeholder={t(
                'shopItemDetail.table.inventory.filterPlaceholder.establishmentBillingGroup',
              )}
              value={variantEstablishmentBillingGroupFilterOptionValue}
            />
          )}
          <List className={classes.listContainer}>
            <ListItem
              className={clsx(classes.listItemContainer, classes.flexColumn)}
            >
              <div className={classes.listItemDetails}>
                <Typography>{`${t(
                  'shopItemDetail.table.inventory.currentStock',
                )}: ${shopItem.current_stock}`}</Typography>
                <Typography>{`${t(
                  'shopItemDetail.table.inventory.totalSales',
                )}: ${shopItem.total_sales}`}</Typography>
              </div>

              <Button
                fullWidth
                color="primary"
                onClick={handleOpenProvisionDialog(shopItem.id)}
                variant="outlined"
              >
                {t('shopItemDetail.table.inventory.stockAdjustment')}
              </Button>
            </ListItem>
          </List>
        </>
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
}));

export default React.memo(ShopItemDetailInventoryListMobile);
