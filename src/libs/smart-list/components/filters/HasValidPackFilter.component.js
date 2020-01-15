// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Selector from '../MultiSelector.component';
import type { PaymentPack } from '../../../payment-packs/types';

type Props = {
  filter_data: any,
  t: TFunction,
  payment_packs: Array<PaymentPack>,
  classes: Object,
  onChange: (any) => void,
  new: boolean,
};

export class HasValidPackFilter extends Component<Props, state> {
  componentDidMount() {
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
        {t(`filters.${filter_data.filter_identifier}.second`)}
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
