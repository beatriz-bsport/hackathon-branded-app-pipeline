import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Cached from '@material-ui/icons/Cached';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';

import { BUYABLE_ITEM_FEE } from '@bsport/common/lib/master-data/buyable-items.js';
import CustomMuiIcon from '#src/components/icons/CustomMuiIcon.component';
import { QuicksaleInterfaceModalColors } from '#src/libs/quicksale/constants';
import { BasketSummary } from '#src/libs/checkout/components/new-checkout-flow/BasketSummary.component';
import { getSubTotal } from '#src/libs/checkout/utils';
import { getCurrencyDisplayWithPrice } from '#src/libs/theme/selectors';
import type {
  Basket,
  CheckoutItemData,
  OnRemoveCheckoutItemData,
} from '#src/libs/checkout/types';
import type { Member } from '#src/libs/member/types';
import { formatAsDate, formatISOStringAsTime } from '#src/utils/datetime';

import useStyles from './styles';

type BasketNameProps = {
  member?: Member;
  canChangeMember?: boolean;
  openChangeMemberModal?: () => void;
};

export const BasketName: React.FC<BasketNameProps> = ({
  member,
  canChangeMember,
  openChangeMemberModal,
}) => {
  const { t } = useTranslation('quicksale');
  const isAnonymous = member?.is_pos;
  const isInteractive = canChangeMember && isAnonymous;
  const classes = useStyles({ isInteractive });

  const handleClick = useCallback(() => {
    if (isInteractive && openChangeMemberModal) {
      openChangeMemberModal();
    }
  }, [isInteractive, openChangeMemberModal]);

  return (
    <div
      className={classes.basketName}
      onClick={isInteractive ? handleClick : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      <Typography className={classes.basketNameTypography} variant="h6">
        {isAnonymous ? t('interface.anonymousSale') : member?.name || ''}
      </Typography>
      {isInteractive && (
        <Cached
          className={classes.nameIcon}
          style={{ color: QuicksaleInterfaceModalColors.Error }}
        />
      )}
    </div>
  );
};

type Props = {
  basket?: Basket;
  member?: Member;
  isExcludingTax?: boolean;
  addToBasket: (checkoutItemData: CheckoutItemData) => void;
  removeFromBasket: (removeData: OnRemoveCheckoutItemData) => void;
  openChangeMemberModal?: () => void;
  closeBasket: (basket: Basket) => void;
  onPaymentClick?: () => void;
};

const QuicksaleBasketPanel: React.FC<Props> = ({
  basket,
  member,
  isExcludingTax,
  addToBasket,
  removeFromBasket,
  openChangeMemberModal,
  closeBasket,
  onPaymentClick,
}) => {
  const { t } = useTranslation('quicksale');

  const canChangeMember = basket && !basket.invoice;
  const basketPriceExcludingTax = useMemo(() => {
    if (basket) {
      return getSubTotal(basket, true);
    }
    return '0';
  }, [basket]);

  const deliveryFee = useMemo(
    () =>
      (basket?.checkout_items ?? []).find(
        (checkoutItem) =>
          checkoutItem.buyable_item_identifier === BUYABLE_ITEM_FEE,
      ),
    [basket?.checkout_items],
  );

  const taxPrice = useMemo(() => {
    if (basket) {
      return (
        parseFloat(basket.total_price) -
        (deliveryFee?.unit_price ?? 0) -
        parseFloat(basketPriceExcludingTax)
      ).toFixed(2);
    }
    return '0';
  }, [basket, basketPriceExcludingTax, deliveryFee?.unit_price]);

  const classes = useStyles({});

  const closeCurrentBasket = useCallback(() => {
    if (basket) {
      closeBasket(basket);
    }
  }, [closeBasket, basket]);

  const checkoutItemsWithouDeliveryFee = useMemo(
    () =>
      (basket?.checkout_items ?? []).filter(
        (checkoutItem) =>
          checkoutItem.buyable_item_identifier !== BUYABLE_ITEM_FEE,
      ),
    [basket?.checkout_items],
  );

  if (!basket)
    return (
      <div className={classes.container}>
        <Alert className={classes.alert} severity="info" variant="outlined">
          {t('interface.selectItemToStart')}
        </Alert>
      </div>
    );

  return (
    <div className={classes.container}>
      <div className={classes.headerAndBody}>
        <div className={classes.header}>
          <div className={classes.headerActions}>
            <BasketName
              canChangeMember={canChangeMember}
              member={member}
              openChangeMemberModal={openChangeMemberModal}
            />

            <IconButton
              className={classes.closeIconButton}
              onClick={closeCurrentBasket}
            >
              <CustomMuiIcon
                customClassName={classes.closeIcon}
                customColor={QuicksaleInterfaceModalColors.Error}
                icon="Cancel"
              />
            </IconButton>
          </div>

          <div>
            <span className={classes.fontWeight500}>
              {`${formatAsDate(basket.date_created)} - ${formatISOStringAsTime(
                basket.date_created,
              )}`}
            </span>
          </div>
        </div>

        <Divider />

        <div className={classes.overflow}>
          <BasketSummary
            basketSummaryCheckoutItems={checkoutItemsWithouDeliveryFee}
            isExcludingTax={isExcludingTax}
            isItemEditionDisabled={false}
            onAddCheckoutItem={addToBasket}
            onRemoveCheckoutItem={removeFromBasket}
          />
        </div>
      </div>

      <div>
        <Divider />
        <div className={classes.footer}>
          <div className={classes.totalExcludingTax}>
            <Typography className={classes.color600} variant="body2">
              {t('interface.totalExcludingTax')}
            </Typography>
            <Typography className={classes.fontWeight500} variant="subtitle2">
              {getCurrencyDisplayWithPrice(basketPriceExcludingTax)}
            </Typography>
          </div>

          <div className={classes.taxes}>
            <Typography className={classes.color600} variant="body2">
              {t('interface.taxes')}
            </Typography>
            <Typography className={classes.fontWeight500} variant="subtitle2">
              {getCurrencyDisplayWithPrice(taxPrice)}
            </Typography>
          </div>

          <div className={classes.total}>
            <Typography className={classes.fontWeight500} variant="subtitle1">
              {t('interface.totalIncludingTax')}
            </Typography>
            <Typography className={classes.fontWeight500} variant="h6">
              {getCurrencyDisplayWithPrice(
                (
                  parseFloat(basket.total_price) -
                  (deliveryFee?.unit_price ?? 0)
                ).toFixed(2),
              )}
            </Typography>
          </div>

          <Button
            fullWidth
            className={classes.payButton}
            color="primary"
            disabled={!basket.checkout_items.length}
            onClick={onPaymentClick}
            variant="contained"
          >
            {t('interface.payment')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(QuicksaleBasketPanel);
