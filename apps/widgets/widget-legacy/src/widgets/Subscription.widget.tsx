import React, { useEffect } from 'react';
import { Theme } from '@material-ui/core';
import themify from '@bsport/saas-legacy/src/hocs/company-themifier.hoc';
import { MarketplaceContractBase } from '@bsport/saas-legacy/src/pages/marketplace/MarketplaceContract';
import { getEnv } from '../utils/env';

const MarketplaceContractStyled = themify(MarketplaceContractBase);

type Props = {
  companyId: number,
  store: any,
  theme: Theme,
  onWindowOpen: (url: string) => void,
  uniqueWidgetId: string,
};

const SubscriptionWidget: React.FC<Props> = ({
  companyId,
  store,
  theme,
  uniqueWidgetId,
  onWindowOpen,
}) => {
  useEffect(() => {
    window?.addEventListener('message', handleAddToCartPostMessages);

    return () =>
      window?.removeEventListener('message', handleAddToCartPostMessages);
  }, []);

  const handleAddToCartPostMessages = (event: MessageEvent) => {
    // If the postMessage includes a uniqueWidgetId parameter and the provided ID is not the same as the one belonging to this widget,
    // it indicates that this widget was not targeted. In such cases, we take no action.
    if (
      event?.data?.data?.uniqueWidgetId &&
      event?.data?.data?.uniqueWidgetId !== uniqueWidgetId
    ) {
      return;
    }
    if (
      event?.data?.type === 'bsport:subscription:add-to-cart:contract' &&
      event?.data?.data?.contract_id
    ) {
      addToCart(event.data.data.contract_id);
    }
  };

  const addToCart = (contractId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/checkout/${companyId}/subscription/${contractId}`;
    onWindowOpen(url);
  };

  return (
    <MarketplaceContractStyled
      companyId={companyId}
      theme={theme}
      store={store}
      onAddToCart={addToCart}
    />
  );
};

export default React.memo(SubscriptionWidget);
