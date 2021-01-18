// @flow
import React from 'react';
import { compose, withState } from 'recompose';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import InputAdornment from '@material-ui/core/InputAdornment';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_CREDIT,
} from '@bsport/common/lib/master-data/buyable-items';

import PriceInput from '../../../components/input/PriceInput.component';
import NumberInput from '../../../components/input/NumericInput.component';
import PaymentPackSelector from '../../payment-packs/components/PaymentPackSelector.component';
import PrivatePassSelector from '../../private-service/components/pass/PrivatePassSelector.component';
import PaymentComboSelector from '../../payment-combo/components/PaymentComboSelector.component';
import ShopItemSelector from '../../shop/components/ShopItemSelector.component';
import { getCurrencyDisplay } from '../../theme/selectors';

type Props = {
  voucher: string,
  setVoucher: (string) => void,

  quantity: number,
  setQuantity: (number) => void,

  setBuyableItemIdentifier: (number) => void,
  buyableItemIdentifier: number,

  buyableItemId: ?number,
  setBuyableItemId: (?number) => void,

  onAddBuyableItem: (
    buyableItemIdentifier: number,
    buyableItem: BuyableItem,
  ) => void,
  availableBuyableItems: { [buyableItemIdentifier: number]: Array<any> },
  member: { credit_account_balance: number },
};

const BuyableItemSelector = (props: {
  buyableItemIdentifier: number,
  value: ?number,
  availableBuyableItems: { [number]: BuyableItem },
  onSelect: BuyableItem,
  member: { credit_account_balance: number },
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);
  switch (props.buyableItemIdentifier) {
    case BUYABLE_ITEM_PASS:
      return (
        <PaymentPackSelector
          autofocus
          value={props.value}
          paymentPacks={
            props.availableBuyableItems[props.buyableItemIdentifier]
          }
          selectorClass={classes.selector}
          onChange={(buyableItem) => props.onSelect(buyableItem)}
        />
      );
    case BUYABLE_ITEM_SHOP_ITEM:
      return (
        <ShopItemSelector
          autofocus
          value={props.value}
          selectorClass={classes.selector}
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
          selectorClass={classes.selector}
          onChange={(buyableItem) => props.onSelect(buyableItem)}
        />
      );
    case BUYABLE_ITEM_COMBO_ITEM:
      return (
        <PaymentComboSelector
          autofocus
          value={props.value}
          selectorClass={classes.selector}
          paymentComboList={
            props.availableBuyableItems[props.buyableItemIdentifier]
          }
          onChange={(buyableItem) => props.onSelect(buyableItem)}
        />
      );
    case BUYABLE_ITEM_CREDIT:
      return (
        <div>
          <div className={classes.accountBalanceInfo}>
            <Typography variant="h6">
              {t('creditAccountBalance.current')}
            </Typography>
            <Typography
              variant="h6"
              color={
                props.member.credit_account_balance <= 0 ? 'error' : 'primary'
              }
            >
              {`${props.member.credit_account_balance} ${getCurrencyDisplay()}`}
            </Typography>
          </div>
          <PriceInput
            variant="outlined"
            label={t('invoiceItem.credit.label')}
            value={props.value}
            onChange={(ev) => {
              props.onSelect(ev.target.value);
            }}
          />
        </div>
      );
    default:
      return null;
  }
};

export const InvoiceItemEditor = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);
  return (
    <div className={classes.container}>
      <Paper className={classes.tabs}>
        <Tabs
          value={props.buyableItemIdentifier}
          indicatorColor="primary"
          textColor="primary"
          onChange={(ev, value) => {
            props.setBuyableItemId(null);
            props.setVoucher('0.00');
            props.setBuyableItemIdentifier(parseInt(value, 10));
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
              `invoiceItem.buyableItemIdentifier.${BUYABLE_ITEM_CREDIT}`,
            )}
            value={BUYABLE_ITEM_CREDIT}
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
        </Tabs>
      </Paper>
      <div className={classes.innerEditor}>
        <div className={classes.innerEditorTop}>
          <BuyableItemSelector
            availableBuyableItems={props.availableBuyableItems}
            buyableItemIdentifier={props.buyableItemIdentifier}
            value={props.buyableItemId}
            onSelect={props.setBuyableItemId}
            member={props.member}
          />
          <div className={classes.numericInputRow}>
            <NumberInput
              value={props.quantity}
              onChange={(ev) =>
                props.setQuantity(parseInt(ev.target.value, 10))
              }
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
            />
            <PriceInput
              value={props.voucher}
              dense
              variant="outlined"
              label={t('invoiceItem.voucher')}
              shrink
              onChange={(ev) => props.setVoucher(ev.target.value)}
            />
          </div>
        </div>
        <div>
          <Divider className={classes.divider} />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (props.buyableItemIdentifier === BUYABLE_ITEM_CREDIT) {
                props.onAddBuyableItem(props.buyableItemIdentifier, {
                  buyable_item_id: 0,
                  price: parseFloat(`${props.buyableItemId}`).toFixed(2),
                  voucher: parseFloat(`${props.voucher}`).toFixed(2),
                  name: t('invoiceItem.credit.label'),
                });
              } else {
                const buyableItem = props.availableBuyableItems[
                  props.buyableItemIdentifier
                ].find((bi) => bi.id === props.buyableItemId);
                // eslint-disable-next-line
                for (let i = 0; i < props.quantity; i++) {
                  props.onAddBuyableItem(props.buyableItemIdentifier, {
                    ...buyableItem,
                    buyable_item_id: buyableItem.id,
                    price: parseFloat(buyableItem.price).toFixed(2),
                    voucher: parseFloat(`${props.voucher}`).toFixed(2),
                  });
                }
              }
            }}
            disabled={!props.buyableItemId}
          >
            <AddIcon className={classes.leftIcon} />
            {t('actions.addInvoiceItem')}
          </Button>
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
    alignItems: 'center',
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
}));

export default compose(
  withState(
    'buyableItemIdentifier',
    'setBuyableItemIdentifier',
    BUYABLE_ITEM_PASS,
  ),
  withState('buyableItemId', 'setBuyableItemId', null),
  withState('voucher', 'setVoucher', '0.00'),
  withState('quantity', 'setQuantity', 1),
)(InvoiceItemEditor);
