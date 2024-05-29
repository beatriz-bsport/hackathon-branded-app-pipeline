import React, { Component } from 'react';
import { withStyles } from 'bsport-saas/node_modules/@material-ui/core/styles';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { MarketplaceGiftcardBase } from 'bsport-saas/src/pages/marketplace/MarketplaceGiftcard.page';
import { MarketplaceGiftcardData } from 'bsport-saas/src/libs/marketplace/types';

import type { WithStyles } from '@material-ui/styles';
import type { CompanyTheme } from 'bsport-saas/src/libs/theme/types';
import { getEnv } from '../utils/env';

const MarketplaceGiftcardThemed = themify(MarketplaceGiftcardBase);

type OwnProps = {
  companyId: number,
  store: any,
  theme: CompanyTheme,
  config?: MarketplaceGiftcardData,
  onWindowOpen: (url: string) => void,
};

type Props = OwnProps & WithStyles<typeof styles>;

class GiftcardWidget extends Component<Props> {
  openGiftcardConfig = (giftcardId: number, companyId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/checkout/${companyId}/giftcard/${giftcardId}/`;
    this.props.onWindowOpen(url);
  };

  render() {
    const { companyId, store, theme, config } = this.props;
    return (
      <div className={this.props.classes.container}>
        <MarketplaceGiftcardThemed
          companyId={companyId}
          store={store}
          theme={theme}
          goToGiftcardCheckout={this.openGiftcardConfig}
          params={config}
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

export default withStyles(styles)(GiftcardWidget);
