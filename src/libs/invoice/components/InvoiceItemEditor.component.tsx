// @ts-nocheck
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
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
  QuicksaleBasketItem,
} from '@bsport/common/lib/master-data/buyable-items';

import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import NumericInput from '../../../components/input/NumericInput.component';
import PaymentPackSelector from '../../payment-packs/components/PaymentPackSelector.component';
import PrivatePassSelector from '../../private-service/components/pass/PrivatePassSelector.component';
import PaymentComboSelector from '../../payment-combo/components/PaymentComboSelector.component';
import GiftcardSelector from '../../giftcard/components/GiftcardSelector.component';
import ShopItemSelector from '../../shop/components/ShopItemSelector.component';
import withConfirm from '../../../hocs/with-confirm.hoc';
import { paymentPackTagsAndMemberTagsCompatibilty } from '../../payment-packs/utils';
import { BuyableItemTypes } from '../types';
import { getCurrencyDisplay } from '#libs/theme/selectors';

type BuyableItemProps = {
  buyableItemIdentifier: number;
  value?: number;
  availableBuyableItems: { [key: string]: BuyableItemTypes };
  onSelect?: (id: number) => void;
};

const BuyableItemSelector: React.FC<BuyableItemProps> = React.memo(
  ({ buyableItemIdentifier, value, availableBuyableItems, onSelect }) => {
    switch (buyableItemIdentifier) {
      case BUYABLE_ITEM_PASS:
        return (
          <PaymentPackSelector
            autofocus
            onChange={onSelect}
            paymentPacks={availableBuyableItems[buyableItemIdentifier]}
            value={value}
          />
        );
      case BUYABLE_ITEM_SHOP_ITEM:
        return (
          <ShopItemSelector
            autofocus
            onChange={onSelect}
            shopItemList={availableBuyableItems[buyableItemIdentifier]}
            value={value}
          />
        );
      case BUYABLE_ITEM_PRIVATE_PASS:
        return (
          <PrivatePassSelector
            autofocus
            onChange={onSelect}
            privatePassList={availableBuyableItems[buyableItemIdentifier]}
            value={value}
          />
        );
      case BUYABLE_ITEM_COMBO_ITEM:
        return (
          <PaymentComboSelector
            autofocus
            onChange={onSelect}
            paymentComboList={availableBuyableItems[buyableItemIdentifier]}
            value={value}
          />
        );
      case BUYABLE_ITEM_GIFTCARD:
        return (
          <GiftcardSelector
            autofocus
            giftcardList={availableBuyableItems[buyableItemIdentifier]}
            onChange={onSelect}
            value={value}
          />
        );
      default:
        return null;
    }
  },
);

type Props = {
  onAddBuyableItem: (
    buyableItemIdentifier: QuicksaleBasketItem,
    buyableItem: BuyableItemTypes,
  ) => void;
  availableBuyableItems: {
    [buyableItemIdentifier: QuicksaleBasketItem]: BuyableItemTypes[];
  };
  member: { credit_account_balance: number };
};

const getPriceForItem = (
  item: BuyableItemTypes,
  identifier: QuicksaleBasketItem,
): string => {
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

  return '0';
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
const InvoiceItemEditor: React.FC<Props> = ({
  onAddBuyableItem,
  availableBuyableItems,
  member,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('invoice');

  const [buyableItemIdentifier, setBuyableItemIdentifier] =
    useState(BUYABLE_ITEM_PASS);

  const [buyableItemId, setBuyableItemId] = useState<number | null>(null);

  const [quantity, setQuantity] = useState(1);

  const [voucher, setVoucher] = useState<string | null>(null);
  const [errors, setErrors] = useState(false);
  const [voucherPercent, setVoucherPercent] = useState<string | null>(null);

  const [warnMamangerOnInvoice, setWarnManagerOnInvoice] = useState(false);

  const buyableItemPrice: string = useMemo(() => {
    const currentItem = availableBuyableItems[buyableItemIdentifier].find(
      (buyableItem) => buyableItem.id === buyableItemId,
    );
    return currentItem?.price || '0';
  }, [availableBuyableItems, buyableItemId, buyableItemIdentifier]);

  const [finalPricePreview, setFinalPricePreview] = useState<string | null>(
    null,
  );

  const handleChangeTab = useCallback(
    (_: React.SyntheticEvent, value: string) => {
      setBuyableItemId(null);
      setVoucher(null);
      setVoucherPercent(null);
      setErrors(false);
      setFinalPricePreview(null);
      setBuyableItemIdentifier(parseInt(value, 10));
    },
    [],
  );

  const handleSelectBuyableItem = useCallback(
    (item_id: number) => {
      setBuyableItemId(item_id);
      setVoucher(null);
      setVoucherPercent(null);
      setErrors(false);
      setFinalPricePreview(
        availableBuyableItems[buyableItemIdentifier].find(
          (buyableItem) => buyableItem.id === item_id,
        )?.price || '0.00',
      );
    },
    [buyableItemIdentifier, availableBuyableItems],
  );

  const handleSetQuantity = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setQuantity(parseInt(event.target.value, 10));
    },
    [],
  );

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
    (value: string) => {
      setVoucher(value);
      setErrors(
        parseFloat(value) < 0 ||
          (buyableItemId
            ? parseFloat(buyableItemPrice) < parseFloat(value)
            : false),
      );
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
          const priceNumber = parseFloat(price);
          const percent = priceNumber
            ? ((parseFloat(value) / priceNumber) * 100).toFixed(2)
            : '0,00';
          setVoucherPercent(percent);
          setFinalPricePreview((priceNumber - parseFloat(value)).toFixed(2));
        }
      }
    },
    [
      buyableItemIdentifier,
      buyableItemId,
      availableBuyableItems,
      buyableItemPrice,
    ],
  );

  const handleOnChangeVoucherCredit = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChangeVoucherCredit(event.target.value || '0,00');
    },
    [onChangeVoucherCredit],
  );

  const handleOnBlurVoucherCredit = useCallback(() => {
    // Depending on how you change the state, prevState and toFixed might not exist
    setVoucher((prevState) => parseFloat(prevState)?.toFixed?.(2));
  }, []);

  const onChangeVoucherPercent = useCallback(
    (percent: string) => {
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
          const priceNumber = parseFloat(price);
          const newVoucher = (
            (priceNumber * parseFloat(percent)) /
            100
          ).toFixed(2);
          const floatVoucher = parseFloat(newVoucher);
          setVoucher(newVoucher);
          setErrors(
            floatVoucher < 0 ||
              (buyableItemId
                ? parseFloat(buyableItemPrice) < floatVoucher
                : false),
          );
          setFinalPricePreview((parseFloat(price) - floatVoucher).toFixed(2));
        }
      }
    },
    [
      buyableItemIdentifier,
      buyableItemId,
      buyableItemPrice,
      availableBuyableItems,
    ],
  );

  const handleOnChangeVoucherPercent = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChangeVoucherPercent(event.target.value || '0.00');
    },
    [onChangeVoucherPercent],
  );

  const handleOnChangeFinalPricePreview = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const finalPrice =
        Math.round(parseFloat(event.target.value) * 100) / 100 || 0;
      setFinalPricePreview(finalPrice.toString());

      if (
        buyableItemIdentifier &&
        buyableItemId !== null &&
        availableBuyableItems[buyableItemIdentifier]
      ) {
        const item = availableBuyableItems[buyableItemIdentifier].find(
          (b) => b.id === buyableItemId,
        );
        if (item) {
          const itemPrice = getPriceForItem(item, buyableItemIdentifier);
          const priceNumber = parseFloat(itemPrice);
          const newPercent = priceNumber
            ? parseFloat(((1 - finalPrice / priceNumber) * 100).toFixed(2))
            : '0,00';
          const newVoucher = parseFloat((priceNumber - finalPrice).toFixed(2));
          setVoucher(newVoucher.toFixed(2));
          setErrors(
            newVoucher < 0 ||
              (buyableItemId
                ? parseFloat(buyableItemPrice) < newVoucher
                : false),
          );
          setVoucherPercent(newPercent.toFixed(2));
        }
      }
    },
    [
      buyableItemIdentifier,
      buyableItemId,
      buyableItemPrice,
      availableBuyableItems,
    ],
  );

  const handleFinalPricePreviewOnBlur = useCallback(() => {
    // Depending on how you change the state, prevState and toFixed might not exist
    setFinalPricePreview((prevState) => parseFloat(prevState)?.toFixed?.(2));
  }, []);

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
          indicatorColor="primary"
          onChange={handleChangeTab}
          scrollButtons="auto"
          textColor="primary"
          value={buyableItemIdentifier}
          variant="scrollable"
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

      <ObjectLevelPermissionProvider requiredPermission="billing.allowed_actions.createManualDiscount">
        {(hasCreateDiscountPermission: boolean) => (
          <div
            className={classNames(classes.innerEditor, {
              [classes.minHeight]: hasCreateDiscountPermission,
            })}
          >
            <div className={classes.innerEditorTop}>
              <BuyableItemSelector
                availableBuyableItems={availableBuyableItems}
                buyableItemIdentifier={buyableItemIdentifier}
                member={member}
                onSelect={handleSelectBuyableItem}
                value={buyableItemId}
              />
              <div className={classes.numericInputRow}>
                <NumericInput
                  fullWidth
                  disabled={buyableItemId === null}
                  InputProps={{
                    inputProps: {
                      step: 1,
                      min: 1,
                    },
                    startAdornment: (
                      <InputAdornment position="start">x</InputAdornment>
                    ),
                  }}
                  label={t('invoiceItem.quantity')}
                  onChange={handleSetQuantity}
                  value={quantity}
                  variant="outlined"
                />

                {hasCreateDiscountPermission && (
                  <div className={classes.discountInputWrapper}>
                    <NumericInput
                      fullWidth
                      disabled={buyableItemId === null}
                      error={errors}
                      InputProps={{
                        inputProps: {
                          max: buyableItemPrice,
                          min: 0,
                          step: 1,
                        },
                        startAdornment: (
                          <InputAdornment position="start">
                            {getCurrencyDisplay()}
                          </InputAdornment>
                        ),
                      }}
                      label={`${t(
                        'invoiceItem.discount',
                      )} (${getCurrencyDisplay()})`}
                      onBlur={handleOnBlurVoucherCredit}
                      onChange={handleOnChangeVoucherCredit}
                      // @ts-ignore it needs to be a string (for the decimals)
                      value={voucher === null ? '0.00' : voucher}
                      variant="outlined"
                    />
                    <div className={classes.percentDiscountWrapper}>
                      <NumericInput
                        fullWidth
                        disabled={buyableItemId === null}
                        error={errors}
                        InputProps={{
                          inputProps: {
                            min: 0,
                            max: 100,
                            step: 1,
                          },
                          startAdornment: (
                            <InputAdornment position="start">%</InputAdornment>
                          ),
                        }}
                        label={`${t('invoiceItem.discount')} (%)`}
                        onChange={handleOnChangeVoucherPercent}
                        // @ts-ignore it needs to be a string (for the decimals)
                        value={
                          voucherPercent === null ? '0.00' : voucherPercent
                        }
                        variant="outlined"
                      />
                    </div>
                    <div className={classes.percentDiscountWrapper}>
                      <NumericInput
                        fullWidth
                        disabled={buyableItemId === null}
                        error={errors}
                        InputProps={{
                          inputProps: {
                            min: 0,
                            max: buyableItemPrice,
                            step: 1,
                          },
                          startAdornment: (
                            <InputAdornment position="start">
                              {getCurrencyDisplay()}
                            </InputAdornment>
                          ),
                        }}
                        label={t('invoiceItem.finalPricePreview')}
                        onBlur={handleFinalPricePreviewOnBlur}
                        onChange={handleOnChangeFinalPricePreview}
                        // @ts-ignore it needs to be a string (for the decimals)
                        value={
                          finalPricePreview === null
                            ? '0.00'
                            : finalPricePreview
                        }
                        variant="outlined"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Divider className={classes.divider} />
              {!warnMamangerOnInvoice ? (
                <Button
                  color="primary"
                  disabled={!buyableItemId || errors}
                  onClick={onClickAddInvoiceItem}
                  variant="contained"
                >
                  <AddIcon className={classes.leftIcon} />
                  {t('actions.addInvoiceItem')}
                </Button>
              ) : (
                <ButtonAddWithWarning
                  color="primary"
                  disabled={!buyableItemId || errors}
                  onClick={onClickAddInvoiceItem}
                  variant="contained"
                >
                  <AddIcon className={classes.leftIcon} />
                  {t('actions.addInvoiceItem')}
                </ButtonAddWithWarning>
              )}
            </div>
          </div>
        )}
      </ObjectLevelPermissionProvider>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  innerEditor: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  minHeight: { minHeight: 300 },
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
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  percentDiscountWrapper: {
    marginTop: theme.spacing(2),
  },
}));

export default React.memo(InvoiceItemEditor);
