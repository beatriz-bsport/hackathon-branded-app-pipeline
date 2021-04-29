import React, { Component } from 'react';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/styles';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { MarketplacePassBase } from 'bsport-saas/src/pages/marketplace/MarketplacePass.page';
import { MarketplacePassData } from 'bsport-saas/src/libs/marketplace/types';

import { Theme } from 'bsport-saas/src/libs/theme/types';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';

const MarketplacePassStyled = themify(MarketplacePassBase);

type OwnProps = {
  companyId: number,
  store: any,
  theme: Theme,
  config?: MarketplacePassData,
};

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

class PassWidget extends Component<Props> {
  render() {
    const params = {
      hidePaymentPack: 'false',
      hidePrivatePass: 'false',
      hidePaymentCombo: 'false',
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
    }

    const { companyId, store, theme } = this.props;
    return (
      <div className={this.props.classes.container}>
        <MarketplacePassStyled
          companyId={companyId}
          store={store}
          theme={theme}
          params={params}
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

export default compose<any, OwnProps>(withStyles(styles))(PassWidget);
