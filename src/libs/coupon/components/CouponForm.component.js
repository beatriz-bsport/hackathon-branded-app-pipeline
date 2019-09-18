// @flow
import React from 'react';

import TextField from '@material-ui/core/TextField';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import DatePicker from 'material-ui-pickers/DatePicker';
import Collapse from '@material-ui/core/Collapse';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import moment from 'moment';

import {
  VOUCHER_TYPE_PERCENT,
  VOUCHER_TYPE_AMOUNT,
} from '@bsport/common/lib/master-data/coupon';
import {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_FEE,
} from '@bsport/common/lib/master-data/buyable-items';

import NumericInput from '../../../components/input/NumericInput.component';
import PriceInput from '../../../components/input/PriceInput.component';
import PercentInput from '../../../components/input/PercentInput.component';
import Checkbox from '../../../components/input/Checkbox.component';
import type { Coupon } from '../types';

type Props = {
  initial: ?Coupon,
  onSubmit: (data: *) => void,
  onCancel: () => void,
  processing: boolean,

  t: TFunction,
  classes: Object,
};
type State = {
  ...Coupon,
  with_expiration_date: boolean,
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
        applies_to: props.initial.applies_to,
        voucher_type: props.initial.voucher_type,
        with_expiration_date: !!props.initial.expiration_date,
        expiration_date: props.initial.expiration_date
          ? moment(props.initial.expiration_date, 'YYYY-MM-DD')
          : null,
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
        applies_to: null,
        voucher_type: VOUCHER_TYPE_PERCENT,
        with_expiration_date: false,
        expiration_date: moment(),
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
      minimum_amount: this.state.minimum_amount,
      applies_to: this.state.applies_to,
      voucher_type: this.state.voucher_type,
    };
    if (this.state.with_expiration_date && this.state.is_active) {
      data.expiration_date = moment(
        this.state.expiration_date,
        'DD/MM/YYYY',
      ).format('YYYY-MM-DD');
    } else {
      data.expiration_date = null;
    }

    this.props.onSubmit(data);
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
              this.handleChange('voucher_type', false)(
                parseInt(ev.target.value, 10),
              )
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
        <DatePicker
          format="DD/MM/YYYY"
          keyboard
          mask={(value) => {
            if (value) {
              return [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
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
          onChange={(date) => this.handleChange('expiration_date', false)(date)}
          clearLabel={t('form.expiration_date.clear_date')}
          cancelLabel={t('form.expiration_date.cancel')}
          initialFocusedDate={moment().format('YYYY-MM-DD')}
        />
      </div>
    );
  };

  renderAppliesTo = () => {
    const { t, classes } = this.props;
    return (
      <div>
        <FormControl component="fieldset" className={classes.radioGroup}>
          <RadioGroup
            aria-label="Applies to "
            name="applies_to"
            value={this.state.applies_to}
            onChange={(ev) => {
              this.handleChange('applies_to', false)(
                parseInt(ev.target.value, 10),
              );
            }}
          >
            <FormControlLabel
              value={BUYABLE_ITEM_PASS}
              control={
                <Radio checked={BUYABLE_ITEM_PASS === this.state.applies_to} />
              }
              label={t('form.applies_to.choices.pass')}
            />
            <FormControlLabel
              value={BUYABLE_ITEM_SHOP_ITEM}
              control={
                <Radio
                  checked={BUYABLE_ITEM_SHOP_ITEM === this.state.applies_to}
                />
              }
              label={t('form.applies_to.choices.shop')}
            />
            <FormControlLabel
              value={BUYABLE_ITEM_FEE}
              control={
                <Radio checked={BUYABLE_ITEM_FEE === this.state.applies_to} />
              }
              label={t('form.applies_to.choices.fee')}
            />
            <FormControlLabel
              value={null}
              control={<Radio checked={!this.state.applies_to} />}
              label={t('form.applies_to.choices.all')}
            />
          </RadioGroup>
        </FormControl>
      </div>
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
        {this.renderAppliesTo()}
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
          {t('form.section.advanced')}
        </Typography>
        <Checkbox
          checked={this.state.only_on_first_checkout}
          onChange={(ev) =>
            this.handleChange('only_on_first_checkout', false)(
              ev.target.checked,
            )
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
        <div className={classes.buttonContainer}>
          <Button onClick={this.props.onCancel}>
            {t('form.actions.cancel')}
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="primary"
            className={classes.actionButton}
            disabled={this.props.processing}
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
    marginTop: theme.spacing.unit,
  },
  field: {
    width: '100%',
    marginBottom: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: theme.spacing.unit * 2,
    width: '100%',
  },
  actionButton: {
    marginLeft: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['coupon']),
  withStyles(styles),
)(CouponForm);
