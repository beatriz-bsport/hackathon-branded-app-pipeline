// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import withStyles from '@material-ui/core/styles/withStyles';
import type { PaymentPack } from '../../../payment-packs/types';
import Selector from '../MultiSelector.component';

type Props = {
  filter_data: any,
  t: TFunction,
  payment_packs: Array<PaymentPack>,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
};

export class PaymentPackPurchasedFilter extends Component<Props, state> {
  componentDidMount() {
    if (this.props.new) {
      this.props.onChange({ payment_pack: null, has_bought: null });
    }
  }

  render() {
    const { filter_data, t, classes, onChange, payment_packs } = this.props;
    return (
      <div className={classes.wrapper}>
        {t(`filters.${filter_data.filter_identifier}.first`)}
        <Select
          className={classes.input}
          value={filter_data.has_bought}
          onChange={(ev) => onChange({ has_bought: ev.target.value })}
        >
          <MenuItem key={true} value={true}>
            {t(`filters.${filter_data.filter_identifier}.has_bought`)}
          </MenuItem>
          <MenuItem key={false} value={false}>
            {t(`filters.${filter_data.filter_identifier}.hasnt_bought`)}
          </MenuItem>
        </Select>
        {t(`filters.${filter_data.filter_identifier}.second`)}
        <Selector
          helperText={t('multiSelector.paymentPacks.helperText')}
          helperSelectedText={t(
            'multiSelector.paymentPacks.helperSelectedText',
          )}
          textFieldPlaceholder={t(
            'multiSelector.paymentPacks.textFieldPlaceholder',
          )}
          primaryTextIdentifier="name"
          items={payment_packs}
          selectedItems={filter_data.payment_pack}
          onChange={(items) => {
            if (
              filter_data.payment_pack &&
              !(
                items.length === filter_data.payment_pack.length &&
                [...items].sort().every((value, index) => {
                  return value === [...filter_data.payment_pack].sort()[index];
                })
              )
            ) {
              onChange({ payment_pack: items });
            }
            if (!filter_data.payment_pack && items.length > 0) {
              onChange({ payment_pack: items });
            }
          }}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  selector: {
    minWidth: '300px',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(PaymentPackPurchasedFilter);
