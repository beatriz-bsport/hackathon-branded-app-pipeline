import React, { SyntheticEvent } from 'react';
import { DateTime, Settings } from 'luxon';
import TextField from '@material-ui/core/TextField';
import withStyles, { ClassNameMap } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import Collapse from '@material-ui/core/Collapse';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import {
  VOUCHER_TYPE_AMOUNT,
  VOUCHER_TYPE_PERCENT,
} from '@bsport/common/lib/master-data/coupon.js';
import {
  COUPON_SUBSCRIPTION_MODE_ALL_INVOICES,
  COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE,
  COUPON_SUBSCRIPTION_MODE_NONE,
  COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE,
} from '@bsport/common/lib/master-data/coupon-subscription-mode.js';

import {
  BUYABLE_ITEM_COMBO_ITEM,
  BUYABLE_ITEM_FEE,
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
} from '@bsport/common/lib/master-data/buyable-items.js';
import Block from '@material-ui/icons/Block';
import Check from '@material-ui/icons/Check';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import { Alert } from '@material-ui/lab';
import debounce from 'lodash/debounce';
import { TFunction } from 'i18next';
import { Theme } from '@material-ui/core';
import { LocalizedLuxonUtils } from '#src/i18n/utils/luxon-picker-utils';
import TagSelector from '#src/libs/tag/components/TagSelector.selector';

import PaymentPackListItem from '#src/libs/payment-packs/components/PaymentPackListItem.component';
// @ts-expect-error
import ShopItemListItem from '#src/libs/shop/components/ShopItemListItem.component';
import PrivatePassListItem from '#src/libs/private-service/components/pass/PrivatePassListItem.component';
// @ts-expect-error
import PaymentComboListItem from '#src/libs/payment-combo/components/PaymentComboListItem.component';

import NumericInput from '#src/components/input/NumericInput.component';
import PriceInput from '#src/components/input/PriceInput.component';
import PercentInput from '#src/components/input/PercentInput.component';
import Checkbox from '#src/components/input/Checkbox.component';
import type { CheckCouponCodePayload, Coupon } from '../types';

import { PaymentPack } from '#src/libs/payment-packs/types';
import { ShopItem } from '#src/libs/shop/types';
import { PrivatePass } from '#src/libs/private-service/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';
import type { Tag, TagGroupAPI } from '#src/libs/tag/types';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { checkCouponCodeValidity } from '#src/libs/coupon/api';
import type { OptionCallback } from '#src/state/types';
import {
  WithObjectSearch,
  withObjectSearch,
} from '#src/libs/fuzzy-search/components/ObjectSearch.hoc';
import ObjectSearchComponent from '#src/libs/fuzzy-search/components/ObjectSearch.component';
import type { SelectOption } from '#src/libs/types';
import { paymentPackOption } from '#src/libs/payment-packs/components/PaymentPackSelector.component';
import { shopItemOption } from '#src/libs/shop/components/ShopItemSelector.component';
import { privatePassOption } from '#src/libs/private-service/components/pass/PrivatePassSelector.component';
// @ts-expect-error
import { paymentComboOption } from '#src/libs/payment-combo/components/PaymentComboSelector.component';
import {
  FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_OLD_WEBSHOP,
  FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_WEBSHOP_REWORKED,
} from '#src/libs/shop/components/ShopReworkedProductList/constants';
import {
  type FeatureFlagProps,
  withFeatureFlags,
} from '#src/utils/feature-flag/withFeatureFlags';

const {
  trackFormAdd,
  trackFormSuccess,
  trackFormSubmitIntent,
  trackFormCancel,
} = rudderStackFormTrackingFunctionsRegistry(
  SegmentAnalyticsFormObjectIdentifier.Coupon,
);
const ALL_BUYABLES = 100;

type Props = {
  initial?: Coupon;
  onSubmit: (data: any, options?: OptionCallback) => void;
  onCancel: () => void;
  processing: boolean;

  t: TFunction;
  classes: ClassNameMap<keyof ReturnType<typeof styles>>;

  allShopItemsById: { [key: number]: ShopItem };
  privatePasses: Array<PrivatePass>;
  paymentCombos: Array<PaymentCombo>;
  tagList: Array<Tag<TagGroupAPI>>;
  tagsLoading: boolean;
  displayNewWebshop: boolean;
} & WithObjectSearch &
  FeatureFlagProps;

type State = {
  with_expiration_date: boolean;
  isCodeTooShort: boolean;
} & Coupon;

export class CouponForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.initial) {
      this.state = {
        isCodeUsedError: false,
        isCodeTooShort: false,
        name: props.initial.name,
        percent_off: props.initial.percent_off,
        amount_off: props.initial.amount_off,
        code: props.initial.code,
        is_active: props.initial.is_active,
        only_on_first_checkout: props.initial.only_on_first_checkout,
        usage_total: props.initial.usage_total,
        usage_per_member: props.initial.usage_per_member,
        combinable: props.initial.combinable,
        minimum_amount: props.initial.minimum_amount,
        applies_to: props.initial.applies_to || ALL_BUYABLES,
        only_on_objects: props.initial.only_on_objects,
        subscription_mode: props.initial.subscription_mode,
        voucher_type: props.initial.voucher_type,
        with_expiration_date: !!props.initial.expiration_date,
        // @ts-expect-error
        expiration_date: props.initial.expiration_date
          ? DateTime.fromISO(props.initial.expiration_date)
          : DateTime.now().plus({ month: 1 }),
        whitelist_tags:
          //@ts-expect-error
          props.initial?.whitelist_tags?.map((_tag: Tag) => _tag?.id) ?? [],
        blacklist_tags:
          //@ts-expect-error
          props.initial?.blacklist_tags?.map((_tag: Tag) => _tag?.id) ?? [],
      };
    } else {
      this.state = {
        isCodeUsedError: false,
        isCodeTooShort: false,
        name: null,
        percent_off: 0,
        amount_off: 0,
        code: null,
        is_active: false,
        only_on_first_checkout: false,
        usage_total: 1000,
        usage_per_member: 1,
        combinable: false,
        minimum_amount: 0,
        applies_to: ALL_BUYABLES,
        only_on_objects: [],
        voucher_type: VOUCHER_TYPE_PERCENT,
        with_expiration_date: false,
        // @ts-expect-error
        expiration_date: DateTime.now().plus({ month: 1 }),
        subscription_mode: COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE,
        whitelist_tags: [],
        blacklist_tags: [],
      };
    }
  }

  componentDidMount() {
    trackFormAdd(this.props.initial?.id);
  }

  checkCouponCodeAvailability = debounce(async (code: string) => {
    if (!code?.length) return;
    const payload: CheckCouponCodePayload = {
      code,
      coupon_ids_to_ignore: this.props.initial?.id
        ? [this.props.initial.id]
        : [],
    };
    const { data } = await checkCouponCodeValidity(payload);
    if (
      // @ts-expect-error
      this.state.isCodeUsedError !== data?.is_used &&
      code === this.state.code
    ) {
      // @ts-expect-error
      this.setState({ isCodeUsedError: data?.is_used });
    }
  }, 500);

  checkCouponTooShort = (code: string) => {
    if (!code?.length) return;
    // if there was something not adjusted to 12 char limitation, keep it OK
    if (this.props.initial && this.props.initial.code.length < 12) {
      return;
    }
    this.setState({ isCodeTooShort: code?.length < 12 });
  };

  // @ts-expect-error
  handleChange = (key: string, isEvent: boolean) => (value) => {
    const inputValue = isEvent ? value.target.value : value;
    // @ts-expect-error
    this.setState({ [key]: inputValue });
    if (key === 'code') {
      this.checkCouponCodeAvailability(inputValue);
      this.checkCouponTooShort(inputValue);
    }
  };

  formatSearchOptions = (
    searchResults: PaymentPack[] | PaymentCombo[] | ShopItem[] | PrivatePass[],
  ) => {
    /**
     * Here we keep "pp" as we use the components from the soon-to-be-deprecated selectors, which all need this prop.
     * This will be refactored when deleting them, once they are all replaced by ObjectSearch.
     */
    return searchResults.map((result) => ({
      label: result.name,
      value: result.id,
      pp: result,
    }));
  };

  onSubmit = (ev: SyntheticEvent<any>) => {
    ev.preventDefault();
    const data = {
      name: this.state.name,
      percent_off: this.state.percent_off || 0,
      amount_off: this.state.amount_off || 0,
      code: this.state.code,
      is_active: this.state.is_active,
      only_on_first_checkout: this.state.only_on_first_checkout,
      usage_total: this.state.usage_total,
      usage_per_member: this.state.usage_per_member,
      combinable: this.state.combinable,
      subscription_mode: this.state.subscription_mode,
      minimum_amount: this.state.minimum_amount || 0,
      applies_to:
        this.state.applies_to === ALL_BUYABLES ? null : this.state.applies_to,
      voucher_type: this.state.voucher_type,
      only_on_objects: this.state.only_on_objects,
      whitelist_tags: this.state.whitelist_tags,
      blacklist_tags: this.state.blacklist_tags,
    };
    if (this.state.with_expiration_date && this.state.is_active) {
      // @ts-expect-error
      data.expiration_date = this.state.expiration_date.toISODate();
    } else {
      // @ts-expect-error
      data.expiration_date = null;
    }

    this.props.onSubmit(data, {
      onSuccess: (id) => {
        // @ts-expect-error
        trackFormSuccess(id);
      },
    });
  };

  handleIsActiveChange = (ev: React.ChangeEvent<HTMLElement>) => {
    this.setState({
      // @ts-expect-error
      is_active: ev.target.checked,
      with_expiration_date: false,
    });
  };

  createHandleAppliesToChange =
    (objectId: number) =>
    ({ value }: SelectOption<number>) => {
      let newObjects = [...this.state.only_on_objects];

      if (this.state.applies_to !== objectId) {
        this.handleChange('applies_to', false)(objectId);
        newObjects = [];
      }
      newObjects.push(value);
      this.handleChange('only_on_objects', false)(newObjects);
    };

  handlePassChange = this.createHandleAppliesToChange(BUYABLE_ITEM_PASS);

  handleShopItemChange = this.createHandleAppliesToChange(
    BUYABLE_ITEM_SHOP_ITEM,
  );

  handlePrivatePassChange = this.createHandleAppliesToChange(
    BUYABLE_ITEM_PRIVATE_PASS,
  );

  handleComboItemChange = this.createHandleAppliesToChange(
    BUYABLE_ITEM_COMBO_ITEM,
  );

  renderVoucherConfig = () => {
    const { t, initial } = this.props;
    return (
      <div>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="Voucher type"
            name="voucher_type"
            onChange={(ev) =>
              this.handleChange(
                'voucher_type',
                false,
              )(parseInt(ev.target.value, 10))
            }
            value={this.state.voucher_type}
          >
            <FormControlLabel
              control={
                <Radio
                  checked={VOUCHER_TYPE_PERCENT === this.state.voucher_type}
                  disabled={!!initial?.coupon_template_instance}
                />
              }
              label={t('form.voucher_type.percent')}
              value={VOUCHER_TYPE_PERCENT}
            />
            <FormControlLabel
              control={
                <Radio
                  checked={VOUCHER_TYPE_AMOUNT === this.state.voucher_type}
                  disabled={!!initial?.coupon_template_instance}
                />
              }
              label={t('form.voucher_type.amount')}
              value={VOUCHER_TYPE_AMOUNT}
            />
          </RadioGroup>
          <Collapse in={this.state.voucher_type === VOUCHER_TYPE_PERCENT}>
            {/* @ts-expect-error */}
            <PercentInput
              fullWidth
              disabled={!!initial?.coupon_template_instance}
              label={t('form.percent_off.label')}
              onChange={this.handleChange('percent_off', true)}
              value={this.state.percent_off}
            />
          </Collapse>
          <Collapse in={this.state.voucher_type === VOUCHER_TYPE_AMOUNT}>
            <PriceInput
              fullWidth
              disabled={!!initial?.coupon_template_instance}
              label={t('form.amount_off.label')}
              onChange={this.handleChange('amount_off', true)}
              value={this.state.amount_off}
            />
          </Collapse>
        </FormControl>
      </div>
    );
  };

  renderSubscriptionModeConfig = () => {
    const { t, initial } = this.props;
    return (
      <div>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="Subscription mode"
            // @ts-expect-error
            disabled={!!initial?.coupon_template_instance}
            name="subscription_mode"
            onChange={(ev) =>
              this.handleChange(
                'subscription_mode',
                false,
              )(parseInt(ev.target.value, 10))
            }
            value={this.state.subscription_mode}
          >
            <FormControlLabel
              control={
                <Radio
                  checked={
                    COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE ===
                    this.state.subscription_mode
                  }
                  disabled={!!initial?.coupon_template_instance}
                />
              }
              label={t(
                `form.subscription_mode.${COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE}`,
              )}
              value={COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE}
            />
            <FormControlLabel
              control={
                <Radio
                  checked={
                    COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE ===
                    this.state.subscription_mode
                  }
                  disabled={!!initial?.coupon_template_instance}
                />
              }
              label={t(
                `form.subscription_mode.${COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE}`,
              )}
              value={COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE}
            />
            <FormControlLabel
              control={
                <Radio
                  checked={
                    COUPON_SUBSCRIPTION_MODE_ALL_INVOICES ===
                    this.state.subscription_mode
                  }
                  disabled={!!initial?.coupon_template_instance}
                />
              }
              label={t(
                `form.subscription_mode.${COUPON_SUBSCRIPTION_MODE_ALL_INVOICES}`,
              )}
              value={COUPON_SUBSCRIPTION_MODE_ALL_INVOICES}
            />
            <FormControlLabel
              control={
                <Radio
                  checked={
                    COUPON_SUBSCRIPTION_MODE_NONE ===
                    this.state.subscription_mode
                  }
                  disabled={!!initial?.coupon_template_instance}
                />
              }
              label={t(
                `form.subscription_mode.${COUPON_SUBSCRIPTION_MODE_NONE}`,
              )}
              value={COUPON_SUBSCRIPTION_MODE_NONE}
            />
          </RadioGroup>
        </FormControl>
      </div>
    );
  };

  renderExpirationDate = () => {
    const { classes, t, initial } = this.props;
    return (
      <div className={classes.field}>
        <Checkbox
          checked={this.state.with_expiration_date}
          disabled={
            !!initial?.coupon_template_instance || !this.state.is_active
          }
          label={t('form.with_expiration_date.label')}
          onChange={(ev) =>
            this.handleChange('with_expiration_date', false)(ev.target.checked)
          }
        />
        <MuiPickersUtilsProvider
          locale={Settings.defaultLocale}
          utils={LocalizedLuxonUtils}
        >
          <DatePicker
            clearable
            keyboard
            openToYearSelection
            cancelLabel={t('form.expiration_date.cancel')}
            clearLabel={t('form.expiration_date.clear_date')}
            disabled={
              !!initial?.coupon_template_instance ||
              !this.state.with_expiration_date ||
              !this.state.is_active
            }
            format="D"
            initialFocusedDate={DateTime.now().toFormat('D')}
            label={t('form.expiration_date.label')}
            minDate={DateTime.now()}
            onChange={(date) =>
              this.handleChange('expiration_date', false)(date)
            }
            required={this.state.with_expiration_date && this.state.is_active}
            // @ts-expect-error
            returnMoment={false}
            value={this.state.expiration_date}
          />
        </MuiPickersUtilsProvider>
      </div>
    );
  };

  renderApply = () => {
    const {
      privatePasses,
      allShopItemsById,
      paymentCombos,
      t,
      classes,
      initial,
      displayNewWebshop,
    } = this.props;
    const webshopSearchParams = displayNewWebshop
      ? FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_WEBSHOP_REWORKED
      : FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_OLD_WEBSHOP;
    return (
      <div className={classes.fullWidth}>
        <RadioGroup
          aria-label="Applies to "
          name="applies_to"
          onChange={(ev) => {
            if (
              [
                BUYABLE_ITEM_PASS,
                BUYABLE_ITEM_SHOP_ITEM,
                BUYABLE_ITEM_FEE,
                BUYABLE_ITEM_PRIVATE_PASS,
                BUYABLE_ITEM_COMBO_ITEM,
                ALL_BUYABLES,
              ].includes(parseInt(ev.target.value, 10))
            ) {
              // @ts-expect-error
              this.handleChange('only_on_objects')([]);
              this.handleChange(
                'applies_to',
                false,
              )(parseInt(ev.target.value, 10));
            }
          }}
          value={this.state.applies_to}
        >
          <FormControlLabel
            control={
              <Radio
                checked={BUYABLE_ITEM_PASS === this.state.applies_to}
                disabled={!!initial?.coupon_template_instance}
              />
            }
            label={t(`form.applies_to.choices.${BUYABLE_ITEM_PASS}`)}
            value={BUYABLE_ITEM_PASS}
          />
          <div className={classes.fullWidth}>
            <ObjectSearchComponent
              additionalParams={{
                disabled: false,
                id__not_in:
                  this.state.applies_to === BUYABLE_ITEM_PASS
                    ? this.state.only_on_objects
                    : [],
                ...(this.props.shouldDisplayNewSubscriptionContracts && {
                  from_subscription: false,
                }),
              }}
              components={{
                Option: paymentPackOption,
              }}
              disabled={!!initial?.coupon_template_instance}
              initialValues={this.state.only_on_objects}
              onChange={this.handlePassChange}
              optionsFormatter={this.formatSearchOptions}
              placeholder={t('form.selectorPlaceholder.paymentPack')}
              searchedObjectType="payment_pack"
              value={[]}
            />
            {this.state.applies_to === BUYABLE_ITEM_PASS
              ? this.state.only_on_objects.map((id, i) => (
                  <PaymentPackListItem
                    key={`${id}-${i}`}
                    asStandardPass
                    disabled={!!initial?.coupon_template_instance}
                    onDelete={() => {
                      const newObjects = this.state.only_on_objects.filter(
                        (ido) => ido !== id,
                      );
                      this.handleChange('only_on_objects', false)(newObjects);
                    }}
                    pack={this.props.getResultsById('payment_pack')[id]}
                  />
                ))
              : null}
          </div>
          <FormControlLabel
            control={
              <Radio
                checked={BUYABLE_ITEM_SHOP_ITEM === this.state.applies_to}
                disabled={!!initial?.coupon_template_instance}
              />
            }
            label={t(`form.applies_to.choices.${BUYABLE_ITEM_SHOP_ITEM}`)}
            value={BUYABLE_ITEM_SHOP_ITEM}
          />
          <div className={classes.fullWidth}>
            <ObjectSearchComponent
              hideSelectedOptions
              additionalParams={{
                ...webshopSearchParams,
                id__not_in:
                  this.state.applies_to === BUYABLE_ITEM_SHOP_ITEM
                    ? this.state.only_on_objects
                    : [],
              }}
              components={{
                Option: shopItemOption,
              }}
              disabled={!!initial?.coupon_template_instance}
              initialValues={this.state.only_on_objects}
              onChange={this.handleShopItemChange}
              optionsFormatter={this.formatSearchOptions}
              placeholder={t('form.selectorPlaceholder.shopitem')}
              searchedObjectType="shop_item"
              value={[]}
            />
            {this.state.applies_to === BUYABLE_ITEM_SHOP_ITEM
              ? this.state.only_on_objects.map((id, i) => (
                  <ShopItemListItem
                    key={`${id}-${i}`}
                    dense
                    disabled={!!initial?.coupon_template_instance}
                    onDelete={
                      initial?.coupon_template_instance
                        ? undefined
                        : () => {
                            const newObjects =
                              this.state.only_on_objects.filter(
                                (ido) => ido !== id,
                              );
                            this.handleChange(
                              'only_on_objects',
                              false,
                            )(newObjects);
                          }
                    }
                    shopitem={allShopItemsById[id]}
                  />
                ))
              : null}
          </div>
          <FormControlLabel
            control={
              <Radio
                checked={BUYABLE_ITEM_PRIVATE_PASS === this.state.applies_to}
                disabled={!!initial?.coupon_template_instance}
              />
            }
            label={t(`form.applies_to.choices.${BUYABLE_ITEM_PRIVATE_PASS}`)}
            value={BUYABLE_ITEM_PRIVATE_PASS}
          />
          <div className={classes.fullWidth}>
            <ObjectSearchComponent
              additionalParams={{
                available: true,
                id__not_in:
                  this.state.applies_to === BUYABLE_ITEM_PRIVATE_PASS
                    ? this.state.only_on_objects
                    : [],
                ...(this.props.shouldDisplayNewSubscriptionContracts && {
                  from_subscription: false,
                }),
              }}
              components={{
                Option: privatePassOption,
              }}
              disabled={!!initial?.coupon_template_instance}
              getOptionLabel={(option) => option.label}
              initialValues={this.state.only_on_objects}
              onChange={this.handlePrivatePassChange}
              optionsFormatter={this.formatSearchOptions}
              placeholder={t('form.selectorPlaceholder.privatePass')}
              searchedObjectType="private_pass"
              value={[]}
            />
            {this.state.applies_to === BUYABLE_ITEM_PRIVATE_PASS &&
            privatePasses.length
              ? this.state.only_on_objects.map((id, i) => (
                  <PrivatePassListItem
                    key={`${id}-${i}`}
                    asStandardPass
                    dense
                    // @ts-expect-error
                    disabled={!!initial?.coupon_template_instance}
                    onDelete={() => {
                      const newObjects = this.state.only_on_objects.filter(
                        (ido) => ido !== id,
                      );
                      this.handleChange('only_on_objects', false)(newObjects);
                    }}
                    pass={this.props.getResultsById('private_pass')[id]}
                  />
                ))
              : null}
          </div>
          <FormControlLabel
            control={
              <Radio
                checked={BUYABLE_ITEM_COMBO_ITEM === this.state.applies_to}
                disabled={!!initial?.coupon_template_instance}
              />
            }
            label={t(`form.applies_to.choices.${BUYABLE_ITEM_COMBO_ITEM}`)}
            value={BUYABLE_ITEM_COMBO_ITEM}
          />
          <div className={classes.fullWidth}>
            <ObjectSearchComponent
              additionalParams={{
                available: true,
                id__not_in:
                  this.state.applies_to === BUYABLE_ITEM_COMBO_ITEM
                    ? this.state.only_on_objects
                    : [],
              }}
              components={{ Option: paymentComboOption }}
              disabled={!!initial?.coupon_template_instance}
              initialValues={this.state.only_on_objects}
              onChange={this.handleComboItemChange}
              optionsFormatter={this.formatSearchOptions}
              placeholder={t('form.selectorPlaceholder.paymentCombo')}
              searchedObjectType="payment_combo"
              value={[]}
            />
            {this.state.applies_to === BUYABLE_ITEM_COMBO_ITEM &&
            paymentCombos.length
              ? this.state.only_on_objects.map((id, i) => (
                  <PaymentComboListItem
                    key={`${id}-${i}`}
                    dense
                    disabled={!!initial?.coupon_template_instance}
                    onDelete={() => {
                      const newObjects = this.state.only_on_objects.filter(
                        (ido) => ido !== id,
                      );
                      this.handleChange('only_on_objects', false)(newObjects);
                    }}
                    paymentCombo={
                      this.props.getResultsById('payment_combo')[id]
                    }
                  />
                ))
              : null}
          </div>
          <FormControlLabel
            control={
              <Radio
                checked={BUYABLE_ITEM_FEE === this.state.applies_to}
                disabled={!!initial?.coupon_template_instance}
              />
            }
            label={t(`form.applies_to.choices.${BUYABLE_ITEM_FEE}`)}
            value={BUYABLE_ITEM_FEE}
          />
          <FormControlLabel
            control={
              <Radio
                checked={ALL_BUYABLES === this.state.applies_to}
                disabled={!!initial?.coupon_template_instance}
              />
            }
            label={t('form.applies_to.choices.all')}
            value={ALL_BUYABLES}
          />
        </RadioGroup>
      </div>
    );
  };

  renderTags = (tag_list_kind: string) => {
    const { t, classes, tagList, initial } = this.props;
    return (
      <React.Fragment>
        <div className={classes.sectionTitle}>
          <div className={classes.iconAndTitle}>
            {tag_list_kind === 'whitelist_tags' ? <Check /> : <Block />}
            <div className={classes.tagKind}>
              <Typography variant="h6">
                {t(`form.section.${tag_list_kind}`)}
              </Typography>
            </div>
          </div>
        </div>
        <Divider />
        <div className={classes.flexFormControl}>
          <div className={classes.selector}>
            <TagSelector
              isClearable
              allTagsWithTagGroup={tagList.filter((tag) => {
                switch (tag_list_kind) {
                  case 'whitelist_tags':
                    return !this.state.blacklist_tags.includes(tag.id);

                  case 'blacklist_tags':
                    return !this.state.whitelist_tags.includes(tag.id);
                  default:
                    return false;
                }
              })}
              closeMenuOnSelect={false}
              isDisabled={!!initial?.coupon_template_instance}
              menuPlacement={
                tag_list_kind === 'whitelist_tags' ? 'auto' : 'top'
              }
              onChange={(options) => {
                const newObjects = options.map((option) => option.value);
                // @ts-expect-error
                this.handleChange(tag_list_kind)(newObjects);
              }}
              onDeleteTag={(tagId) => {
                // @ts-expect-error
                const newObject = this.state[tag_list_kind].filter(
                  (id: number) => tagId !== id,
                );
                // @ts-expect-error
                this.handleChange(tag_list_kind)(newObject);
              }}
              // @ts-expect-error
              selectedTags={this.state[tag_list_kind]}
            />
          </div>
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { t, classes, initial } = this.props;
    return (
      <form className={classes.container} onSubmit={this.onSubmit}>
        {!!initial?.coupon_template_instance && (
          <div className={classes.notEditableContainer}>
            <InfoOutlined className={classes.redLeftIcon} />
            <Typography className={classes.darkRed} variant="body1">
              {t('couponTemplate.notEditable')}
            </Typography>
          </div>
        )}
        <Alert className={classes.alert} severity="info">
          {t('form.alert')}
        </Alert>
        <Typography variant="h6">{t('form.section.general')}</Typography>
        <TextField
          fullWidth
          required
          className={classes.field}
          disabled={!!initial?.coupon_template_instance}
          helperText={t('form.name.helperText')}
          label={t('form.name.label')}
          onChange={this.handleChange('name', true)}
          value={this.state.name}
        />
        <TextField
          fullWidth
          required
          className={classes.field}
          disabled={!!initial?.coupon_template_instance}
          // @ts-expect-error
          error={this.state.isCodeUsedError || this.state.isCodeTooShort}
          helperText={
            // @ts-expect-error
            this.state.isCodeUsedError
              ? t('form.code.codeAlreadyInUse')
              : this.state.isCodeTooShort
              ? t('form.code.codeTooShort')
              : t('form.code.helperText')
          }
          inputProps={{ maxLength: 32 }}
          label={t('form.code.label')}
          onChange={this.handleChange('code', true)}
          value={this.state.code}
        />
        <Typography className={classes.sectionTitle} variant="h6">
          {t('form.section.voucherConfig')}
        </Typography>
        {this.renderVoucherConfig()}
        <Typography className={classes.sectionTitle} variant="h6">
          {t('form.section.applies_to')}
        </Typography>
        {this.renderApply()}
        <Typography className={classes.sectionTitle} variant="h6">
          {t('form.section.availability')}
        </Typography>
        <Checkbox
          checked={this.state.is_active}
          disabled={!!initial?.coupon_template_instance}
          helperText={t('form.is_active.helperText')}
          label={t('form.is_active.label')}
          onChange={this.handleIsActiveChange}
        />
        <div className={classes.field}>{this.renderExpirationDate()}</div>
        <Typography className={classes.sectionTitle} variant="h6">
          {t('form.section.usability')}
        </Typography>
        <div className={classes.field}>
          <NumericInput
            fullWidth
            disabled={!!initial?.coupon_template_instance}
            label={t('form.usage_per_member.label')}
            onChange={this.handleChange('usage_per_member', true)}
            value={this.state.usage_per_member}
          />
        </div>
        <div className={classes.field}>
          <NumericInput
            fullWidth
            disabled={!!initial?.coupon_template_instance}
            label={t('form.usage_total.label')}
            onChange={this.handleChange('usage_total', true)}
            value={this.state.usage_total}
          />
        </div>
        <Typography className={classes.sectionTitle} variant="h6">
          {t('form.section.subscription')}
        </Typography>
        {this.renderSubscriptionModeConfig()}
        <Typography className={classes.sectionTitle} variant="h6">
          {t('form.section.advanced')}
        </Typography>
        <Checkbox
          checked={this.state.only_on_first_checkout}
          disabled={!!initial?.coupon_template_instance}
          label={t('form.only_on_first_checkout.label')}
          onChange={(ev) =>
            this.handleChange(
              'only_on_first_checkout',
              false,
            )(ev.target.checked)
          }
        />
        <Checkbox
          checked={this.state.combinable}
          disabled={!!initial?.coupon_template_instance}
          label={t('form.combinable.label')}
          onChange={(ev) =>
            this.handleChange('combinable', false)(ev.target.checked)
          }
        />
        <div className={classes.field}>
          <PriceInput
            fullWidth
            disabled={!!initial?.coupon_template_instance}
            label={t('form.minimum_amount.label')}
            onChange={this.handleChange('minimum_amount', true)}
            value={this.state.minimum_amount}
          />
        </div>
        <Typography className={classes.sectionTitle} variant="h6">
          {t('form.section.tags')}
        </Typography>
        {/* @ts-expect-error */}
        {this.state.tag_selection_error && (
          <Typography color="error">
            {/* @ts-expect-error */}
            {t(this.state.tag_selection_error)}
          </Typography>
        )}
        <Typography className={classes.tagInfo}>
          {t('form.section.tagInfo')}
        </Typography>
        {!this.props.tagsLoading && this.renderTags('whitelist_tags')}
        {!this.props.tagsLoading && this.renderTags('blacklist_tags')}
        <div className={classes.buttonContainer}>
          <Button
            onClick={() => {
              trackFormCancel(this.props.initial?.id);
              this.props.onCancel();
            }}
          >
            {t('form.actions.cancel')}
          </Button>
          <Button
            className={classes.actionButton}
            color="primary"
            disabled={
              !!initial?.coupon_template_instance ||
              this.props.processing ||
              this.state.minimum_amount < 0 ||
              // @ts-expect-error
              this.state.tag_selection_error ||
              // @ts-expect-error
              this.state.isCodeUsedError ||
              this.state.isCodeTooShort
            }
            onClick={(ev) => {
              ev.preventDefault();
              trackFormSubmitIntent(this.props.initial?.id);
              this.onSubmit(ev);
            }}
            variant="contained"
          >
            {t('form.actions.submit')}
          </Button>
          {this.props.processing ? <CircularProgress /> : null}
        </div>
      </form>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  redLeftIcon: {
    color: theme.palette.error.main,
    marginRight: theme.spacing(2),
  },
  darkRed: {
    color: '#621B16',
  },
  notEditableContainer: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.error.main,
    borderRadius: '5px',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  sectionTitle: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  field: {
    width: '100%',
    marginBottom: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    width: '100%',
  },
  actionButton: {
    marginLeft: theme.spacing(1),
  },
  fullWidth: { width: '100%' },
  flexFormControl: {
    display: 'flex',
    direction: 'row',
    width: '100%',
  },
  tagListItemContainer: {
    display: 'flex',
    direction: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagListItem: {
    maxWidth: '40%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tagInfo: {
    color: 'rgba(0, 0, 0, 0.54)',
    marginTop: theme.spacing(3),
  },
  iconAndTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  tagKind: {
    width: '80%',
    marginRight: '0',
  },
  selector: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  alert: {
    alignItems: 'center',
  },
});

export default compose(
  withTranslation(['coupon']),
  // @ts-expect-error
  withStyles(styles),
  withObjectSearch,
  withFeatureFlags,
)(CouponForm);
