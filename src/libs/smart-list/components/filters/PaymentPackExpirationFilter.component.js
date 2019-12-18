// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { COMPARATORS_DICT } from '@bsport/common/lib/master-data/smart-list';
import DelayedNumericInput from '../../../../components/DelayedNumericInput.component';
import PaymentPackSelector from '../../../payment-packs/components/PaymentPackSelector.component';
import type { PaymentPack } from '../../../payment-packs/types';

type Props = {
  filter_data: any,
  t: TFunction,
  payment_packs: Array<PaymentPack>,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
};

export class PaymentPackExpirationFilter extends Component<Props, state> {
  componentDidMount() {
    if (this.props.new) {
      this.props.onChange({
        payment_pack: null,
        comparator: null,
        value: null,
      });
    }
  }

  render() {
    const { filter_data, t, classes, onChange, payment_packs } = this.props;
    return (
      <div className={classes.wrapper}>
        {t(`filters.${filter_data.filter_identifier}.first`)}
        <div className={classes.selectorGrow}>
          <PaymentPackSelector
            value={filter_data.payment_pack}
            paymentPacks={payment_packs}
            onChange={(ev) => {
              onChange({ payment_pack: ev.map((pp) => pp.value) });
            }}
            helperText="choix abonnement"
            selectorClass={classes.selector}
            isMulti
          />
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={
                filter_data.payment_pack
                  ? payment_packs.length === filter_data.payment_pack.length
                  : false
              }
              onChange={() => {
                if (
                  filter_data.payment_pack &&
                  payment_packs.length === filter_data.payment_pack.length
                ) {
                  onChange({ payment_pack: [] });
                } else {
                  onChange({ payment_pack: payment_packs.map((pp) => pp.id) });
                }
              }}
              value="checkedG"
            />
          }
          label="All"
        />
        {t(`filters.${filter_data.filter_identifier}.second`)}
        <Select
          className={classes.input}
          required
          value={filter_data.comparator}
          onChange={(ev) => onChange({ comparator: ev.target.value })}
        >
          {COMPARATORS_DICT.map((item) => (
            <MenuItem key={item.key} value={item.value}>
              {t(`filters.classic_comparators.${item.value}`)}
            </MenuItem>
          ))}
        </Select>
        <DelayedNumericInput
          classes={classes}
          value={filter_data.value}
          onChange={(ev) => onChange({ value: ev.target.value })}
        />
        {this.props.t(`filters.${filter_data.filter_identifier}.third`)}
      </div>
    );
  }
}

const styles = (theme) => ({
  selectorGrow: {
    flexGrow: 0,
  },
  input: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  textInput: {
    width: '50px',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  selector: {
    minWidth: '300px',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(PaymentPackExpirationFilter);
