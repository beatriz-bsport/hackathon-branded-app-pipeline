import React from 'react';
import { Switch, Route } from 'react-router-dom';

// @ts-expect-error
import asyncComponent from '../../../AsyncComponent';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';

const FranchisePaymentPackTemplateListPage = asyncComponent(
  () => import('./FranchisePaymentPackTemplateList.page'),
);
const FranchisePaymentPackTemplateDetailPage = asyncComponent(
  () => import('./FranchisePaymentPackTemplateDetail.page'),
);

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
          component={FranchisePaymentPackTemplateListPage}
          path="/f/payment-pack-template"
        />
      </Switch>
    </>
  );
};

export default React.memo(FranchisePaymentPackTemplateRouter);
