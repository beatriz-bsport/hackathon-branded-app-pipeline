import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
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
  QuicksaleBasketItem,
} from '@bsport/common/lib/master-data/buyable-items.js';

import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { getCurrencyDisplay } from '#src/libs/theme/selectors';
import NumericInput from '#src/components/input/NumericInput.component';
import PaymentPackSelector from '#src/libs/payment-packs/components/PaymentPackSelector.component';
import PrivatePassSelector from '#src/libs/private-service/components/pass/PrivatePassSelector.component';
// @ts-expect-error
import PaymentComboSelector from '../../payment-combo/components/PaymentComboSelector.component';
import GiftcardSelector from '#src/libs/giftcard/components/GiftcardSelector.component';
import ShopItemSelector, {
  shopItemOption,
} from '#src/libs/shop/components/ShopItemSelector.component';
import TextField from '@material-ui/core/TextField';
// @ts-expect-error
import withConfirm from '../../../hocs/with-confirm.hoc';
import { paymentPackTagsAndMemberTagsCompatibilty } from '#src/libs/payment-packs/utils';
// @ts-expect-error
import { BuyableItemTypes } from '../types';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import { FUZZY_SEARCH_BAR_BUYABLE_ITEMS_ADDITIONAL_PARAMS_WEBSHOP_REWORKED } from '#src/libs/shop/components/ShopReworkedProductList/constants';
import type { ShopItem } from '#src/libs/shop/types';
import type { SelectOption } from '#src/libs/types';

type BuyableItemProps = {
  buyableItemIdentifier: number;
  value?: number;
  availableBuyableItems: { [key: string]: BuyableItemTypes };
  onSelect?: (id: number, buyableItem?: ShopItem) => void;
  displayNewWebshop?: boolean;
};

const BuyableItemSelector: React.FC<BuyableItemProps> = React.memo(
  ({
    buyableItemIdentifier,
    value,
    availableBuyableItems,
    onSelect,
    displayNewWebshop,
  }) => {
    const { t } = useTranslation('shop');
    const [selectedShopItemName, setSelectedShopItemName] = useState('');

    const formatSearchOptions = useCallback((searchResults: ShopItem[]) => {
      return searchResults.map((result) => ({
        label: result.name,
        value: result.id,
        pp: result,
      }));
    }, []);

    const handleOnChangeShopItem = useCallback(
      (selectedOption: SelectOption<number>) => {
        // @ts-expect-error: onChange is typed as (SelectOption<number>) => void
        onSelect(selectedOption.value, selectedOption?.pp);
        setSelectedShopItemName(selectedOption.label);
      },
      [onSelect],
    );

    switch (buyableItemIdentifier) {
      case BUYABLE_ITEM_PASS:
        return (
          // @ts-expect-error
          <PaymentPackSelector
            autofocus
            onChange={onSelect}
            paymentPacks={availableBuyableItems[buyableItemIdentifier]}
            value={value}
          />
        );
      case BUYABLE_ITEM_SHOP_ITEM:
        if (displayNewWebshop)
          return (
            <ObjectSearchComponent
              additionalParams={
                FUZZY_SEARCH_BAR_BUYABLE_ITEMS_ADDITIONAL_PARAMS_WEBSHOP_REWORKED
              }
              components={{ Option: shopItemOption }}
              onChange={handleOnChangeShopItem}
              optionsFormatter={formatSearchOptions}
              placeholder={
                selectedShopItemName || t('shopitem.selector.placeholder')
              }
              searchedObjectType="shop_item"
              styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
              value={[]}
            />
          );

        return (
          <ShopItemSelector
            // @ts-expect-error
            autofocus
            onChange={onSelect}
            shopItemList={availableBuyableItems[buyableItemIdentifier]}
            value={value}
          />
        );
      case BUYABLE_ITEM_PRIVATE_PASS:
        return (
          <PrivatePassSelector
            // @ts-expect-error
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
          // @ts-expect-error
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
    // @ts-expect-error
    [buyableItemIdentifier: QuicksaleBasketItem]: BuyableItemTypes[];
  };
  member: { credit_account_balance: number };
  displayNewWebshop?: boolean;
  isCustomDiscountReasonRequired: boolean;
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
  displayNewWebshop,
  isCustomDiscountReasonRequired,
}) => {
  const classes = useStyles();

  const { t } = useTranslation('invoice');

  const [buyableItemIdentifier, setBuyableItemIdentifier] =
    useState(BUYABLE_ITEM_PASS);

  const [buyableItemId, setBuyableItemId] = useState<number | null>(null);

  /**
   * buyableItem is an optional parameter that is used in the scope of the new webshop
   * It is used to send the information given by the selected ObjectSearchComponent
   * to the parent component as long as this component doesn't rely on the redux store
   * TODO: Add all buyable items type in the state type and remove the unpaginated call
   */
  const [selectedBuyableItem, setSelectedBuyableItem] =
    useState<ShopItem | null>(null);

  const [quantity, setQuantity] = useState(1);

  const [voucher, setVoucher] = useState<string | null>(null);
  const [errors, setErrors] = useState(false);
  const [voucherPercent, setVoucherPercent] = useState<string | null>(null);
  const [voucherReason, setVoucherReason] = useState<string | null>(null);
  const [voucherReasonErrors, setVoucherReasonErrors] = useState(false);

  const [warnMamangerOnInvoice, setWarnManagerOnInvoice] = useState(false);

  const isBuyableShopItemFromNewWebshop =
    buyableItemIdentifier === BUYABLE_ITEM_SHOP_ITEM && displayNewWebshop;

  const buyableItemPrice: string = useMemo(() => {
    // @ts-expect-error
    const currentItem = availableBuyableItems[buyableItemIdentifier].find(
      // @ts-expect-error
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
      setSelectedBuyableItem(null);
      setVoucher(null);
      setVoucherPercent(null);
      setVoucherReason(null);
      setErrors(false);
      setVoucherReasonErrors(false);
      setFinalPricePreview(null);
      setBuyableItemIdentifier(parseInt(value, 10));
    },
    [],
  );

  const handleSelectBuyableItem = useCallback(
    (item_id: number, newSelectedBuyableItem?: ShopItem) => {
      setVoucher(null);
      setVoucherPercent(null);
      setVoucherReason(null);
      setVoucherReasonErrors(false);
      setErrors(false);
      setBuyableItemId(item_id);
      if (isBuyableShopItemFromNewWebshop) {
        setSelectedBuyableItem(newSelectedBuyableItem);
        setFinalPricePreview(newSelectedBuyableItem?.price || '0.00');
      } else {
        setFinalPricePreview(
          // @ts-expect-error
          availableBuyableItems[buyableItemIdentifier].find(
            // @ts-expect-error
            (buyableItem) => buyableItem.id === item_id,
          )?.price || '0.00',
        );
      }
    },
    [
      isBuyableShopItemFromNewWebshop,
      availableBuyableItems,
      buyableItemIdentifier,
    ],
  );

  const handleSetQuantity = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setQuantity(parseInt(event.target.value, 10));
    },
    [],
  );

  const shouldEnterCustomDiscountReason = useMemo(() => {
    return (
      (parseFloat(voucher) > 0 || parseFloat(voucherPercent) > 0) &&
      isCustomDiscountReasonRequired
    );
  }, [voucher, voucherPercent, isCustomDiscountReasonRequired]);

  const onClickAddInvoiceItem = useCallback(() => {
    if (!voucherReason && shouldEnterCustomDiscountReason) {
      setVoucherReasonErrors(true);
    } else {
      /**
       * For the new webshop, we use the selectedBuyableItem to add the item to the basket
       * The shopItem aren't stored anymore in the redux store so we need to use the selectedBuyableItem state
       * TODO: Get rid of the availableBuyableItems variable and use the selectedBuyableItem state for all tabs
       */
      const buyableItem = isBuyableShopItemFromNewWebshop
        ? selectedBuyableItem
        : // @ts-expect-error
          availableBuyableItems[buyableItemIdentifier].find(
            // @ts-expect-error
            (bi) => bi.id === buyableItemId,
          );
      setVoucherReasonErrors(false);

      for (let i = 0; i < quantity; i++) {
        onAddBuyableItem(buyableItemIdentifier, {
          ...buyableItem,
          buyable_item_id: buyableItem.id,
          // Price can be null for giftcard
          price:
            buyableItem.price !== null && buyableItem.price !== undefined
              ? parseFloat(buyableItem.price).toFixed(2)
              : '0.00',
          hasCustomPrice: !buyableItem.price,
          voucher: parseFloat(voucher || '0.00').toFixed(2),
          voucher_reason: voucherReason || '',
        });
      }
    }
  }, [
    voucherReason,
    buyableItemIdentifier,
    buyableItemId,
    voucher,
    onAddBuyableItem,
    isBuyableShopItemFromNewWebshop,
    selectedBuyableItem,
    availableBuyableItems,
    shouldEnterCustomDiscountReason,
    quantity,
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
        // @ts-expect-error
        availableBuyableItems[buyableItemIdentifier]
      ) {
        // @ts-expect-error
        const item = availableBuyableItems[buyableItemIdentifier].find(
          // @ts-expect-error
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
    setVoucher((prevState) => parseFloat(prevState).toFixed(2));
  }, []);

  const onChangeVoucherPercent = useCallback(
    (percent: string) => {
      setVoucherPercent(percent);

      if (
        buyableItemIdentifier &&
        buyableItemId !== null &&
        // @ts-expect-error
        availableBuyableItems[buyableItemIdentifier]
      ) {
        // @ts-expect-error
        const item = availableBuyableItems[buyableItemIdentifier].find(
          // @ts-expect-error
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

  const handleOnChangeVoucherReason = React.useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value || '';
      setVoucherReasonErrors(!value);
      setVoucherReason(value);
    },
    [setVoucherReasonErrors, setVoucherReason],
  );

  const handleOnChangeFinalPricePreview = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const pricePreview = event.target.value;
      const pricePreviewNumber = parseFloat(pricePreview) || 0;
      const roundedPricePreviewNumber = parseFloat(
        pricePreviewNumber.toFixed(2),
      );
      setFinalPricePreview(pricePreview);

      if (
        buyableItemIdentifier &&
        buyableItemId !== null &&
        // @ts-expect-error
        availableBuyableItems[buyableItemIdentifier]
      ) {
        // @ts-expect-error
        const item = availableBuyableItems[buyableItemIdentifier].find(
          // @ts-expect-error
          (b) => b.id === buyableItemId,
        );
        if (item) {
          const itemPrice = getPriceForItem(item, buyableItemIdentifier);
          const priceNumber = parseFloat(itemPrice);
          const newPercent = priceNumber
            ? parseFloat(
                ((1 - roundedPricePreviewNumber / priceNumber) * 100).toFixed(
                  2,
                ),
              )
            : 0;
          const newVoucher = parseFloat(
            (priceNumber - roundedPricePreviewNumber).toFixed(2),
          );
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

  const handleEnterKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault(); // Prevent adding a new line when pressing Enter
      }
    },
    [],
  );

  const handleFinalPricePreviewOnBlur = useCallback(() => {
    // Depending on how you change the state, prevState and toFixed might not exist
    setFinalPricePreview((prevState) => parseFloat(prevState).toFixed(2));
  }, []);

  React.useEffect(() => {
    if (!buyableItemId || !buyableItemIdentifier || !member) {
      return setWarnManagerOnInvoice(false);
    }
    // @ts-expect-error
    const item = availableBuyableItems[buyableItemIdentifier].find(
      // @ts-expect-error
      (bi) => bi.id === buyableItemId,
    );

    if (buyableItemIdentifier === BUYABLE_ITEM_PASS) {
      return setWarnManagerOnInvoice(
        // @ts-expect-error
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
            className={clsx(classes.innerEditor, {
              [classes.minHeight]: hasCreateDiscountPermission,
            })}
          >
            <div className={classes.innerEditorTop}>
              <BuyableItemSelector
                availableBuyableItems={availableBuyableItems}
                buyableItemIdentifier={buyableItemIdentifier}
                displayNewWebshop={displayNewWebshop}
                // @ts-expect-error
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
                      // @ts-expect-error it needs to be a string (for the decimals)
                      value={voucher === null ? '0.00' : voucher}
                      variant="outlined"
                    />
                    <div className={classes.fieldDiscountWrapper}>
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
                        // @ts-expect-error it needs to be a string (for the decimals)
                        value={
                          voucherPercent === null ? '0.00' : voucherPercent
                        }
                        variant="outlined"
                      />
                    </div>
                    {shouldEnterCustomDiscountReason && (
                      <TextField
                        multiline
                        required
                        className={classes.fieldDiscountWrapper}
                        error={voucherReasonErrors}
                        helperText={`${voucherReason?.length ?? 0}/100`}
                        inputProps={{ maxLength: 100 }}
                        label={t('invoiceItem.discountReason')}
                        maxRows={5}
                        name="voucherReason"
                        onChange={handleOnChangeVoucherReason}
                        onKeyDown={handleEnterKey}
                        value={voucherReason}
                        variant="outlined"
                      />
                    )}
                    <div className={classes.fieldDiscountWrapper}>
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
                        // @ts-expect-error it needs to be a string (for the decimals)
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
  fieldDiscountWrapper: {
    marginTop: theme.spacing(2),
  },
}));

export default React.memo(InvoiceItemEditor);
