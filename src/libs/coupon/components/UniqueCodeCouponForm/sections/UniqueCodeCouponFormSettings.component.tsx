import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import {
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';
import { useFormikContext } from 'formik';
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { ImmutableArray } from 'seamless-immutable';
import { Alert } from '@material-ui/lab';
import FormSection from '#components/forms/FormSection';

import { UniqueCodeCouponCreationPayload } from '#libs/coupon/types';
import PaymentPackSelector from '#libs/payment-packs/components/PaymentPackSelector.component';
// @ts-expect-error
import ShopItemSelector from '#libs/shop/components/ShopItemSelector.component';
// @ts-expect-error
import ShopItemListItem from '#libs/shop/components/ShopItemListItem.component';
// @ts-expect-error
import PrivatePassSelector from '#libs/private-service/components/pass/PrivatePassSelector.component';
import PrivatePassListItem from '#libs/private-service/components/pass/PrivatePassListItem.component';
// @ts-expect-error
import PaymentComboSelector from '#libs/payment-combo/components/PaymentComboSelector.component';
// @ts-expect-error
import PaymentComboListItem from '#libs/payment-combo/components/PaymentComboListItem.component';
import PaymentPackListItem from '#libs/payment-packs/components/PaymentPackListItem.component';

import type { PaymentPack } from '#libs/payment-packs/types';
import type { PrivatePass } from '#libs/private-service/types';
import type { ShopItem } from '#libs/shop/types';
import type { PaymentCombo } from '#libs/payment-combo/types';

type Props = {
  paymentPacks: PaymentPack[];
  paymentPacksById: { [key: number]: PaymentPack };
  privatePasses: PrivatePass[];
  privatePassesById: {
    [key: number]: PrivatePass;
  };
  shopItems: ImmutableArray<ShopItem>;
  shopItemsById: {
    [key: number]: ShopItem;
  };
  paymentCombos: PaymentCombo[];
  paymentCombosById: {
    [key: number]: PaymentCombo;
  };
  isProcessing: boolean;
};

const UniqueCodeCouponFormSettings: React.FC<Props> = ({
  paymentPacks,
  paymentPacksById,
  privatePasses,
  privatePassesById,
  shopItems,
  shopItemsById,
  paymentCombos,
  paymentCombosById,
  isProcessing,
}) => {
  const { t } = useTranslation('coupon');

  const classes = useStyles();

  const { values, setFieldValue, errors } =
    useFormikContext<UniqueCodeCouponCreationPayload>();

  // Filtered values

  const filteredPaymentPacks = useMemo(
    () =>
      paymentPacks
        ?.filter((paymentPack) => !paymentPack.disabled)
        ?.filter(
          (paymentPack) => !values?.only_on_objects?.includes(paymentPack.id),
        ) ?? [],
    [paymentPacks, values?.only_on_objects],
  );

  const filteredShopItems = useMemo(
    () =>
      shopItems
        ?.filter((item) => item.subshop && !item.disabled)
        ?.filter((item) => !values.only_on_objects?.includes(item.id)) ?? [],
    [shopItems, values?.only_on_objects],
  );

  const filteredPrivatePasses = useMemo(
    () =>
      privatePasses
        ?.filter((privatePass) => privatePass.available)
        ?.filter((pass) => !values.only_on_objects?.includes(pass.id)) ?? [],
    [privatePasses, values?.only_on_objects],
  );

  const filteredPaymentCombos = useMemo(
    () =>
      paymentCombos
        ?.filter((paymentCombo) => paymentCombo.available)
        ?.filter((pack) => !values.only_on_objects?.includes(pack.id)) ?? [],
    [paymentCombos, values?.only_on_objects],
  );

  // Handlers

  const handleOnChangeAppliesTo = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (
        [
          BUYABLE_ITEM_PASS,
          BUYABLE_ITEM_SHOP_ITEM,
          BUYABLE_ITEM_PRIVATE_PASS,
          BUYABLE_ITEM_COMBO_ITEM,
        ].includes(parseInt(event.target.value, 10))
      ) {
        setFieldValue('only_on_objects', []);
        setFieldValue('applies_to', parseInt(event.target.value, 10));
      }
    },
    [setFieldValue],
  );

  const handleOnChangePaymentPackSelector = useCallback(
    (paymentPackId) => {
      setFieldValue('applies_to', BUYABLE_ITEM_PASS);
      setFieldValue('only_on_objects', [paymentPackId]);
    },
    [setFieldValue],
  );

  const handleOnChangeShopItemSelector = useCallback(
    (shopItemId) => {
      setFieldValue('applies_to', BUYABLE_ITEM_SHOP_ITEM);
      setFieldValue('only_on_objects', [shopItemId]);
    },
    [setFieldValue],
  );

  const handleOnChangePrivatePassSelector = useCallback(
    (privatePassId) => {
      setFieldValue('applies_to', BUYABLE_ITEM_PRIVATE_PASS);
      setFieldValue('only_on_objects', [privatePassId]);
    },
    [setFieldValue],
  );

  const handleOnChangePaymentComboSelector = useCallback(
    (paymentComboId) => {
      setFieldValue('applies_to', BUYABLE_ITEM_COMBO_ITEM);
      setFieldValue('only_on_objects', [paymentComboId]);
    },
    [setFieldValue],
  );

  const handleUnselectItem = useCallback(
    (selectedItemId: number) => () => {
      const selectedItems =
        values?.only_on_objects?.filter(
          (itemId) => itemId !== selectedItemId,
        ) ?? [];
      setFieldValue('only_on_objects', selectedItems);
    },
    [values?.only_on_objects, setFieldValue],
  );

  const doesApplyToPass = values?.applies_to === BUYABLE_ITEM_PASS;

  const doesApplyToShopItem = values?.applies_to === BUYABLE_ITEM_SHOP_ITEM;

  const doesApplyToPrivatePass =
    values?.applies_to === BUYABLE_ITEM_PRIVATE_PASS;

  const doesApplyToPack = values?.applies_to === BUYABLE_ITEM_COMBO_ITEM;

  return (
    <FormSection
      id="unique-code-coupon-form-settings"
      sectionTitle={t('form.section.applies_to')}
    >
      <div className={classes.fullWidth}>
        <RadioGroup
          aria-disabled={isProcessing}
          aria-label="Applies to"
          onChange={handleOnChangeAppliesTo}
          value={values?.applies_to}
        >
          {!!errors?.only_on_objects && (
            <Alert severity="error">{t(errors.only_on_objects)}</Alert>
          )}
          <FormControlLabel
            control={
              <Radio
                disabled={isProcessing}
                id="unique-code-coupon-form-payment-pack-radio"
              />
            }
            label={t(`form.applies_to.choices.${BUYABLE_ITEM_PASS}`)}
            value={BUYABLE_ITEM_PASS}
          />
          <div
            className={classes.fullWidth}
            id="unique-code-coupon-form-payment-pack-selector"
          >
            <PaymentPackSelector
              nullCurrentValue
              disabled={isProcessing}
              helperText={t(
                'uniqueCodeCoupon.form.selectorPlaceholder.paymentPack',
              )}
              onChange={handleOnChangePaymentPackSelector}
              paymentPacks={filteredPaymentPacks}
            />
            {doesApplyToPass
              ? values?.only_on_objects?.map((paymentPackId, index) => (
                  <PaymentPackListItem
                    key={`${paymentPackId}-${index}`}
                    disabled={isProcessing}
                    onDelete={handleUnselectItem(paymentPackId)}
                    pack={paymentPacksById?.[paymentPackId]}
                  />
                ))
              : null}
          </div>
          <FormControlLabel
            control={
              <Radio
                disabled={isProcessing}
                id="unique-code-coupon-form-shop-item-radio"
              />
            }
            label={t(`form.applies_to.choices.${BUYABLE_ITEM_SHOP_ITEM}`)}
            value={BUYABLE_ITEM_SHOP_ITEM}
          />
          <div
            className={classes.fullWidth}
            id="unique-code-coupon-form-shop-item-selector"
          >
            <ShopItemSelector
              nullCurrentValue
              disabled={isProcessing}
              helperText={t(
                'uniqueCodeCoupon.form.selectorPlaceholder.shopItem',
              )}
              onChange={handleOnChangeShopItemSelector}
              shopItemList={filteredShopItems}
            />
            {doesApplyToShopItem
              ? values?.only_on_objects?.map((shopItemId, index) => (
                  <ShopItemListItem
                    key={`${shopItemId}-${index}`}
                    dense
                    disabled={isProcessing}
                    onDelete={handleUnselectItem(shopItemId)}
                    shopitem={shopItemsById?.[shopItemId]}
                  />
                ))
              : null}
          </div>
          <FormControlLabel
            control={
              <Radio
                disabled={isProcessing}
                id="unique-code-coupon-form-private-pass-radio"
              />
            }
            label={t(`form.applies_to.choices.${BUYABLE_ITEM_PRIVATE_PASS}`)}
            value={BUYABLE_ITEM_PRIVATE_PASS}
          />
          <div
            className={classes.fullWidth}
            id="unique-code-coupon-form-private-pass-selector"
          >
            <PrivatePassSelector
              nullCurrentValue
              disabled={isProcessing}
              helperText={t(
                'uniqueCodeCoupon.form.selectorPlaceholder.privatePass',
              )}
              onChange={handleOnChangePrivatePassSelector}
              privatePassList={filteredPrivatePasses}
            />
            {doesApplyToPrivatePass
              ? values?.only_on_objects?.map((privatePassId, index) => (
                  <PrivatePassListItem
                    key={`${privatePassId}-${index}`}
                    dense
                    removePaper
                    onDelete={handleUnselectItem(privatePassId)}
                    pass={privatePassesById?.[privatePassId]}
                  />
                ))
              : null}
          </div>
          <FormControlLabel
            control={
              <Radio
                checked={BUYABLE_ITEM_COMBO_ITEM === values?.applies_to}
                disabled={isProcessing}
                id="unique-code-coupon-form-payment-combo-radio"
              />
            }
            label={t(`form.applies_to.choices.${BUYABLE_ITEM_COMBO_ITEM}`)}
            value={BUYABLE_ITEM_COMBO_ITEM}
          />
          <div
            className={classes.fullWidth}
            id="unique-code-coupon-form-payment-combo-selector"
          >
            <PaymentComboSelector
              nullCurrentValue
              disabled={isProcessing}
              helperText={t(
                'uniqueCodeCoupon.form.selectorPlaceholder.paymentCombo',
              )}
              onChange={handleOnChangePaymentComboSelector}
              paymentComboList={filteredPaymentCombos}
            />
            {doesApplyToPack
              ? values.only_on_objects?.map((paymentComboId, index) => (
                  <PaymentComboListItem
                    key={`${paymentComboId}-${index}`}
                    dense
                    disabled={isProcessing}
                    onDelete={handleUnselectItem(paymentComboId)}
                    paymentCombo={paymentCombosById?.[paymentComboId]}
                  />
                ))
              : null}
          </div>
          <Alert severity="warning">
            {t('uniqueCodeCoupon.form.alertWarning')}
          </Alert>
        </RadioGroup>
      </div>
    </FormSection>
  );
};

const useStyles = makeStyles(() => ({
  fullWidth: {
    width: '100%',
  },
}));

export default React.memo(UniqueCodeCouponFormSettings);
