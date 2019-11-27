// @flow

import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';
import Button from '@material-ui/core/Button';

import Checkbox from '@material-ui/core/Checkbox';
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
        <Button
          onClick={() => {
            if (
              filter_data.payment_pack &&
              payment_packs.length === filter_data.payment_pack.length
            ) {
              onChange({ payment_pack: [] });
            } else {
              onChange({ payment_pack: payment_packs.map((pp) => pp.id) });
            }
          }}
        >
          <Checkbox
            checked={
              filter_data.payment_pack
                ? payment_packs.length === filter_data.payment_pack.length
                : false
            }
            tabIndex={-1}
            disableRipple
          />
          Tous
        </Button>
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
)(PaymentPackFilter);
