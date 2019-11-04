// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
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

export class PaymentPackFilter extends Component<Props, state> {
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
        <PaymentPackSelector
          value={filter_data.payment_pack}
          paymentPacks={payment_packs}
          onChange={(ev) => onChange({ payment_pack: ev })}
          helperText="choix abonnement"
          selectorClass={classes.selector}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  selector: {
    maxWidth: '350px',
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
)(PaymentPackFilter);
