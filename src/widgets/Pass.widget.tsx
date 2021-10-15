import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { MarketplacePassBase } from 'bsport-saas/src/pages/marketplace/MarketplacePass.page';
import { MarketplacePassData } from 'bsport-saas/src/libs/marketplace/types';

import { Theme } from 'bsport-saas/src/libs/theme/types';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { RootState } from '../reducers';
import { getEnv } from '../utils/env';
import { bridgeRequestMemberTag } from '../libs/bridge/actions';

const MarketplacePassStyled = themify(MarketplacePassBase);

type OwnProps = {
  companyId: number,
  store: any,
  theme: Theme,
  config?: MarketplacePassData,
  onWindowOpen: (url: string) => void,
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

class PassWidget extends Component<Props> {
  componentDidMount() {
    this.props.bridgeRequestMemberTag();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.authenticated !== this.props.authenticated ||
      prevProps?.username !== this.props.username
    ) {
      this.props.bridgeRequestMemberTag();
    }
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
    const params = {
      hidePaymentPack: 'false',
      hidePrivatePass: 'false',
      hidePaymentCombo: 'false',
      paymentPackCategories: [],
    };

    if (this.props.config) {
      if (this.props.config.hidePaymentPack) {
        params.hidePaymentPack = 'false';
      }
      if (this.props.config.hidePrivatePass) {
        params.hidePrivatePass = 'false';
      }
      if (this.props.config.hidePaymentCombo) {
        params.hidePaymentCombo = 'false';
      }
      if (this.props.config.paymentPackCategories?.length > 0) {
        params.paymentPackCategories = this.props.config.paymentPackCategories;
      }
    }

    const { companyId, store, theme } = this.props;
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
          memberTagList={this.props.memberTagList}
          authenticated={this.props.authenticated}
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

const mapStateToProps = (state: RootState) => ({
  authenticated: state.bridge.authentication.authenticated,
  username: state.bridge.authentication.username,
  memberTagList: state.bridge.tag.tag_list,
});

const mapDispatchToProps = {
  bridgeRequestMemberTag,
};

export default compose<any, OwnProps>(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(PassWidget);
