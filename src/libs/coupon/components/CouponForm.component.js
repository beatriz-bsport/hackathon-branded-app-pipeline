import React from 'react';
import { DateTime, Settings } from 'luxon';
import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import Collapse from '@material-ui/core/Collapse';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';
import {
  VOUCHER_TYPE_PERCENT,
  VOUCHER_TYPE_AMOUNT,
} from '@bsport/common/lib/master-data/coupon';
import {
  COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE,
  COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE,
  COUPON_SUBSCRIPTION_MODE_ALL_INVOICES,
  COUPON_SUBSCRIPTION_MODE_NONE,
} from '@bsport/common/lib/master-data/coupon-subscription-mode';

import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_FEE,
  BUYABLE_ITEM_PRIVATE_PASS,
  BUYABLE_ITEM_COMBO_ITEM,
} from '@bsport/common/lib/master-data/buyable-items';
import Block from '@material-ui/icons/Block';
import Check from '@material-ui/icons/Check';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import { Alert } from '@material-ui/lab';
import debounce from 'lodash/debounce';
import { LocalizedLuxonUtils } from '#src/i18n/utils/luxon-picker-utils';
import TagSelector from '#libs/tag/components/TagSelector.selector';

import PaymentPackListItem from '#libs/payment-packs/components/PaymentPackListItem.component';
import PaymentPackSelector from '#libs/payment-packs/components/PaymentPackSelector.component';
import ShopItemListItem from '#libs/shop/components/ShopItemListItem.component';
import ShopItemSelector from '#libs/shop/components/ShopItemSelector.component';
import PrivatePassSelector from '#libs/private-service/components/pass/PrivatePassSelector.component';
import PrivatePassListItem from '#libs/private-service/components/pass/PrivatePassListItem.component';
import PaymentComboSelector from '#libs/payment-combo/components/PaymentComboSelector.component';
import PaymentComboListItem from '#libs/payment-combo/components/PaymentComboListItem.component';

import NumericInput from '#components/input/NumericInput.component';
import PriceInput from '#components/input/PriceInput.component';
import PercentInput from '#components/input/PercentInput.component';
import Checkbox from '#components/input/Checkbox.component';
import type { Coupon, CheckCouponCodePayload } from '../types';

import { PaymentPack } from '#libs/payment-packs/types';
import { ShopItem } from '#libs/shop/types';
import { PrivatePass } from '#libs/private-service/types';
import type { PaymentCombo } from '#libs/payment-combo/types';
import type { Tag, TagGroupAPI } from '#libs/tag/types';
import type { OptionCallback } from '../../../state/types';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { checkCouponCodeValidity } from '#libs/coupon/api';

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
  initial: ?Coupon,
  onSubmit: (data: *, options?: OptionCallback) => void,
  onCancel: () => void,
  processing: boolean,

  t: TFunction,
  classes: Object,

  paymentPacks: Array<PaymentPack>,
  allPaymentPacksById: { [key: number]: PaymentPack },
  shopItems: Array<ShopItem>,
  allShopItemsById: { [key: number]: ShopItem },
  privatePasses: Array<PrivatePass>,
  allPrivatePassesById: { [key: number]: PrivatePass },
  paymentCombos: Array<PaymentCombo>,
  allPaymentCombosById: { [key: number]: PaymentCombo },
  tagList: Array<Tag<TagGroupAPI>>,
  tagsLoading: boolean,
  fetchSelectedPaymentPacks: (ids: Number[]) => void,
  fetchSelectedShopItems: (
    companyId: Number | undefined,
    ids: Number[],
  ) => void,
  fetchSelectedPrivatePasses: (ids: Number[]) => void,
  fetchSelectedPaymentCombos: (
    params: { company: Number, id__in?: Number[] },
    options?: OptionCallback<PaymentCombo[]>,
  ) => void,
};

type State = {
  with_expiration_date: boolean,
} & Coupon;

export class CouponForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.initial) {
      this.state = {
        isCodeUsedError: false,
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
        expiration_date: props.initial.expiration_date
          ? DateTime.fromISO(props.initial.expiration_date)
          : DateTime.now().plus({ month: 1 }),
        whitelist_tags:
          props.initial?.whitelist_tags?.map((_tag: Tag) => _tag?.id) ?? [],
        blacklist_tags:
          props.initial?.blacklist_tags?.map((_tag: Tag) => _tag?.id) ?? [],
      };
    } else {
      this.state = {
        isCodeUsedError: false,
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
        expiration_date: DateTime.now().plus({ month: 1 }),
        subscription_mode: COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE,
        whitelist_tags: [],
        blacklist_tags: [],
      };
    }
  }

  componentDidMount() {
    trackFormAdd(this.props.initial?.id);

    if (this.props.initial && this.props.initial.only_on_objects.length) {
      switch (this.props.initial.applies_to) {
        case BUYABLE_ITEM_PASS:
          this.props.fetchSelectedPaymentPacks(
            this.props.initial.only_on_objects,
          );
          break;
        case BUYABLE_ITEM_SHOP_ITEM:
          this.props.fetchSelectedShopItems(
            this.props.initial.company,
            this.props.initial.only_on_objects,
          );
          break;
        case BUYABLE_ITEM_PRIVATE_PASS:
          this.props.fetchSelectedPrivatePasses(
            this.props.initial.only_on_objects,
          );
          break;
        case BUYABLE_ITEM_COMBO_ITEM:
          this.props.fetchSelectedPaymentCombos(
            this.props.initial.company,
            this.props.initial.only_on_objects,
          );
          break;
        default:
          break;
      }
    }
  }

  checkCouponCodeAvailability = debounce(async (code: string) => {
    if (!code?.length) return;
    const payload: CheckCouponCodePayload = {
      code,
      coupon_ids_to_ignore: this.props.initial?.id
        ? [this.props.initial.id]
        : [],
    };
    try {
      const { data } = await checkCouponCodeValidity(payload);
      if (
        this.state.isCodeUsedError !== data?.is_used &&
        code === this.state.code
      ) {
        this.setState({ isCodeUsedError: data?.is_used });
      }
    } catch (e) {
      console.error(e);
    }
  }, 500);

  handleChange = (key: string, isEvent: boolean) => (value) => {
    const inputValue = isEvent ? value.target.value : value;
    this.setState({ [key]: inputValue });
    if (key === 'code') {
      this.checkCouponCodeAvailability(inputValue);
    }
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
      data.expiration_date = this.state.expiration_date.toISODate();
    } else {
      data.expiration_date = null;
    }

    this.props.onSubmit(data, {
      onSuccess: (id) => {
        trackFormSuccess(id);
      },
    });
  };

  handleIsActiveChange = (ev: React.ChangeEvent<HTMLElement>) => {
    this.setState({
      is_active: ev.target.checked,
      with_expiration_date: false,
    });
  };

  renderVoucherConfig = () => {
    const { t, classes, initial } = this.props;
    return (
      <div>
        <FormControl className={classes.radioGroup} component="fieldset">
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
    const { t, classes, initial } = this.props;
    return (
      <div>
        <FormControl className={classes.radioGroup} component="fieldset">
          <RadioGroup
            aria-label="Subscription mode"
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
            returnMoment={false}
            value={this.state.expiration_date}
          />
        </MuiPickersUtilsProvider>
      </div>
    );
  };

  renderApply = () => {
    const {
      paymentPacks,
      allPaymentPacksById,
      privatePasses,
      allPrivatePassesById,
      shopItems,
      allShopItemsById,
      paymentCombos,
      allPaymentCombosById,
      t,
      classes,
      initial,
    } = this.props;
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
            <PaymentPackSelector
              nullCurrentValue
              disabled={!!initial?.coupon_template_instance}
              helperText={t('form.selectorPlaceholder.paymentPack')}
              onChange={(id) => {
                let newObjects = [...this.state.only_on_objects];

                if (this.state.applies_to !== BUYABLE_ITEM_PASS) {
                  this.handleChange('applies_to', false)(BUYABLE_ITEM_PASS);
                  newObjects = [];
                }
                newObjects.push(id);
                this.handleChange('only_on_objects')(newObjects);
              }}
              paymentPacks={paymentPacks
                .filter((pp) => !pp.disabled)
                .filter((pp) => !this.state.only_on_objects.includes(pp.id))}
            />
            {this.state.applies_to === BUYABLE_ITEM_PASS
              ? this.state.only_on_objects.map((id, i) => (
                  <PaymentPackListItem
                    key={`${id}-${i}`}
                    disabled={!!initial?.coupon_template_instance}
                    onDelete={() => {
                      const newObjects = this.state.only_on_objects.filter(
                        (ido) => ido !== id,
                      );
                      this.handleChange('only_on_objects')(newObjects);
                    }}
                    pack={allPaymentPacksById[id]}
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
            <ShopItemSelector
              nullCurrentValue
              disabled={!!initial?.coupon_template_instance}
              helperText={t('form.selectorPlaceholder.shopitem')}
              onChange={(id) => {
                let newObjects = [...this.state.only_on_objects];
                if (this.state.applies_to !== BUYABLE_ITEM_SHOP_ITEM) {
                  this.handleChange(
                    'applies_to',
                    false,
                  )(BUYABLE_ITEM_SHOP_ITEM);
                  newObjects = [];
                }
                newObjects.push(id);
                this.handleChange('only_on_objects')(newObjects);
              }}
              shopItemList={shopItems
                .filter((item) => item.subshop && !item.disabled)
                .filter(
                  (item) => !this.state.only_on_objects.includes(item.id),
                )}
            />
            {this.state.applies_to === BUYABLE_ITEM_SHOP_ITEM
              ? this.state.only_on_objects.map((id, i) => (
                  <ShopItemListItem
                    key={`${id}-${i}`}
                    dense
                    disabled={!!initial?.coupon_template_instance}
                    onDelete={() => {
                      const newObjects = this.state.only_on_objects.filter(
                        (ido) => ido !== id,
                      );
                      this.handleChange('only_on_objects')(newObjects);
                    }}
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
            <PrivatePassSelector
              nullCurrentValue
              disabled={!!initial?.coupon_template_instance}
              helperText={t('form.selectorPlaceholder.privatePass')}
              onChange={(id) => {
                let newObjects = [...this.state.only_on_objects];

                if (this.state.applies_to !== BUYABLE_ITEM_PRIVATE_PASS) {
                  this.handleChange(
                    'applies_to',
                    false,
                  )(BUYABLE_ITEM_PRIVATE_PASS);
                  newObjects = [];
                }
                newObjects.push(id);
                this.handleChange('only_on_objects')(newObjects);
              }}
              privatePassList={privatePasses
                .filter((pp) => pp.available)
                .filter(
                  (pass) => !this.state.only_on_objects.includes(pass.id),
                )}
            />
            {this.state.applies_to === BUYABLE_ITEM_PRIVATE_PASS &&
            privatePasses.length
              ? this.state.only_on_objects.map((id, i) => (
                  <PrivatePassListItem
                    key={`${id}-${i}`}
                    dense
                    disabled={!!initial?.coupon_template_instance}
                    onDelete={() => {
                      const newObjects = this.state.only_on_objects.filter(
                        (ido) => ido !== id,
                      );
                      this.handleChange('only_on_objects')(newObjects);
                    }}
                    pass={allPrivatePassesById[id]}
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
            <PaymentComboSelector
              nullCurrentValue
              disabled={!!initial?.coupon_template_instance}
              helperText={t('form.selectorPlaceholder.paymentCombo')}
              onChange={(id) => {
                let newObjects = [...this.state.only_on_objects];

                if (this.state.applies_to !== BUYABLE_ITEM_COMBO_ITEM) {
                  this.handleChange(
                    'applies_to',
                    false,
                  )(BUYABLE_ITEM_COMBO_ITEM);
                  newObjects = [];
                }
                newObjects.push(id);
                this.handleChange('only_on_objects')(newObjects);
              }}
              paymentComboList={paymentCombos.filter(
                (combo) => !this.state.only_on_objects.includes(combo.id),
              )}
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
                      this.handleChange('only_on_objects')(newObjects);
                    }}
                    paymentCombo={allPaymentCombosById[id]}
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
                this.handleChange(tag_list_kind)(newObjects);
              }}
              onDeleteTag={(tagId) => {
                const newObject = this.state[tag_list_kind].filter(
                  (id) => tagId !== id,
                );
                this.handleChange(tag_list_kind)(newObject);
              }}
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
          label={t('form.name.label')}
          onChange={this.handleChange('name', true)}
          value={this.state.name}
        />
        <TextField
          fullWidth
          required
          className={classes.field}
          disabled={!!initial?.coupon_template_instance}
          error={this.state.isCodeUsedError}
          helperText={
            this.state.isCodeUsedError
              ? t('form.code.codeAlreadyInUse')
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
        {this.state.tag_selection_error && (
          <Typography color="error">
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
              this.state.tag_selection_error ||
              this.state.isCodeUsedError
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

const styles = (theme) => ({
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
  withStyles(styles),
)(CouponForm);
