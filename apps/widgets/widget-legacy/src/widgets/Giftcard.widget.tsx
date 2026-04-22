import React from 'react';
import { withStyles } from '@bsport/saas-legacy/node_modules/@material-ui/core/styles';
import themify from '@bsport/saas-legacy/src/hocs/company-themifier.hoc';
import { MarketplaceGiftcardBase } from '@bsport/saas-legacy/src/pages/marketplace/MarketplaceGiftcard.page';
import { MarketplaceGiftcardData } from '@bsport/saas-legacy/src/libs/marketplace/types';

import type { WithStyles } from '@material-ui/styles';
import type { CompanyTheme } from '@bsport/saas-legacy/src/libs/theme/types';
import { getEnv } from '../utils/env';
import { useWidgetDataVersion } from '../libs/widget/hooks';

const MarketplaceGiftcardThemed = themify(MarketplaceGiftcardBase);

type OwnProps = {
  companyId: number;
  store: any;
  theme: CompanyTheme;
  config?: MarketplaceGiftcardData;
  onWindowOpen: (url: string) => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

const GiftcardWidget: React.FC<Props> = ({
  companyId,
  store,
  theme,
  config,
  onWindowOpen,
  classes,
}) => {
  const dataVersion = useWidgetDataVersion();

  const openGiftcardConfig = (giftcardId: number, targetCompanyId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/checkout/${targetCompanyId}/giftcard/${giftcardId}/`;
    onWindowOpen(url);
  };

  return (
    <div className={classes.container}>
      <MarketplaceGiftcardThemed
        key={`giftcard-${dataVersion}`}
        companyId={companyId}
        store={store}
        theme={theme}
        goToGiftcardCheckout={openGiftcardConfig}
        params={config}
      />
    </div>
  );
};

const styles = () => ({
  container: {
    width: '100%',
  },
});

export default withStyles(styles)(GiftcardWidget);
