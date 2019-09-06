// @flow
import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import PriceInput from '../../../components/input/PriceInput.component';

type Props = {
  onUpdateVoucher: (price: number) => void,
  t: TFunction,
  classes: Object,
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
      <div className={this.props.classes.container}>
        <Button
          onClick={() => {
            this.props.onUpdateVoucher(voucher);
            this.setState({ voucher: 0 });
          }}
          color="secondary"
          variant="contained"
          disabled={voucher === 0 || voucher === '0'}
        >
          <AddIcon className={this.props.classes.leftIcon} />
          {t('payment.updateInvoiceVoucher')}
        </Button>
        <PriceInput
          onChange={this.onChange}
          value={this.state.voucher}
          variant="outlined"
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default withStyles(styles)(withNamespaces()(InvoiceVoucher));
