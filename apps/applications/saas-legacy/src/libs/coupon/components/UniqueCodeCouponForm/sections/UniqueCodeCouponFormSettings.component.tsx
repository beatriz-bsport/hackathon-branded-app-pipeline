import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import {
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
} from '@bsport/common/lib/master-data/buyable-items.js';
import { useFormikContext } from 'formik';
import { FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import FormSection from '#src/components/forms/FormSection';

import { UniqueCodeCouponCreationPayload } from '#src/libs/coupon/types';
// @ts-expect-error
import ShopItemListItem from '#src/libs/shop/components/ShopItemListItem.component';
import PrivatePassListItem from '#src/libs/private-service/components/pass/PrivatePassListItem.component';
// @ts-expect-error
import PaymentComboListItem from '#src/libs/payment-combo/components/PaymentComboListItem.component';
import PaymentPackListItem from '#src/libs/payment-packs/components/PaymentPackListItem.component';

import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { PrivatePass } from '#src/libs/private-service/types';
import type { ShopItem } from '#src/libs/shop/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type { SelectOption } from '#src/libs/types';
import { useObjectSearch } from '#src/libs/fuzzy-search/hooks/useObjectSearch';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import { paymentPackOption } from '#src/libs/payment-packs/components/PaymentPackSelector.component';
import { shopItemOption } from '#src/libs/shop/components/ShopItemSelector.component';
import { privatePassOption } from '#src/libs/private-service/components/pass/PrivatePassSelector.component';
//@ts-expect-error
import { paymentComboOption } from '#src/libs/payment-combo/components/PaymentComboSelector.component';
import {
  FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_OLD_WEBSHOP,
  FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_WEBSHOP_REWORKED,
} from '#src/libs/shop/components/ShopReworkedProductList/constants';
import { FeatureFlags, useSafeFlag } from '#src/utils/feature-flag';

type Props = {
  isProcessing: boolean;
  displayNewWebshop: boolean;
};

const UniqueCodeCouponFormSettings: React.FC<Props> = ({
  isProcessing,
  displayNewWebshop,
}) => {
  const { t } = useTranslation('coupon');

  const classes = useStyles();

  const { values, setFieldValue, errors } =
    useFormikContext<UniqueCodeCouponCreationPayload>();

  const shouldDisplayNewSubscriptionContracts = useSafeFlag(
    FeatureFlags.NEW_SUBSCRIPTION_CONTRACTS,
  );

  // Filtered values

  const formatSearchOptions = useCallback(
    (
      searchResults:
        | PaymentPack[]
        | PaymentCombo[]
        | ShopItem[]
        | PrivatePass[],
    ) => {
      return searchResults.map((result) => ({
        label: result.name,
        value: result.id,
        pp: result,
      }));
    },
    [],
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
    ({ value }: SelectOption<number>) => {
      setFieldValue('applies_to', BUYABLE_ITEM_PASS);
      setFieldValue('only_on_objects', [value]);
    },
    [setFieldValue],
  );

  const handleOnChangeShopItemSelector = useCallback(
    ({ value }: SelectOption<number>) => {
      setFieldValue('applies_to', BUYABLE_ITEM_SHOP_ITEM);
      setFieldValue('only_on_objects', [value]);
    },
    [setFieldValue],
  );

  const handleOnChangePrivatePassSelector = useCallback(
    ({ value }: SelectOption<number>) => {
      setFieldValue('applies_to', BUYABLE_ITEM_PRIVATE_PASS);
      setFieldValue('only_on_objects', [value]);
    },
    [setFieldValue],
  );

  const handleOnChangePaymentComboSelector = useCallback(
    ({ value }: SelectOption<number>) => {
      setFieldValue('applies_to', BUYABLE_ITEM_COMBO_ITEM);
      setFieldValue('only_on_objects', [value]);
    },
    [setFieldValue],
  );

  const { getResultsById } = useObjectSearch();

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

  const webshopSearchParams = displayNewWebshop
    ? FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_WEBSHOP_REWORKED
    : FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_OLD_WEBSHOP;

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
            <ObjectSearchComponent
              additionalParams={{
                disabled: false,
                ...(doesApplyToPass &&
                  values?.only_on_objects && {
                    id__not_in: values.only_on_objects,
                  }),
                ...(shouldDisplayNewSubscriptionContracts && {
                  from_subscription: false,
                }),
              }}
              components={{ Option: paymentPackOption }}
              disabled={isProcessing}
              initialValues={values?.only_on_objects}
              onChange={handleOnChangePaymentPackSelector}
              optionsFormatter={formatSearchOptions}
              placeholder={t(
                'uniqueCodeCoupon.form.selectorPlaceholder.paymentPack',
              )}
              searchedObjectType="payment_pack"
              value={[]}
            />
            {doesApplyToPass
              ? values?.only_on_objects?.map((paymentPackId, index) => (
                  <PaymentPackListItem
                    key={`${paymentPackId}-${index}`}
                    asStandardPass
                    disabled={isProcessing}
                    onDelete={handleUnselectItem(paymentPackId)}
                    pack={getResultsById('payment_pack')[paymentPackId]}
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
            <ObjectSearchComponent
              additionalParams={{
                ...webshopSearchParams,
                ...(doesApplyToShopItem &&
                  values?.only_on_objects && {
                    id__not_in: values.only_on_objects,
                  }),
              }}
              components={{ Option: shopItemOption }}
              disabled={isProcessing}
              initialValues={values?.only_on_objects}
              onChange={handleOnChangeShopItemSelector}
              optionsFormatter={formatSearchOptions}
              placeholder={t(
                'uniqueCodeCoupon.form.selectorPlaceholder.shopItem',
              )}
              searchedObjectType="shop_item"
              value={[]}
            />
            {doesApplyToShopItem
              ? values?.only_on_objects?.map((shopItemId, index) => (
                  <ShopItemListItem
                    key={`${shopItemId}-${index}`}
                    dense
                    disabled={isProcessing}
                    onDelete={handleUnselectItem(shopItemId)}
                    shopitem={getResultsById('shop_item')[shopItemId]}
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
            <ObjectSearchComponent
              additionalParams={{
                ...(doesApplyToPrivatePass &&
                  values?.only_on_objects && {
                    id__not_in: values.only_on_objects,
                  }),
                ...(shouldDisplayNewSubscriptionContracts && {
                  from_subscription: false,
                }),
              }}
              components={{
                Option: privatePassOption,
              }}
              disabled={isProcessing}
              initialValues={values?.only_on_objects}
              onChange={handleOnChangePrivatePassSelector}
              optionsFormatter={formatSearchOptions}
              placeholder={t(
                'uniqueCodeCoupon.form.selectorPlaceholder.privatePass',
              )}
              searchedObjectType="private_pass"
              value={[]}
            />
            {doesApplyToPrivatePass
              ? values?.only_on_objects?.map((privatePassId, index) => (
                  <PrivatePassListItem
                    key={`${privatePassId}-${index}`}
                    asStandardPass
                    dense
                    removePaper
                    onDelete={handleUnselectItem(privatePassId)}
                    pass={getResultsById('private_pass')[privatePassId]}
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
            <ObjectSearchComponent
              additionalParams={{
                ...(doesApplyToPack &&
                  values?.only_on_objects && {
                    id__not_in: values.only_on_objects,
                  }),
              }}
              components={{ Option: paymentComboOption }}
              disabled={isProcessing}
              initialValues={values?.only_on_objects}
              onChange={handleOnChangePaymentComboSelector}
              optionsFormatter={formatSearchOptions}
              placeholder={t(
                'uniqueCodeCoupon.form.selectorPlaceholder.paymentCombo',
              )}
              searchedObjectType="payment_combo"
              value={[]}
            />

            {doesApplyToPack
              ? values.only_on_objects?.map((paymentComboId, index) => (
                  <PaymentComboListItem
                    key={`${paymentComboId}-${index}`}
                    dense
                    disabled={isProcessing}
                    onDelete={handleUnselectItem(paymentComboId)}
                    paymentCombo={
                      getResultsById('payment_combo')[paymentComboId]
                    }
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
