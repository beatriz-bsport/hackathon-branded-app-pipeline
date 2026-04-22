import React from 'react';
import { Theme } from '@material-ui/core';
import themify from '@bsport/saas-legacy/src/hocs/company-themifier.hoc';
import { MarketplaceShopBase } from '@bsport/saas-legacy/src/pages/marketplace/MarketplaceShop.page';
import { getEnv } from '../utils/env';
import { useWidgetDataVersion } from '../libs/widget/hooks';

const MarketplaceShopStyled = themify(MarketplaceShopBase);

type Props = {
  companyId: number;
  config: any;
  store: any;
  theme: Theme;
  onWindowOpen: (url: string) => void;
};

const ShopWidget: React.FC<Props> = ({
  companyId,
  store,
  theme,
  onWindowOpen,
}) => {
  const dataVersion = useWidgetDataVersion();

  const addToCart = (shopItemId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/customer/payment/shop-item/${shopItemId}?membership=${companyId}`;
    onWindowOpen(url);
  };

  return (
    <MarketplaceShopStyled
      key={`shop-${dataVersion}`}
      companyId={companyId}
      theme={theme}
      store={store}
      onAddToCart={addToCart}
    />
  );
};

export default ShopWidget;
