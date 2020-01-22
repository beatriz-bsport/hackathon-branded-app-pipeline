// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Selector from '../MultiSelector.component';
import type { PaymentPack } from '../../../payment-packs/types';
import PaymentPackListItem from '../../../payment-packs/components/PaymentPackListItem.component';

type Props = {
  filter_data: any,
  t: TFunction,
  payment_packs: Array<PaymentPack>,
  fetchItems: any,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
  fetchItems: any,
  fetchBulkItems: any,
  setNotNullableData: (Array<string>) => void,
  renderSelectorWarning: (string, boolean) => void,
};

export class HasValidPackFilter extends Component<Props, state> {
  componentDidMount() {
    this.props.setNotNullableData(['payment_pack']);

    const { payment_pack } = this.props.filter_data;
    if (payment_pack && payment_pack.length === 1) {
      this.props.fetchBulkItems.payment_packs(payment_pack);
    }
    this.props.setNotNullableData(['payment_pack']);

    if (this.props.new) {
      this.props.onChange({ payment_pack: null });
    }
  }

  render() {
    const { filter_data, t, classes, onChange, payment_packs } = this.props;
    return (
      <div className={classes.wrapper}>
        {t(`filters.${filter_data.filter_identifier}.first`)}

        <Selector
          helperText={t('multiSelector.paymentPacks.helperText')}
          helperSelectedText={t(
            'multiSelector.paymentPacks.helperSelectedText',
          )}
          textFieldPlaceholder={t(
            'multiSelector.paymentPacks.textFieldPlaceholder',
          )}
          renderItem={(item) => {
            return <PaymentPackListItem pack={item} />;
          }}
          helperAllSelectedText={t(
            'multiSelector.paymentPacks.helperAllSelectedText',
          )}
          fetchItems={this.props.fetchItems.payment_packs}
          nameIdentifier="name"
          selectAll={this.props.filter_data.select_all_payment_pack}
          items={payment_packs}
          selectedItems={filter_data.payment_pack}
          onChange={(items, selectAll) => {
            if (
              filter_data.payment_pack &&
              !(
                items.length === filter_data.payment_pack.length &&
                [...items].sort().every((value, index) => {
                  return value === [...filter_data.payment_pack].sort()[index];
                })
              )
            ) {
              onChange({
                payment_pack: items,
                select_all_payment_packs: selectAll,
              });
            }
            if (!filter_data.payment_pack && items.length > 0) {
              onChange({
                payment_pack: items,
                select_all_payment_packs: selectAll,
              });
            }
          }}
        />
        {t(`filters.${filter_data.filter_identifier}.second`)}
        {this.props.renderSelectorWarning(
          t('multiSelector.paymentPacks.warning'),
          true,
          filter_data.payment_pack,
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  selectorGrow: {
    flexGrow: 0,
  },
  selector: {
    minWidth: '300px',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default compose(
  withNamespaces(['smartList']),
  withStyles(styles),
)(HasValidPackFilter);
