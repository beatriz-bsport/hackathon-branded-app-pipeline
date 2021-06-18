// @flow
import React from 'react';

import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import MomentUtils from '@date-io/moment';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import Collapse from '@material-ui/core/Collapse';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Divider from '@material-ui/core/Divider';
import { compose } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import moment from 'moment-timezone';

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
} from '@bsport/common/lib/master-data/buyable-items';
import { Moment } from '../../../i18n';

import PaymentPackListItem from '../../payment-packs/components/PaymentPackListItem.component';
import PaymentPackSelector from '../../payment-packs/components/PaymentPackSelector.component';
import ShopItemListItem from '../../shop/components/ShopItemListItem.component';
import ShopItemSelector from '../../shop/components/ShopItemSelector.component';
import PrivatePassSelector from '../../private-service/components/pass/PrivatePassSelector.component';
import PrivatePassListItem from '../../private-service/components/pass/PrivatePassListItem.component';

import NumericInput from '../../../components/input/NumericInput.component';
import PriceInput from '../../../components/input/PriceInput.component';
import PercentInput from '../../../components/input/PercentInput.component';
import Checkbox from '../../../components/input/Checkbox.component';
import type { Coupon } from '../types';

import { PaymentPack } from '../../payment-packs/types';
import { ShopItem } from '../../shop/types';
import { PrivatePass } from '../../private-service/types';
import type { TagGroup, Tag, TagGroupAPI } from '../../tag/types';

const ALL_BUYABLES = 100;

type Props = {
  initial: ?Coupon,
  onSubmit: (data: *) => void,
  onCancel: () => void,
  processing: boolean,

  t: TFunction,
  classes: Object,

  paymentPacks: Array<PaymentPack>,
  shopItems: Array<ShopItem>,
  privatePasses: Array<PrivatePass>,
  tagGroupWithTags: Array<TagGroup>,
  allTagsDict: Object<Tag>,
  allTagGroupDict: Object<TagGroupAPI>,
  tagsLoading: boolean,
};
type State = {
  ...Coupon,
  with_expiration_date: boolean,
  selected_tag_group?: Object<number>,
  tag_selection_error?: String,
};

export class CouponForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    if (props.initial) {
      this.state = {
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
          ? moment(props.initial.expiration_date, 'YYYY-MM-DD')
          : null,
        whitelist_tags: props.initial.whitelist_tags,
        blacklist_tags: props.initial.blacklist_tags,
        selected_tag_group: { whitelist_tags: null, blacklist_tags: null },
        tag_selection_error: null,
      };
    } else {
      this.state = {
        name: null,
        percent_off: 0,
        amount_off: 0,
        code: null,
        is_active: true,
        only_on_first_checkout: false,
        usage_total: 1000,
        usage_per_member: 1,
        combinable: false,
        minimum_amount: 0,
        applies_to: ALL_BUYABLES,
        only_on_objects: [],
        voucher_type: VOUCHER_TYPE_PERCENT,
        with_expiration_date: false,
        expiration_date: moment(),
        subscription_mode: COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE,
        whitelist_tags: [],
        blacklist_tags: [],
        selected_tag_group: { whitelist_tags: null, blacklist_tags: null },
        tag_selection_error: null,
      };
    }
  }

  handleChange = (key: string, isEvent: boolean) => (value) => {
    if (isEvent) {
      this.setState({ [key]: value.target.value });
    } else {
      this.setState({ [key]: value });
    }
  };

  handleTagSelectionError = (
    updated_tags_list: Array<number>,
    state_list: Array<number>,
  ) => {
    const tag_verification =
      updated_tags_list.filter((tagId) => state_list.includes(tagId)).length !==
      0;
    if (tag_verification) {
      this.handleChange('tag_selection_error')(
        this.props.t('form.tag.select.error'),
      );
    } else {
      this.handleChange('tag_selection_error')(null);
    }
  };

  onSubmit = (ev: SyntheticEvent<any>) => {
    ev.preventDefault();
    const data = {
      name: this.state.name,
      percent_off: this.state.percent_off,
      amount_off: this.state.amount_off,
      code: this.state.code,
      is_active: this.state.is_active,
      only_on_first_checkout: this.state.only_on_first_checkout,
      usage_total: this.state.usage_total,
      usage_per_member: this.state.usage_per_member,
      combinable: this.state.combinable,
      subscription_mode: this.state.subscription_mode,
      minimum_amount: this.state.minimum_amount,
      applies_to:
        this.state.applies_to === ALL_BUYABLES ? null : this.state.applies_to,
      voucher_type: this.state.voucher_type,
      only_on_objects: this.state.only_on_objects,
      whitelist_tags: this.state.whitelist_tags,
      blacklist_tags: this.state.blacklist_tags,
      selected_tag_group: this.state.selected_tag_group,
      tag_selection_error: this.state.tag_selection_error,
    };
    if (this.state.with_expiration_date && this.state.is_active) {
      data.expiration_date = moment(
        this.state.expiration_date,
        'DD/MM/YYYY',
      ).format('YYYY-MM-DD');
    } else {
      data.expiration_date = null;
    }
    if (
      data.whitelist_tags.filter((tagId) => data.blacklist_tags.includes(tagId))
        .length !== 0
    ) {
      this.handleChange('tag_selection_error')(
        this.props.t('form.tag.select.error'),
      );
    }
    const { selected_tag_group, tag_selection_error, ...cleaneadData } = data;
    if (!tag_selection_error) {
      this.props.onSubmit(cleaneadData);
    }
  };

  renderVoucherConfig = () => {
    const { t, classes } = this.props;
    return (
      <div>
        <FormControl component="fieldset" className={classes.radioGroup}>
          <RadioGroup
            aria-label="Voucher type"
            name="voucher_type"
            value={this.state.voucher_type}
            onChange={(ev) =>
              this.handleChange(
                'voucher_type',
                false,
              )(parseInt(ev.target.value, 10))
            }
          >
            <FormControlLabel
              value={VOUCHER_TYPE_PERCENT}
              control={
                <Radio
                  checked={VOUCHER_TYPE_PERCENT === this.state.voucher_type}
                />
              }
              label={t('form.voucher_type.percent')}
            />
            <FormControlLabel
              value={VOUCHER_TYPE_AMOUNT}
              control={
                <Radio
                  checked={VOUCHER_TYPE_AMOUNT === this.state.voucher_type}
                />
              }
              label={t('form.voucher_type.amount')}
            />
          </RadioGroup>
          <Collapse in={this.state.voucher_type === VOUCHER_TYPE_PERCENT}>
            <PercentInput
              fullWidth
              label={t('form.percent_off.label')}
              value={this.state.percent_off}
              onChange={this.handleChange('percent_off', true)}
            />
          </Collapse>
          <Collapse in={this.state.voucher_type === VOUCHER_TYPE_AMOUNT}>
            <PriceInput
              fullWidth
              label={t('form.amount_off.label')}
              value={this.state.amount_off}
              onChange={this.handleChange('amount_off', true)}
            />
          </Collapse>
        </FormControl>
      </div>
    );
  };

  renderSubscriptionModeConfig = () => {
    const { t, classes } = this.props;
    return (
      <div>
        <FormControl component="fieldset" className={classes.radioGroup}>
          <RadioGroup
            aria-label="Subscription mode"
            name="subscription_mode"
            value={this.state.subscription_mode}
            onChange={(ev) =>
              this.handleChange(
                'subscription_mode',
                false,
              )(parseInt(ev.target.value, 10))
            }
          >
            <FormControlLabel
              value={COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE}
              control={
                <Radio
                  checked={
                    COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE ===
                    this.state.subscription_mode
                  }
                />
              }
              label={t(
                `form.subscription_mode.${COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE}`,
              )}
            />
            <FormControlLabel
              value={COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE}
              control={
                <Radio
                  checked={
                    COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE ===
                    this.state.subscription_mode
                  }
                />
              }
              label={t(
                `form.subscription_mode.${COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE}`,
              )}
            />
            <FormControlLabel
              value={COUPON_SUBSCRIPTION_MODE_ALL_INVOICES}
              control={
                <Radio
                  checked={
                    COUPON_SUBSCRIPTION_MODE_ALL_INVOICES ===
                    this.state.subscription_mode
                  }
                />
              }
              label={t(
                `form.subscription_mode.${COUPON_SUBSCRIPTION_MODE_ALL_INVOICES}`,
              )}
            />
            <FormControlLabel
              value={COUPON_SUBSCRIPTION_MODE_NONE}
              control={
                <Radio
                  checked={
                    COUPON_SUBSCRIPTION_MODE_NONE ===
                    this.state.subscription_mode
                  }
                />
              }
              label={t(
                `form.subscription_mode.${COUPON_SUBSCRIPTION_MODE_NONE}`,
              )}
            />
          </RadioGroup>
        </FormControl>
      </div>
    );
  };

  renderExpirationDate = () => {
    const { classes, t } = this.props;
    return (
      <div className={classes.field}>
        <Checkbox
          checked={this.state.with_expiration_date}
          label={t('form.with_expiration_date.label')}
          disabled={!this.state.is_active}
          onChange={(ev) =>
            this.handleChange('with_expiration_date', false)(ev.target.checked)
          }
        />
        <MuiPickersUtilsProvider
          utils={MomentUtils}
          moment={Moment}
          locale={Moment.locale()}
        >
          <DatePicker
            format="DD/MM/YYYY"
            keyboard
            mask={(value) => {
              if (value) {
                return [
                  /\d/,
                  /\d/,
                  '/',
                  /\d/,
                  /\d/,
                  '/',
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                ];
              }
              return [];
            }}
            openToYearSelection
            clearable
            disabled={!this.state.with_expiration_date || !this.state.is_active}
            required={this.state.with_expiration_date && this.state.is_active}
            value={this.state.expiration_date}
            label={t('form.expiration_date.label')}
            returnMoment={false}
            onChange={(date) =>
              this.handleChange('expiration_date', false)(date)
            }
            clearLabel={t('form.expiration_date.clear_date')}
            cancelLabel={t('form.expiration_date.cancel')}
            initialFocusedDate={moment().format('YYYY-MM-DD')}
          />
        </MuiPickersUtilsProvider>
      </div>
    );
  };

  renderApply = () => {
    const { paymentPacks, privatePasses, shopItems, t, classes } = this.props;
    return (
      <div className={classes.fullWidth}>
        <RadioGroup
          aria-label="Applies to "
          name="applies_to"
          value={this.state.applies_to}
          onChange={(ev) => {
            if (
              [
                BUYABLE_ITEM_PASS,
                BUYABLE_ITEM_SHOP_ITEM,
                BUYABLE_ITEM_FEE,
                BUYABLE_ITEM_PRIVATE_PASS,
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
        >
          <FormControlLabel
            value={BUYABLE_ITEM_PASS}
            control={
              <Radio checked={BUYABLE_ITEM_PASS === this.state.applies_to} />
            }
            label={t(`form.applies_to.choices.${BUYABLE_ITEM_PASS}`)}
          />
          <div className={classes.fullWidth}>
            <PaymentPackSelector
              paymentPacks={paymentPacks
                .filter((pp) => !pp.disabled)
                .filter((pp) => !this.state.only_on_objects.includes(pp.id))}
              nullCurrentValue
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
            />
            {this.state.applies_to === BUYABLE_ITEM_PASS
              ? this.state.only_on_objects.map((id, i) => (
                  <PaymentPackListItem
                    key={`${id}-${i}`}
                    pack={paymentPacks.find((pp) => pp.id === id)}
                    onDelete={() => {
                      const newObjects = this.state.only_on_objects.filter(
                        (ido) => ido !== id,
                      );
                      this.handleChange('only_on_objects')(newObjects);
                    }}
                  />
                ))
              : null}
          </div>
          <FormControlLabel
            value={BUYABLE_ITEM_SHOP_ITEM}
            control={
              <Radio
                checked={BUYABLE_ITEM_SHOP_ITEM === this.state.applies_to}
              />
            }
            label={t(`form.applies_to.choices.${BUYABLE_ITEM_SHOP_ITEM}`)}
          />
          <div className={classes.fullWidth}>
            <ShopItemSelector
              shopItemList={shopItems
                .filter((item) => item.subshop && !item.disabled)
                .filter(
                  (item) => !this.state.only_on_objects.includes(item.id),
                )}
              nullCurrentValue
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
            />
            {this.state.applies_to === BUYABLE_ITEM_SHOP_ITEM
              ? this.state.only_on_objects.map((id, i) => (
                  <ShopItemListItem
                    key={`${id}-${i}`}
                    dense
                    shopitem={shopItems.find((si) => si.id === id)}
                    onDelete={() => {
                      const newObjects = this.state.only_on_objects.filter(
                        (ido) => ido !== id,
                      );
                      this.handleChange('only_on_objects')(newObjects);
                    }}
                  />
                ))
              : null}
          </div>
          <FormControlLabel
            value={BUYABLE_ITEM_PRIVATE_PASS}
            control={
              <Radio
                checked={BUYABLE_ITEM_PRIVATE_PASS === this.state.applies_to}
              />
            }
            label={t(`form.applies_to.choices.${BUYABLE_ITEM_PRIVATE_PASS}`)}
          />
          <div className={classes.fullWidth}>
            <PrivatePassSelector
              privatePassList={privatePasses
                .filter((pp) => pp.available)
                .filter(
                  (pass) => !this.state.only_on_objects.includes(pass.id),
                )}
              helperText={t('form.selectorPlaceholder.privatePass')}
              nullCurrentValue
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
            />
            {this.state.applies_to === BUYABLE_ITEM_PRIVATE_PASS &&
            privatePasses.length
              ? this.state.only_on_objects.map((id, i) => (
                  <PrivatePassListItem
                    key={`${id}-${i}`}
                    dense
                    pass={privatePasses.find((pp) => pp.id === id)}
                    onDelete={() => {
                      const newObjects = this.state.only_on_objects.filter(
                        (ido) => ido !== id,
                      );
                      this.handleChange('only_on_objects')(newObjects);
                    }}
                  />
                ))
              : null}
          </div>
          <FormControlLabel
            value={BUYABLE_ITEM_FEE}
            control={
              <Radio checked={BUYABLE_ITEM_FEE === this.state.applies_to} />
            }
            label={t(`form.applies_to.choices.${BUYABLE_ITEM_FEE}`)}
          />
          <FormControlLabel
            value={ALL_BUYABLES}
            control={<Radio checked={ALL_BUYABLES === this.state.applies_to} />}
            label={t('form.applies_to.choices.all')}
          />
        </RadioGroup>
      </div>
    );
  };

  renderTags = (tag_list_kind: string) => {
    const {
      tagGroupWithTags,
      allTagsDict,
      allTagGroupDict,
      t,
      classes,
    } = this.props;
    return (
      <React.Fragment>
        <Typography variant="subtitle2" className={classes.sectionTitle}>
          {t(`form.section.${tag_list_kind}`)}
        </Typography>
        <Divider />
        <div className={classes.flexFormControl}>
          <FormControl style={{ paddingRight: 10 }}>
            <Select
              labelId="tag-group-select"
              value={this.state.selected_tag_group[tag_list_kind]}
              onChange={(event) =>
                this.setState((prevState) => ({
                  selected_tag_group: {
                    ...prevState.selected_tag_group,
                    [tag_list_kind]: event.target.value,
                  },
                }))
              }
            >
              {tagGroupWithTags.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {`${t('form.tag.select.tag_group')}`}
            </FormHelperText>
          </FormControl>
          <FormControl>
            <Select
              labelId="tag-select"
              disabled={!this.state.selected_tag_group[tag_list_kind]}
              value={null}
              onChange={(event) => {
                const newObjects = [...this.state[tag_list_kind]];
                newObjects.push(event.target.value);
                this.handleChange(tag_list_kind)(newObjects);
                this.handleChange(
                  'selected_tag_group',
                  false,
                )({ whitelist_tags: null, blacklist_tags: null });
                this.handleTagSelectionError(
                  newObjects,
                  tag_list_kind === 'whitelist_tags'
                    ? this.state.blacklist_tags
                    : this.state.whitelist_tags,
                );
              }}
            >
              {this.state.selected_tag_group[tag_list_kind] &&
                tagGroupWithTags
                  .find(
                    (tg) =>
                      tg.id === this.state.selected_tag_group[tag_list_kind],
                  )
                  .tags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </MenuItem>
                  ))}
            </Select>
            <FormHelperText>{`${t('form.tag.select.tag')}`}</FormHelperText>
          </FormControl>
        </div>
        <List style={{ width: '100%' }}>
          {this.state[tag_list_kind] && this.state[tag_list_kind].length !== 0
            ? this.state[tag_list_kind].map((tag) => (
                <React.Fragment>
                  <div
                    key={`${tag_list_kind}${tag.id}`}
                    className={classes.tagListItemContainer}
                  >
                    <ListItemText
                      secondary={`${t('form.tag.tag_group')} : ${
                        allTagsDict[tag]
                          ? allTagGroupDict[allTagsDict[tag].group].name
                          : null
                      }`}
                      secondaryTypographyProps={{ variant: 'subtitle2' }}
                      className={classes.tagListItem}
                    />
                    <ListItemText
                      primary={`${t('form.tag.tag')} : ${
                        allTagsDict[tag] ? allTagsDict[tag].name : null
                      }`}
                      primaryTypographyProps={{ variant: 'subtitle2' }}
                      className={classes.tagListItem}
                    />
                    <IconButton
                      edge="end"
                      onClick={() => {
                        const newObjects = [...this.state[tag_list_kind]];
                        this.handleChange(tag_list_kind)(
                          newObjects.filter((tagId) => tagId !== tag),
                        );
                        this.handleTagSelectionError(
                          newObjects.filter((tagId) => tagId !== tag),
                          tag_list_kind === 'whitelist_tags'
                            ? this.state.blacklist_tags
                            : this.state.whitelist_tags,
                        );
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </div>
                  <Divider />
                </React.Fragment>
              ))
            : null}
        </List>
      </React.Fragment>
    );
  };

  render() {
    const { t, classes } = this.props;
    return (
      <form className={classes.container} onSubmit={this.onSubmit}>
        <Typography variant="h6">{t('form.section.general')}</Typography>
        <TextField
          fullWidth
          onChange={this.handleChange('name', true)}
          label={t('form.name.label')}
          value={this.state.name}
          className={classes.field}
          required
        />
        <TextField
          fullWidth
          onChange={this.handleChange('code', true)}
          label={t('form.code.label')}
          value={this.state.code}
          className={classes.field}
          helperText={t('form.code.helperText')}
          required
          inputProps={{ maxLength: 32 }}
        />
        <Typography variant="h6" className={classes.sectionTitle}>
          {t('form.section.voucherConfig')}
        </Typography>
        {this.renderVoucherConfig()}
        <Typography variant="h6" className={classes.sectionTitle}>
          {t('form.section.applies_to')}
        </Typography>
        {this.renderApply()}
        <Typography variant="h6" className={classes.sectionTitle}>
          {t('form.section.availability')}
        </Typography>
        <Checkbox
          checked={this.state.is_active}
          label={t('form.is_active.label')}
          helperText={t('form.is_active.helperText')}
          onChange={(ev) =>
            this.handleChange('is_active', false)(ev.target.checked)
          }
        />
        <div className={classes.field}>{this.renderExpirationDate()}</div>
        <Typography variant="h6" className={classes.sectionTitle}>
          {t('form.section.usability')}
        </Typography>
        <div className={classes.field}>
          <NumericInput
            fullWidth
            label={t('form.usage_per_member.label')}
            value={this.state.usage_per_member}
            onChange={this.handleChange('usage_per_member', true)}
          />
        </div>
        <div className={classes.field}>
          <NumericInput
            fullWidth
            value={this.state.usage_total}
            label={t('form.usage_total.label')}
            onChange={this.handleChange('usage_total', true)}
          />
        </div>

        <Typography variant="h6" className={classes.sectionTitle}>
          {t('form.section.subscription')}
        </Typography>
        {this.renderSubscriptionModeConfig()}

        <Typography variant="h6" className={classes.sectionTitle}>
          {t('form.section.advanced')}
        </Typography>
        <Checkbox
          checked={this.state.only_on_first_checkout}
          onChange={(ev) =>
            this.handleChange(
              'only_on_first_checkout',
              false,
            )(ev.target.checked)
          }
          label={t('form.only_on_first_checkout.label')}
        />
        <Checkbox
          checked={this.state.combinable}
          onChange={(ev) =>
            this.handleChange('combinable', false)(ev.target.checked)
          }
          label={t('form.combinable.label')}
        />
        <div className={classes.field}>
          <PriceInput
            fullWidth
            value={this.state.minimum_amount}
            onChange={this.handleChange('minimum_amount', true)}
            label={t('form.minimum_amount.label')}
          />
        </div>
        <Typography variant="h6" className={classes.sectionTitle}>
          {t('form.section.tags')}
        </Typography>
        {this.state.tag_selection_error && (
          <Typography color="error">
            {t(this.state.tag_selection_error)}
          </Typography>
        )}
        {!this.props.tagsLoading && this.renderTags('whitelist_tags')}
        {!this.props.tagsLoading && this.renderTags('blacklist_tags')}
        <div className={classes.buttonContainer}>
          <Button onClick={this.props.onCancel}>
            {t('form.actions.cancel')}
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            className={classes.actionButton}
            disabled={this.props.processing || this.state.tag_selection_error}
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
});

export default compose(
  withTranslation(['coupon']),
  withStyles(styles),
)(CouponForm);
