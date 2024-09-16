import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Config } from '#src/config';
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

const FranchisePaymentPackTemplateListPageToUse: React.FC = React.memo(() => {
  if (Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production') {
    return <FranchisePaymentPackTemplateListPageReworked />;
  }
  return <FranchisePaymentPackTemplateListPage />;
});

const FranchisePaymentPackTemplateRouter = () => {
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
          component={FranchisePaymentPackTemplateListPageToUse}
          path="/f/payment-pack-template"
        />
      </Switch>
    </>
  );
};

export default React.memo(FranchisePaymentPackTemplateRouter);
