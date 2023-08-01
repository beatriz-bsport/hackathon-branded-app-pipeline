import React from 'react';

import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import {
  BUYABLE_ITEM_COUPON,
  BUYABLE_ITEM_FEE,
} from '@bsport/common/lib/master-data/buyable-items';
import {
  Basket,
  CheckoutItem,
  OnRemoveCheckoutItemData,
  PrepaidLine,
} from '#libs/checkout/types';

import BasketTaxInfo from '../BasketTaxInfo.component';
import { getBasketTotalPriceExcludingTax } from '../../utils';
import { BillItem } from './BilllItem.component';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';

type PriceCountProps = {
  basket: Basket<string, PrepaidLine>;
  isDeleteButtonDisabled: boolean;
  isExcludingTax?: boolean;
  onRemoveCheckoutItem: (onRemoveItemdata: OnRemoveCheckoutItemData) => void;
  onRemoveInternalAccountPrepaidLine: () => void;
  prepaidLines: Array<PrepaidLine>;
};

export const PriceCount: React.FC<PriceCountProps> = ({
  basket,
  isDeleteButtonDisabled,
  isExcludingTax,
  onRemoveCheckoutItem,
  onRemoveInternalAccountPrepaidLine,
  prepaidLines,
}) => {
  const { t } = useTranslation('checkout');
  const classes = useStyles();

  const deliveryFeeItem = React.useMemo(
    () =>
      basket.checkout_items?.find(
        (checkoutItem) =>
          checkoutItem.buyable_item_identifier === BUYABLE_ITEM_FEE,
      ),
    [basket.checkout_items],
  );

  const discountItemList = React.useMemo(
    () =>
      basket.checkout_items?.filter(
        (checkoutItem) =>
          checkoutItem.buyable_item_identifier === BUYABLE_ITEM_COUPON,
      ),
    [basket.checkout_items],
  );

  const giftcardItemList = React.useMemo(
    () =>
      prepaidLines?.filter(
        (prepaidLine) => !!prepaidLine?.extra_data?.consumer_giftcard_id,
      ),
    [prepaidLines],
  );

  const internalAccountItem = React.useMemo(
    () =>
      prepaidLines?.find(
        (prepaidLine) => !!prepaidLine?.extra_data?.internal_account,
      ),
    [prepaidLines],
  );

  const basketPriceExcludingTax = getBasketTotalPriceExcludingTax(basket);
  const taxPrice = (
    parseFloat(basket.total_price) - parseFloat(basketPriceExcludingTax)
  ).toFixed(2);

  const handleRemoveDiscountItem = React.useCallback(
    (discountItem: CheckoutItem) =>
      discountItem.clearable
        ? () => {
            if (onRemoveCheckoutItem && discountItem.id)
              onRemoveCheckoutItem({
                checkout_item: discountItem.id,
                quantity: 1,
              });
          }
        : undefined,
    [onRemoveCheckoutItem],
  );

  return (
    <div className={classes.priceCountContainer}>
      {!!(deliveryFeeItem || discountItemList?.length) && (
        <>
          <div className={classes.subContainer}>
            {deliveryFeeItem && (
              <BillItem
                isBillItemPricePositive
                billItemName={t('payment.deliveryFee')}
                billItemPrice={getCurrencyDisplayWithPrice(
                  deliveryFeeItem.unit_price,
                  isExcludingTax,
                  deliveryFeeItem.tax,
                )}
                isDeleteButtonDisabled={isDeleteButtonDisabled}
              />
            )}
            {discountItemList.map((discountItem) => (
              <BillItem
                key={`discount-item-${discountItem.id}`}
                billItemName={discountItem.name}
                billItemPrice={getCurrencyDisplayWithPrice(
                  discountItem.unit_price,
                  isExcludingTax,
                  discountItem.tax,
                )}
                isBillItemPricePositive={false}
                isDeleteButtonDisabled={isDeleteButtonDisabled}
                onRemoveBillItem={handleRemoveDiscountItem(discountItem)}
              />
            ))}
          </div>
          <Divider className={classes.divider} variant="middle" />
        </>
      )}
      {isExcludingTax && (
        <>
          <BasketTaxInfo
            excludingTaxPrice={basketPriceExcludingTax}
            taxPrice={taxPrice}
          />
          <Divider className={classes.divider} variant="middle" />
        </>
      )}
      {!!(giftcardItemList?.length || internalAccountItem) && (
        <>
          <div className={classes.subContainer}>
            {giftcardItemList.map((giftcardItem) => (
              <BillItem
                key={`giftcard-item-${giftcardItem.id}`}
                billItemName={giftcardItem.name}
                billItemPrice={getCurrencyDisplayWithPrice(
                  -giftcardItem.unit_value,
                )}
                isBillItemPricePositive={false}
                isDeleteButtonDisabled={isDeleteButtonDisabled}
              />
            ))}
            {internalAccountItem && (
              <BillItem
                billItemName={t('payment.internalAccount')}
                billItemPrice={getCurrencyDisplayWithPrice(
                  -internalAccountItem.unit_value,
                )}
                isBillItemPricePositive={false}
                isDeleteButtonDisabled={isDeleteButtonDisabled}
                onRemoveBillItem={onRemoveInternalAccountPrepaidLine}
              />
            )}
          </div>
          <Divider className={classes.divider} variant="middle" />
        </>
      )}
      <div className={classes.totalPriceContainer}>
        <Typography className={classes.totalPriceText} variant="subtitle1">
          {isExcludingTax ? t('payment.total') : t('payment.totalHiddingTax')}
        </Typography>
        <Typography className={classes.totalPriceText} variant="subtitle1">
          {`${getCurrencyDisplayWithPrice(
            parseFloat(basket.total_price) -
              parseFloat(basket.total_price_prepaid_lines),
          )}`}
        </Typography>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  divider: {
    borderColor: theme.palette.grey[100],
    borderWidth: '1px',
    margin: theme.spacing(1),
  },
  priceCountContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    boxSizing: 'border-box',
    borderStyle: 'solid',
    borderWidth: '1px 1px 0 1px',
    borderColor: theme.palette.grey[100],
    padding: theme.spacing(1),
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    gap: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  totalPriceContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
  },
  totalPriceText: {
    fontWeight: 500,
  },
}));

export default React.memo(PriceCount);
