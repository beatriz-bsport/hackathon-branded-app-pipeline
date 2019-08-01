// @flow
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import PriceInput from '../../../components/input/PriceInput.component';

type Props = {
  onUpdateVoucher: (price: number) => void,
  t: TFunction,
};

type State = {
  voucher: number,
};

export class InvoiceVoucher extends Component<Props, State> {
  state = { voucher: 0 };

  onChange = (event: SyntheticEvent<>) => {
    this.setState({ voucher: event.target.value });
  };

  render() {
    const { t } = this.props;
    const { voucher } = this.state;
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <Button
            onClick={() => this.props.onUpdateVoucher(voucher)}
            color="primary"
            disabled={voucher === 0}
          >
            {t('payment.updateInvoiceVoucher')}
          </Button>
        </Grid>
        <Grid item>
          <PriceInput
            onChange={this.onChange}
            value={this.state.voucher}
            variant="outlined"
          />
        </Grid>
      </Grid>
    );
  }
}

export default withNamespaces()(InvoiceVoucher);
