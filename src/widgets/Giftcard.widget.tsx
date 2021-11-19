import React, { Component } from 'react';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/styles';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { MarketplaceGiftcardBase } from 'bsport-saas/src/pages/marketplace/MarketplaceGiftcard.page';
import { MarketplaceGiftcardData } from 'bsport-saas/src/libs/marketplace/types';

import { Theme } from 'bsport-saas/src/libs/theme/types';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { getEnv } from '../utils/env';

const MarketplaceGiftcardThemed = themify(MarketplaceGiftcardBase);

type OwnProps = {
  companyId: number,
  store: any,
  theme: Theme,
  config?: MarketplaceGiftcardData,
  onWindowOpen: (url: string) => void,
};

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

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

export default compose<any, OwnProps>(withStyles(styles))(GiftcardWidget);
