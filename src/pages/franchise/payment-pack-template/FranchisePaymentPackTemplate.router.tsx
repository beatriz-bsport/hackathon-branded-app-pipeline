import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { getFranchisor } from '#src/libs/franchise/selectors';
import type { RootState } from '#src/reducers';
import { Switch, Route } from 'react-router-dom';

import { Config } from '#src/config';
import { FRANCHISE_IDS_FOR_REWORKED_PAGES } from '#src/libs/franchise/constants';

// @ts-expect-error
import asyncComponent from '../../../AsyncComponent';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';

const FranchisePaymentPackTemplateListPage = asyncComponent(
  () => import('./FranchisePaymentPackTemplateList.page'),
);

const FranchisePaymentPackTemplateListPageReworked = asyncComponent(
  () => import('./FranchisePaymentPackTemplateListReworked.page'),
);
const FranchisePaymentPackTemplateDetailPage = asyncComponent(
  () => import('./FranchisePaymentPackTemplateDetail.page'),
);

const FranchisePaymentPackTemplateListPageToUse: React.FC<{
  franchiseId: number;
}> = React.memo(({ franchiseId }) => {
  if (
    Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
    FRANCHISE_IDS_FOR_REWORKED_PAGES.includes(franchiseId)
  ) {
    return <FranchisePaymentPackTemplateListPageReworked />;
  }
  return <FranchisePaymentPackTemplateListPage />;
});

const FranchisePaymentPackTemplateRouter = ({
  franchise,
}: ConnectedProps<typeof connector>) => {
  const { t } = useTranslation('navigation');

  return (
    <>
      <Helmet>
        <title>{t('franchiseMenu.products.paymentPackTemplates')}</title>
      </Helmet>
      <Switch>
        <Route
          component={FranchisePaymentPackTemplateDetailPage}
          path="/f/payment-pack-template/:paymentPackTemplateId"
        />
        <Route
          path="/f/payment-pack-template"
          render={() => (
            <FranchisePaymentPackTemplateListPageToUse
              franchiseId={franchise.id}
            />
          )}
        />
      </Switch>
    </>
  );
};

const connector = connect(
  (state: RootState) => ({
    franchise: getFranchisor(state),
  }),
  null,
);

export default connector(React.memo(FranchisePaymentPackTemplateRouter));
