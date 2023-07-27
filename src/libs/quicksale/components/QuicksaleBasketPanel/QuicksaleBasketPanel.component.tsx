import React from 'react';
import { useTranslation } from 'react-i18next';

import Avatar from '@material-ui/core/Avatar';
import Cached from '@material-ui/icons/Cached';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';

import CustomMuiIcon from '#components/icons/CustomMuiIcon.component';
import { QuicksaleInterfaceModalColors } from '#libs/quicksale/constants';
import { formatAsDate, formatAsTime } from '../../../../utils/datetime';
import { BasketSummary } from '#libs/checkout/components/new-checkout-flow/BasketSummary.component';
import { getBasketTotalPriceExcludingTax } from '#libs/checkout/utils';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import type {
  Basket,
  CheckoutItemData,
  OnRemoveCheckoutItemData,
} from '#libs/checkout/types';
import type { Member } from '#libs/member/types';

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
  const classes = useStyles({ canChangeMember });

  const { t } = useTranslation('quicksale');

  const stopPropagation = React.useCallback((e: React.KeyboardEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className={classes.basketName}
      role="button"
      tabIndex={0}
      onKeyDown={stopPropagation}
      onClick={canChangeMember ? openChangeMemberModal : undefined}
    >
      {!member?.is_pos && (
        <Avatar className={classes.avatar}>
          <img height={32} src={member?.photo} alt="member" />
        </Avatar>
      )}
      <Typography variant="h6" className={classes.basketNameTypography}>
        {!member?.is_pos ? member?.name : t('interface.anonymousSale')}
      </Typography>
      <Cached className={classes.nameIcon} />
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

  const classes = useStyles({ canChangeMember, basket });

  const closeCurrentBasket = React.useCallback(() => {
    closeBasket(basket);
  }, [closeBasket, basket]);

  if (!basket)
    return (
      <div className={classes.container}>
        <Alert severity="info" className={classes.alert} variant="outlined">
          {t('interface.selectItemToStart')}
        </Alert>
      </div>
    );

  const basketPriceExcludingTax = getBasketTotalPriceExcludingTax(basket);

  const taxPrice = (
    parseFloat(basket.total_price) - parseFloat(basketPriceExcludingTax)
  ).toFixed(2);

  return (
    <div className={classes.container}>
      <div className={classes.headerAndBody}>
        <div className={classes.header}>
          <div className={classes.headerActions}>
            <BasketName
              member={member}
              canChangeMember={canChangeMember}
              openChangeMemberModal={openChangeMemberModal}
            />

            <IconButton
              onClick={closeCurrentBasket}
              className={classes.closeIconButton}
            >
              <CustomMuiIcon
                icon="Cancel"
                customColor={QuicksaleInterfaceModalColors.Error}
                customClassName={classes.closeIcon}
              />
            </IconButton>
          </div>

          <div>
            <span className={classes.fontWeight500}>
              {`${formatAsDate(basket.date_created)} - ${formatAsTime(
                basket.date_created,
              )}`}
            </span>
          </div>
        </div>

        <Divider />

        <div className={classes.overflow}>
          <BasketSummary
            basketSummaryCheckoutItems={basket?.checkout_items ?? []}
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
            <Typography variant="body2" className={classes.color600}>
              {t('interface.totalExcludingTax')}
            </Typography>
            <Typography variant="subtitle2" className={classes.fontWeight500}>
              {getCurrencyDisplayWithPrice(basketPriceExcludingTax)}
            </Typography>
          </div>

          <div className={classes.taxes}>
            <Typography variant="body2" className={classes.color600}>
              {t('interface.taxes')}
            </Typography>
            <Typography variant="subtitle2" className={classes.fontWeight500}>
              {getCurrencyDisplayWithPrice(taxPrice)}
            </Typography>
          </div>

          <div className={classes.total}>
            <Typography variant="subtitle1" className={classes.fontWeight500}>
              {t('interface.totalIncludingTax')}
            </Typography>
            <Typography variant="h6" className={classes.fontWeight500}>
              {getCurrencyDisplayWithPrice(
                parseFloat(basket.total_price).toFixed(2),
              )}
            </Typography>
          </div>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.payButton}
            onClick={onPaymentClick}
          >
            {t('interface.payment')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(QuicksaleBasketPanel);
