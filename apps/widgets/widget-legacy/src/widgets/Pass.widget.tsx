import React, { Component } from 'react';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';
import { withStyles } from '@bsport/saas-legacy/node_modules/@material-ui/core/styles';
import themify from '@bsport/saas-legacy/src/hocs/company-themifier.hoc';
import { MarketplacePassBase } from '@bsport/saas-legacy/src/pages/marketplace/MarketplacePass';
import type {
  MarketplacePassData,
  MarketplacePassParams,
} from '@bsport/saas-legacy/src/libs/marketplace/types';

import type { CompanyTheme } from '@bsport/saas-legacy/src/libs/theme/types';
import type { WithStyles } from '@material-ui/styles';
import { RootState } from '../reducers';
import { getEnv } from '../utils/env';

const MarketplacePassStyled = themify(MarketplacePassBase);

type OwnProps = {
  companyId: number;
  store: any;
  theme: CompanyTheme;
  config?: MarketplacePassData;
  onWindowOpen: (url: string) => void;
  uniqueWidgetId: string;
  parentElement: string;
};

type Props = OwnProps &
  WithStyles<typeof styles> &
  ConnectedProps<typeof connector>;

class PassWidget extends Component<Props> {
  componentDidMount() {
    window?.addEventListener('message', this.handleAddToCartPostMessages);
  }

  handleAddToCartPostMessages = (event: MessageEvent) => {
    // If the postMessage includes a uniqueWidgetId parameter and the provided ID is not the same as the one belonging to this widget,
    // it indicates that this widget was not targeted. In such cases, we take no action.
    if (
      event?.data?.data?.uniqueWidgetId &&
      event?.data?.data?.uniqueWidgetId !== this.props.uniqueWidgetId
    ) {
      return;
    }
    let object_id = null;
    let trigger_action = null;
    switch (event?.data?.type) {
      case 'bsport:pass:add-to-cart:payment-pack':
        trigger_action = this.addPaymentPackToCart;
        object_id = event?.data?.data?.payment_pack_id;
        break;
      case 'bsport:pass:add-to-cart:payment-combo':
        trigger_action = this.addComboToCart;
        object_id = event?.data?.data?.payment_combo_id;
        break;
      case 'bsport:pass:add-to-cart:private-pass':
        trigger_action = this.addPrivatePassToCart;
        object_id = event?.data?.data?.private_pass_id;
        break;
      default:
        break;
    }

    if (object_id && trigger_action) trigger_action(object_id);
  };

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.authenticated !== this.props.authenticated ||
      prevProps?.username !== this.props.username
    ) {
    }
  }

  componentWillUnmount(): void {
    window?.removeEventListener('message', this.handleAddToCartPostMessages);
  }

  addComboToCart = (comboId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/customer/payment/combo/${comboId}`;
    this.props.onWindowOpen(url);
  };

  addPaymentPackToCart = (packId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/customer/payment/pass/${packId}`;
    this.props.onWindowOpen(url);
  };

  addPrivatePassToCart = (packId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/customer/payment/private-pass/${packId}?membership=${this.props.companyId}`;
    this.props.onWindowOpen(url);
  };

  render() {
    const params: MarketplacePassParams = {
      hidePaymentPack: 'false',
      hidePrivatePass: 'false',
      hidePaymentCombo: 'false',
      hideFilters: 'false',
      paymentPackCategories: null,
      privatePassCategories: null,
    };

    if (this.props.config) {
      if (this.props.config.hidePaymentPack) {
        params.hidePaymentPack = 'true';
      }
      if (this.props.config.hidePrivatePass) {
        params.hidePrivatePass = 'true';
      }
      if (this.props.config.hidePaymentCombo) {
        params.hidePaymentCombo = 'true';
      }
      if (this.props.config.hideFilters) {
        params.hideFilters = 'true';
      }
      if (this.props.config.paymentPackCategories?.length > 0) {
        params.paymentPackCategories = this.props.config.paymentPackCategories;
      }
      if (this.props.config.privatePassCategories?.length > 0) {
        params.privatePassCategories = this.props.config.privatePassCategories;
      }
    }

    const { companyId, store, theme, parentElement } = this.props;

    return (
      <div className={this.props.classes.container}>
        <MarketplacePassStyled
          companyId={companyId}
          store={store}
          theme={theme}
          params={params}
          addComboToCart={this.addComboToCart}
          addPaymentPackToCart={this.addPaymentPackToCart}
          addPrivatePassToCart={this.addPrivatePassToCart}
          authenticated={this.props.authenticated}
          widgetContext={{ parentElement: this.props.parentElement }}
        />
      </div>
    );
  }
}

const styles = () => ({
  container: {
    width: '100%',
  },
});

const connector = connect((state: RootState) => ({
  authenticated: state.auth.authenticated,
  username: state.auth.username,
}));

export default compose<Props, OwnProps>(
  withStyles(styles),
  connector,
)(PassWidget);
