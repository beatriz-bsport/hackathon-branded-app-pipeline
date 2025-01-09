import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import { makeStyles, useTheme } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TabPanel from '@material-ui/lab/TabPanel';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';

import {
  CREDIT_ACCOUNT as PAYMENT_METHOD_CREDIT_ACCOUNT,
  CB as PAYMENT_METHOD_CB,
} from '@bsport/common/lib/master-data/payment-methods.js';

import CustomChip from '#src/components/chip/CustomChip.component';
import GenericCustomBooleanChip from '#src/components/chip/GenericCustomBooleanChip';

import { ShopItemDetailTab } from '#src/libs/shop/components/ShopItemDetail/constants';

type Props = {
  availablePaymentMethodIdentifiers: number[];
  barcode: string;
  isDeliverable: boolean;
  isFeatured: boolean;
  isMarketplaceEnabled: boolean;
  sellOnlyOnProvision: boolean;
  stockKeepingUnit: string;
  supplierName?: string;
  supplierPrice: string;
  tva: string;
  productHasVariants?: boolean;
  isSupplierPriceHidden?: boolean;
  handleOpenBarcodeModal: (barcode: string) => void;
};

type PaymentMethodsChipProps = {
  inStorePaymentAvailable: boolean;
  onlinePaymentAvailable: boolean;
};

/**
 * A component that renders 3 possible chips depending on `availablePaymentMethodIdentifiers` array values
 * @prop `availablePaymentMethodIdentifiers` The list of available payment methods for the shop item
 */
const PaymentMethodsChip: React.FC<PaymentMethodsChipProps> = ({
  inStorePaymentAvailable,
  onlinePaymentAvailable,
}) => {
  const theme = useTheme();
  const { t } = useTranslation('shop');

  if (inStorePaymentAvailable && onlinePaymentAvailable) {
    return (
      <CustomChip
        displayedValue={t(
          'shopItemDetail.table.settings.paymentMethodsChip.onlineInStore',
        )}
        icon="Payment"
        iconColor={theme.palette.info.main}
        mainColor={theme.palette.info.main}
      />
    );
  }

  if (inStorePaymentAvailable) {
    return (
      <CustomChip
        displayedValue={t(
          'shopItemDetail.table.settings.paymentMethodsChip.inStore',
        )}
        icon="StoreMallDirectory"
        iconColor={theme.palette.info.main}
        mainColor={theme.palette.info.main}
      />
    );
  }

  if (onlinePaymentAvailable) {
    return (
      <CustomChip
        displayedValue={t(
          'shopItemDetail.table.settings.paymentMethodsChip.online',
        )}
        icon="Devices"
        iconColor={theme.palette.info.main}
        mainColor={theme.palette.info.main}
      />
    );
  }

  return null;
};

const ShopItemDetailSettingsTab: React.FC<Props> = ({
  availablePaymentMethodIdentifiers,
  barcode,
  isDeliverable,
  isFeatured,
  isMarketplaceEnabled,
  sellOnlyOnProvision,
  stockKeepingUnit,
  supplierName,
  supplierPrice,
  tva,
  productHasVariants,
  isSupplierPriceHidden,
  handleOpenBarcodeModal,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('shop');

  const onShowBarcodeClick = useCallback(() => {
    handleOpenBarcodeModal(barcode);
  }, [barcode, handleOpenBarcodeModal]);

  const inStorePaymentAvailable = availablePaymentMethodIdentifiers.includes(
    PAYMENT_METHOD_CREDIT_ACCOUNT.id, // TO DOUBLE CHECK
  );
  const onlinePaymentAvailable = availablePaymentMethodIdentifiers.includes(
    PAYMENT_METHOD_CB.id,
  );

  return (
    <TabPanel
      className={classes.tabPanelContainer}
      value={ShopItemDetailTab.SETTINGS}
    >
      <List>
        <ListItem className={classes.listItem}>
          <Typography variant="subtitle2">
            {t('shopItemDetail.table.settings.supplier')}
          </Typography>
          <div className={classes.listItemValue}>{supplierName ?? 'N/A'}</div>
        </ListItem>

        <Divider />

        {!isSupplierPriceHidden && (
          <ListItem className={classes.listItem}>
            <Typography variant="subtitle2">
              {t('shopItemDetail.table.settings.supplierPrice')}
            </Typography>
            <div className={classes.listItemValue}>{supplierPrice}</div>
          </ListItem>
        )}

        <Divider />

        <ListItem className={classes.listItem}>
          <Typography variant="subtitle2">
            {t('shopItemDetail.table.settings.vat')}
          </Typography>
          <div className={classes.listItemValue}>
            {t('shopItemDetail.table.settings.vatValue', {
              vat: parseFloat(tva ?? '0').toFixed(2),
            })}
          </div>
        </ListItem>

        <Divider />

        <ListItem className={classes.listItem}>
          <Typography variant="subtitle2">
            {t('shopItemDetail.table.settings.availableOnline')}
          </Typography>
          <div className={classes.listItemValue}>
            <GenericCustomBooleanChip isTrue={isMarketplaceEnabled} />
          </div>
        </ListItem>

        {isMarketplaceEnabled && (
          <>
            <Divider />

            <ListItem className={classes.listItem}>
              <Typography variant="subtitle2">
                {t('shopItemDetail.table.settings.paymentMethods')}
              </Typography>
              <div className={classes.listItemValue}>
                <PaymentMethodsChip
                  inStorePaymentAvailable={inStorePaymentAvailable}
                  onlinePaymentAvailable={onlinePaymentAvailable}
                />
              </div>
            </ListItem>

            <Divider />

            <ListItem className={classes.listItem}>
              <Typography variant="subtitle2">
                {t('shopItemDetail.table.settings.sellOnlyOnProvision')}
              </Typography>
              <div className={classes.listItemValue}>
                <GenericCustomBooleanChip isTrue={sellOnlyOnProvision} />
              </div>
            </ListItem>

            <Divider />

            <ListItem className={classes.listItem}>
              <Typography variant="subtitle2">
                {t('shopItemDetail.table.settings.featured')}
              </Typography>
              <div className={classes.listItemValue}>
                <GenericCustomBooleanChip isTrue={isFeatured} />
              </div>
            </ListItem>

            <Divider />

            <ListItem className={classes.listItem}>
              <Typography variant="subtitle2">
                {t('shopItemDetail.table.settings.requiresDelivery')}
              </Typography>
              <div className={classes.listItemValue}>
                <GenericCustomBooleanChip isTrue={isDeliverable} />
              </div>
            </ListItem>
          </>
        )}

        {!productHasVariants && (
          <>
            <Divider />

            <ListItem className={classes.listItem}>
              <Typography variant="subtitle2">
                {t('shopItemDetail.table.settings.barcode')}
              </Typography>
              <div className={classes.listItemValue}>
                <span>{barcode}</span>
                <Tooltip
                  title={t('shopItemDetail.table.settings.barcodeTooltip')}
                >
                  <IconButton onClick={onShowBarcodeClick}>
                    <RemoveRedEyeIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </ListItem>
          </>
        )}

        {!productHasVariants && (
          <>
            <Divider />

            <ListItem className={classes.listItem}>
              <Typography variant="subtitle2">
                {t('shopItemDetail.table.settings.sku')}
              </Typography>
              <div className={classes.listItemValue}>{stockKeepingUnit}</div>
            </ListItem>
          </>
        )}
      </List>
    </TabPanel>
  );
};

const useStyles = makeStyles((theme) => ({
  tabPanelContainer: {
    padding: theme.spacing(2),
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${theme.spacing(3)}px ${theme.spacing(2)}px`,
  },
  listItemValue: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default React.memo(ShopItemDetailSettingsTab);
