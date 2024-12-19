import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import WidgetPaymentPackTemplateListPage from 'bsport-saas/src/pages/franchise/payment-pack-template/WidgetPaymentPackTemplateList.page';
import { Theme } from 'bsport-saas/src/libs/theme/types';

import {
  MarketplacePaymentPackTemplateData,
  MarketplacePaymentPackTemplateParams,
} from 'bsport-saas/src/libs/marketplace/types';
import { buildFranchiseSelectionThenCheckoutUrl } from './utils';

const WidgetPaymentPackTemplateListPageStyled = themify(
  WidgetPaymentPackTemplateListPage,
);

type Props = {
  config?: MarketplacePaymentPackTemplateData,
  title: string,
  store: any,
  theme: Theme,
  franchiseId: number,
  onWindowOpen: (url: string) => void,
};

export const PaymentPackTemplate: React.FC<Props> = ({
  franchiseId,
  onWindowOpen,
  store,
  theme,
  config,
}) => {
  const classes = useStyles();
  const [params, setParams] = useState<MarketplacePaymentPackTemplateParams>({
    paymentPackTemplateList: config?.paymentPackTemplateList || [],
  });

  useEffect(() => {
    if (config?.paymentPackTemplateList?.length > 0) {
      setParams({ paymentPackTemplateList: config?.paymentPackTemplateList });
    }
  }, [config?.paymentPackTemplateList?.length]);

  const goToFranchiseSelection = React.useCallback(
    (paymentPackTemplateId: number, companies: Array<number>) => {
      const url = buildFranchiseSelectionThenCheckoutUrl(
        franchiseId,
        paymentPackTemplateId,
        companies,
      );

      url && onWindowOpen(url);
    },
    [franchiseId, buildFranchiseSelectionThenCheckoutUrl, onWindowOpen],
  );

  return (
    <div className={classes.container}>
      <WidgetPaymentPackTemplateListPageStyled
        theme={theme}
        store={store}
        franchiseId={franchiseId}
        goToFranchiseSelection={goToFranchiseSelection}
        params={params}
      />
    </div>
  );
};

const useStyles = makeStyles({
  container: {
    width: '100%',
  },
});

export default React.memo(PaymentPackTemplate);
