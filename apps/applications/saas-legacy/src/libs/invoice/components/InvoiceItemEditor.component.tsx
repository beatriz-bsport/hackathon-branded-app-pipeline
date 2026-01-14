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
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import { FUZZY_SEARCH_BAR_BUYABLE_ITEMS_ADDITIONAL_PARAMS_WEBSHOP_REWORKED } from '#src/libs/shop/components/ShopReworkedProductList/constants';
import type { ShopItem } from '#src/libs/shop/types';
import type { SelectOption } from '#src/libs/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type {
  AvailableBuyableItemTypes,
  BuyableItemIdentifier,
  BuyableItemTypes,
} from '../types';

type BuyableItemSelectorProps = {
  buyableItemIdentifier: number;
  value?: number;
  availableBuyableItems: AvailableBuyableItemTypes;
  onSelect?: (id: number, buyableItem?: ShopItem) => void;
  displayNewWebshop?: boolean;
};

const BuyableItemSelector: React.FC<BuyableItemSelectorProps> = React.memo(
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
            value={value ?? null}
          />
        );
      default:
        return null;
    }
  },
);

type BuyableItemAugmented = BuyableItemTypes & {
  voucher: string;
  voucher_reason: string;
  hasCustomPrice: boolean;
  price: string;
  buyable_item_id: number;
};

type Props = {
  onAddBuyableItem: (
    buyableItemIdentifier: BuyableItemIdentifier,
    buyableItem: BuyableItemAugmented,
  ) => void;
  availableBuyableItems: AvailableBuyableItemTypes;
  member: { credit_account_balance: number };
  displayNewWebshop?: boolean;
  isCustomDiscountReasonRequired: boolean;
};

const DEFAULT_PRICE = '0.00';
const DEFAULT_PERCENT = '0.00';

const getPriceForItem = (
  item: BuyableItemTypes,
  identifier: BuyableItemIdentifier,
): string => {
  if (identifier === BUYABLE_ITEM_PASS && 'base_price' in item) {
    const basePrice = item.base_price;
    return typeof basePrice === 'string' ? basePrice : basePrice.toString();
  }
  if (
    [
      BUYABLE_ITEM_SHOP_ITEM,
      BUYABLE_ITEM_PRIVATE_PASS,
      BUYABLE_ITEM_COMBO_ITEM,
      BUYABLE_ITEM_GIFTCARD,
    ].includes(identifier)
  ) {
    // Warning: Price can be null on Custom Amount Giftcard
    const price = item.price ?? DEFAULT_PRICE;
    return typeof price === 'string' ? price : price.toString();
  }

  return DEFAULT_PRICE;
};

const ButtonAddWithWarning = withConfirm(Button, 'onClick', {
  title: 'invoice:invoicePaymentPackTagWarningDialog.title',
  cancel: 'invoice:invoicePaymentPackTagWarningDialog.cancel',
  confirm: 'invoice:invoicePaymentPackTagWarningDialog.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('invoice:invoicePaymentPackTagWarningDialog.content')}</p>
  ),
});

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
    useState<BuyableItemIdentifier>(BUYABLE_ITEM_PASS);

  const [buyableItemId, setBuyableItemId] = useState<number | null>(null);

  /**
   * selectedBuyableItem tracks the selected item, which can be:
   * - either a New Webshop item retrieved from ObjectSearchComponent (no store in redux)
   * - or an item from the redux store for other buyables kinds
   * It's the source of truth for all manipulations afterwards, including:
   * - retrieving the base price
   * - adding the item to the invoice
   *
   * @todo Add all buyable items type in the state type and remove the unpaginated call
   */
  const [selectedBuyableItem, setSelectedBuyableItem] = useState<
    ShopItem | BuyableItemTypes | null | undefined
  >(null);

  const [quantity, setQuantity] = useState(1);

  const [voucher, setVoucher] = useState<string | null>(null);
  const [errors, setErrors] = useState(false);
  const [voucherPercent, setVoucherPercent] = useState<string | null>(null);
  const [voucherReason, setVoucherReason] = useState<string | null>(null);
  const [voucherReasonErrors, setVoucherReasonErrors] = useState(false);

  const [warnManagerOnInvoice, setWarnManagerOnInvoice] = useState(false);

  const isBuyableShopItemFromNewWebshop =
    buyableItemIdentifier === BUYABLE_ITEM_SHOP_ITEM && displayNewWebshop;

  const [finalPricePreview, setFinalPricePreview] = useState<string | null>(
    null,
  );

  const selectedBuyablePrice: number = useMemo(() => {
    if (!selectedBuyableItem) {
      return parseFloat(DEFAULT_PRICE);
    }

    const price = getPriceForItem(selectedBuyableItem, buyableItemIdentifier);
    return parseFloat(price);
  }, [buyableItemIdentifier, selectedBuyableItem]);

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
      setBuyableItemIdentifier(parseInt(value, 10) as BuyableItemIdentifier);
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

      const selectedBuyable = isBuyableShopItemFromNewWebshop
        ? newSelectedBuyableItem
        : availableBuyableItems[buyableItemIdentifier].find(
            (buyableItem: BuyableItemTypes) => buyableItem.id === item_id,
          );
      setSelectedBuyableItem(selectedBuyable);

      if (selectedBuyable) {
        const initialFinalPrice = getPriceForItem(
          selectedBuyable,
          buyableItemIdentifier,
        );
        setFinalPricePreview(initialFinalPrice || DEFAULT_PRICE);
      } else {
        setFinalPricePreview(DEFAULT_PRICE);
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
      (parseFloat(voucher ?? DEFAULT_PRICE) > 0 ||
        parseFloat(voucherPercent ?? DEFAULT_PERCENT) > 0) &&
      isCustomDiscountReasonRequired
    );
  }, [voucher, voucherPercent, isCustomDiscountReasonRequired]);

  const onClickAddInvoiceItem = useCallback(() => {
    if (!voucherReason && shouldEnterCustomDiscountReason) {
      setVoucherReasonErrors(true);
      return;
    }

    if (!selectedBuyableItem) {
      return;
    }

    setVoucherReasonErrors(false);

    const finalBuyableItem = {
      ...selectedBuyableItem,
      buyable_item_id: selectedBuyableItem.id,
      price: selectedBuyablePrice.toFixed(2),
      // Price can be null for giftcard, but since selectedBuyablePrice is sanitized
      // We need to detect hasCustomPrice from the root item
      hasCustomPrice: !selectedBuyableItem.price,
      voucher: parseFloat(voucher || DEFAULT_PRICE).toFixed(2),
      voucher_reason: voucherReason || '',
    };
    for (let i = 0; i < quantity; i++) {
      onAddBuyableItem(
        buyableItemIdentifier,
        finalBuyableItem as BuyableItemAugmented,
      );
    }
  }, [
    voucherReason,
    buyableItemIdentifier,
    voucher,
    onAddBuyableItem,
    selectedBuyableItem,
    selectedBuyablePrice,
    shouldEnterCustomDiscountReason,
    quantity,
  ]);

  const onChangeVoucherCredit = useCallback(
    (value: string) => {
      setVoucher(value);

      const parsedValue = parseFloat(value);
      setErrors(parsedValue < 0 || selectedBuyablePrice < parsedValue);

      // Infer Discount percent based on the new Discount credit
      const percent =
        selectedBuyablePrice > 0
          ? ((parsedValue / selectedBuyablePrice) * 100).toFixed(2)
          : DEFAULT_PRICE;
      setVoucherPercent(percent);

      setFinalPricePreview(
        (selectedBuyablePrice - parseFloat(value)).toFixed(2),
      );
    },
    [selectedBuyablePrice],
  );

  const handleOnChangeVoucherCredit = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChangeVoucherCredit(event.target.value || DEFAULT_PRICE);
    },
    [onChangeVoucherCredit],
  );

  const handleOnBlurVoucherCredit = useCallback(() => {
    setVoucher((prevState) =>
      parseFloat(prevState ?? DEFAULT_PRICE).toFixed(2),
    );
  }, []);

  const onChangeVoucherPercent = useCallback(
    (percent: string) => {
      setVoucherPercent(percent);

      // Infer Discount credit based on the new Discount percent
      const newVoucher = (selectedBuyablePrice * parseFloat(percent)) / 100;
      setVoucher(newVoucher.toFixed(2));

      setErrors(newVoucher < 0 || selectedBuyablePrice < newVoucher);

      setFinalPricePreview((selectedBuyablePrice - newVoucher).toFixed(2));
    },
    [selectedBuyablePrice],
  );

  const handleOnChangeVoucherPercent = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChangeVoucherPercent(event.target.value || DEFAULT_PERCENT);
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
      setFinalPricePreview(pricePreview);

      const roundedPricePreviewNumber = parseFloat(
        (parseFloat(pricePreview) || 0).toFixed(2),
      );

      const newPercent = selectedBuyablePrice
        ? (
            ((selectedBuyablePrice - roundedPricePreviewNumber) /
              selectedBuyablePrice) *
            100
          ).toFixed(2)
        : DEFAULT_PERCENT;

      const newVoucher = (
        selectedBuyablePrice - roundedPricePreviewNumber
      ).toFixed(2);

      setVoucherPercent(newPercent);
      setVoucher(newVoucher);
      setErrors(
        parseFloat(newVoucher) < 0 ||
          parseFloat(newVoucher) > selectedBuyablePrice,
      );
    },
    [selectedBuyablePrice],
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
    setFinalPricePreview((prevState) =>
      parseFloat(prevState ?? DEFAULT_PRICE).toFixed(2),
    );
  }, []);

  React.useEffect(() => {
    if (!buyableItemId || !buyableItemIdentifier || !member) {
      return setWarnManagerOnInvoice(false);
    }

    if (buyableItemIdentifier === BUYABLE_ITEM_PASS) {
      return setWarnManagerOnInvoice(
        paymentPackTagsAndMemberTagsCompatibilty(
          selectedBuyableItem as PaymentPack,
          // @ts-expect-error
          member?.tags,
        ),
      );
    }
    return setWarnManagerOnInvoice(false);
  }, [buyableItemIdentifier, selectedBuyableItem, member, buyableItemId]);

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
                value={buyableItemId ?? undefined}
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
                          max: selectedBuyablePrice ?? 0,
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
                      value={voucher === null ? DEFAULT_PRICE : voucher}
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
                          voucherPercent === null
                            ? DEFAULT_PERCENT
                            : voucherPercent
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
                            max: selectedBuyablePrice ?? 0,
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
                            ? DEFAULT_PRICE
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
              {!warnManagerOnInvoice ? (
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
