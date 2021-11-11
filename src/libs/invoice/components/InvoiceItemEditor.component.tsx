import React, { useCallback, useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';

import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_GIFTCARD,
  BUYABLE_ITEM_CREDIT,
} from '@bsport/common/lib/master-data/buyable-items';

import PriceInput from '../../../components/input/PriceInput.component';
import NumberInput from '../../../components/input/NumericInput.component';
import PaymentPackSelector from '../../payment-packs/components/PaymentPackSelector.component';
import PrivatePassSelector from '../../private-service/components/pass/PrivatePassSelector.component';
import PaymentComboSelector from '../../payment-combo/components/PaymentComboSelector.component';
import GiftcardSelector from '../../giftcard/components/GiftcardSelector.component';
import ShopItemSelector from '../../shop/components/ShopItemSelector.component';
import withConfirm from '../../../hocs/with-confirm.hoc';
import { paymentPackTagsAndMemberTagsCompatibilty } from '../../payment-packs/utils';

type BuyableItemProps = {
  buyableItemIdentifier: number;
  value?: number;
  availableBuyableItems: { [key: string]: any };
  onSelect?: any;
};

const BuyableItemSelector = (props: BuyableItemProps) => {
  switch (props.buyableItemIdentifier) {
    case BUYABLE_ITEM_PASS:
      return (
        <PaymentPackSelector
          autofocus
          value={props.value}
          paymentPacks={
            props.availableBuyableItems[props.buyableItemIdentifier]
          }
          onChange={(buyableItem) => props.onSelect(buyableItem)}
        />
      );
    case BUYABLE_ITEM_SHOP_ITEM:
      return (
        <ShopItemSelector
          autofocus
          value={props.value}
          shopItemList={
            props.availableBuyableItems[props.buyableItemIdentifier]
          }
          onChange={(buyableItem) => props.onSelect(buyableItem)}
        />
      );
    case BUYABLE_ITEM_PRIVATE_PASS:
      return (
        <PrivatePassSelector
          autofocus
          value={props.value}
          privatePassList={
            props.availableBuyableItems[props.buyableItemIdentifier]
          }
          onChange={(buyableItem) => props.onSelect(buyableItem)}
        />
      );
    case BUYABLE_ITEM_COMBO_ITEM:
      return (
        <PaymentComboSelector
          autofocus
          value={props.value}
          paymentComboList={
            props.availableBuyableItems[props.buyableItemIdentifier]
          }
          onChange={(buyableItem) => props.onSelect(buyableItem)}
        />
      );
    case BUYABLE_ITEM_GIFTCARD:
      return (
        <GiftcardSelector
          autofocus
          value={props.value}
          giftcardList={
            props.availableBuyableItems[props.buyableItemIdentifier]
          }
          onChange={(buyableItem) => props.onSelect(buyableItem)}
        />
      );
    default:
      return null;
  }
};

type Props = {
  onAddBuyableItem: (buyableItemIdentifier: number, buyableItem: any) => void;
  availableBuyableItems: { [buyableItemIdentifier: number]: Array<any> };
  member: { credit_account_balance: number };
};

const getPriceForItem = (item: any, identifier: number) => {
  if (identifier === BUYABLE_ITEM_PASS) {
    return item.base_price;
  }
  if (
    [
      BUYABLE_ITEM_SHOP_ITEM,
      BUYABLE_ITEM_PRIVATE_PASS,
      BUYABLE_ITEM_COMBO_ITEM,
      BUYABLE_ITEM_GIFTCARD,
    ].includes(identifier)
  ) {
    return item.price;
  }

  return 0;
};

const ButtonAddWithWarning = withConfirm(Button, 'onClick', {
  title: 'invoice:invoicePaymentPackTagWarningDialog.title',
  cancel: 'invoice:invoicePaymentPackTagWarningDialog.cancel',
  confirm: 'invoice:invoicePaymentPackTagWarningDialog.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('invoice:invoicePaymentPackTagWarningDialog.content')}</p>
  ),
});

// TODO Types BuyableItem
const InvoiceItemEditor = (props: Props) => {
  const { onAddBuyableItem, availableBuyableItems, member } = props;
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);

  const [buyableItemIdentifier, setBuyableItemIdentifier] =
    useState(BUYABLE_ITEM_PASS);
  const [buyableItemId, setBuyableItemId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [voucher, setVoucher] = useState(null);
  const [voucherPercent, setVoucherPercent] = useState(null);
  const [warnMamangerOnInvoice, setWarnManagerOnInvoice] = useState(false);
  const onClickAddInvoiceItem = useCallback(() => {
    if (buyableItemIdentifier === BUYABLE_ITEM_CREDIT) {
      const data = {
        buyable_item_id: 0,
        price: parseFloat(buyableItemId).toFixed(2),
        voucher: parseFloat(voucher || 0).toFixed(2),
        name: t('invoiceItem.credit.label'),
      };
      onAddBuyableItem(buyableItemIdentifier, data);
    } else {
      const buyableItem = availableBuyableItems[buyableItemIdentifier].find(
        (bi) => bi.id === buyableItemId,
      );
      // eslint-disable-next-line
      for (let i = 0; i < quantity; i++) {
        onAddBuyableItem(buyableItemIdentifier, {
          ...buyableItem,
          buyable_item_id: buyableItem.id,
          price: parseFloat(buyableItem.price).toFixed(2),
          voucher: parseFloat(voucher || '0.00').toFixed(2),
        });
      }
    }
  }, [
    buyableItemId,
    buyableItemIdentifier,
    quantity,
    voucher,
    availableBuyableItems,
    onAddBuyableItem,
    t,
  ]);

  const onChangeVoucherCredit = useCallback(
    (value: number) => {
      setVoucher(value);

      if (
        buyableItemIdentifier &&
        buyableItemId !== null &&
        availableBuyableItems[buyableItemIdentifier]
      ) {
        const item = availableBuyableItems[buyableItemIdentifier].find(
          (b) => b.id === buyableItemId,
        );

        if (item) {
          const price = getPriceForItem(item, buyableItemIdentifier);
          const priceNumber = parseInt(price).toFixed(2);
          const percent = ((value / priceNumber) * 100).toFixed(2);
          setVoucherPercent(percent);
        }
      }
    },
    [buyableItemIdentifier, buyableItemId, availableBuyableItems],
  );

  const onChangeVoucherPercent = useCallback(
    (percent: number) => {
      setVoucherPercent(percent);

      if (
        buyableItemIdentifier &&
        buyableItemId !== null &&
        availableBuyableItems[buyableItemIdentifier]
      ) {
        const item = availableBuyableItems[buyableItemIdentifier].find(
          (b) => b.id === buyableItemId,
        );

        if (item) {
          const price = getPriceForItem(item, buyableItemIdentifier);
          const priceNumber = parseFloat(price).toFixed(2);
          const newVoucher = ((priceNumber * percent) / 100).toFixed(2);
          setVoucher(newVoucher);
        }
      }
    },
    [buyableItemIdentifier, buyableItemId, availableBuyableItems],
  );
  React.useEffect(() => {
    if (!buyableItemId || !buyableItemIdentifier || !member) {
      return setWarnManagerOnInvoice(false);
    }
    const item = availableBuyableItems[buyableItemIdentifier].find(
      (bi) => bi.id === buyableItemId,
    );
    if (buyableItemIdentifier === BUYABLE_ITEM_PASS) {
      return setWarnManagerOnInvoice(
        paymentPackTagsAndMemberTagsCompatibilty(item, member?.tags),
      );
    }
    return setWarnManagerOnInvoice(false);
  }, [buyableItemIdentifier, availableBuyableItems, member, buyableItemId]);
  return (
    <div>
      <Paper>
        <Tabs
          value={buyableItemIdentifier}
          indicatorColor="primary"
          textColor="primary"
          onChange={(ev, value) => {
            setBuyableItemId(null);
            setVoucher(null);
            setVoucherPercent(null);
            setBuyableItemIdentifier(parseInt(value, 10));
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label={t(`invoiceItem.buyableItemIdentifier.${BUYABLE_ITEM_PASS}`)}
            value={BUYABLE_ITEM_PASS}
          />
          <Tab
            label={t(
              `invoiceItem.buyableItemIdentifier.${BUYABLE_ITEM_SHOP_ITEM}`,
            )}
            value={BUYABLE_ITEM_SHOP_ITEM}
          />
          <Tab
            label={t(
              `invoiceItem.buyableItemIdentifier.${BUYABLE_ITEM_PRIVATE_PASS}`,
            )}
            value={BUYABLE_ITEM_PRIVATE_PASS}
          />
          <Tab
            label={t(
              `invoiceItem.buyableItemIdentifier.${BUYABLE_ITEM_COMBO_ITEM}`,
            )}
            value={BUYABLE_ITEM_COMBO_ITEM}
          />
          <Tab
            label={t(
              `invoiceItem.buyableItemIdentifier.${BUYABLE_ITEM_GIFTCARD}`,
            )}
            value={BUYABLE_ITEM_GIFTCARD}
          />
        </Tabs>
      </Paper>
      <div className={classes.innerEditor}>
        <div className={classes.innerEditorTop}>
          <BuyableItemSelector
            availableBuyableItems={availableBuyableItems}
            buyableItemIdentifier={buyableItemIdentifier}
            value={buyableItemId}
            onSelect={(id: number) => {
              setBuyableItemId(id);
              setVoucher(null);
              setVoucherPercent(null);
            }}
            member={member}
          />
          <div className={classes.numericInputRow}>
            <NumberInput
              value={quantity}
              onChange={(ev) => setQuantity(parseInt(ev.target.value, 10))}
              variant="outlined"
              dense
              shrink
              label={t('invoiceItem.quantity')}
              InputProps={{
                step: 1,
                min: 1,
                startAdornment: (
                  <InputAdornment position="start">x</InputAdornment>
                ),
              }}
              disabled={buyableItemId === null}
            />
            <div className={classes.discountInputWrapper}>
              <PriceInput
                value={voucher === null ? '0.00' : voucher}
                dense
                variant="outlined"
                label={t('invoiceItem.discount')}
                shrink
                onChange={(ev) => onChangeVoucherCredit(ev.target.value)}
                disabled={buyableItemId === null}
              />

              <div className={classes.percentDiscountWrapper}>
                <NumberInput
                  value={voucherPercent === null ? '0.00' : voucherPercent}
                  onChange={(ev) => onChangeVoucherPercent(ev.target.value)}
                  variant="outlined"
                  dense
                  shrink
                  label={t('invoiceItem.discount')}
                  InputProps={{
                    step: 1,
                    min: 1,
                    startAdornment: (
                      <InputAdornment position="start">%</InputAdornment>
                    ),
                  }}
                  disabled={buyableItemId === null}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <Divider className={classes.divider} />
          {!warnMamangerOnInvoice ? (
            <Button
              variant="contained"
              color="primary"
              onClick={onClickAddInvoiceItem}
              disabled={!buyableItemId}
            >
              <AddIcon className={classes.leftIcon} />
              {t('actions.addInvoiceItem')}
            </Button>
          ) : (
            <ButtonAddWithWarning
              onClick={onClickAddInvoiceItem}
              variant="contained"
              color="primary"
            >
              <AddIcon className={classes.leftIcon} />
              {t('actions.addInvoiceItem')}
            </ButtonAddWithWarning>
          )}
        </div>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  innerEditor: {
    margin: theme.spacing(2),
    minHeight: 300,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  divider: {
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    marginBottom: theme.spacing(2),
  },
  innerEditorTop: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  numericInputRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),

    '&>*': {
      marginRight: theme.spacing(2),
    },
  },
  accountBalanceInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    border: '1px solid #ced4da',
    backgroundColor: '#F8F8F8',
    borderRadius: `${theme.shape.borderRadius}px`,
  },
  discountInputWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  percentDiscountWrapper: {
    marginTop: theme.spacing(2),
  },
}));

export default InvoiceItemEditor;
