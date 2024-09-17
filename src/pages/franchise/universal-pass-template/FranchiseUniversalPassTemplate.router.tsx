import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Config } from '#src/config';
// @ts-expect-error
import asyncComponent from '#src/AsyncComponent';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';

const FranchiseUniversalPassTemplateListPage = asyncComponent(
  () => import('./FranchiseUniversalPassTemplateList.page'),
);
const FranchiseUniversalPassTemplateListPageReworked = asyncComponent(
  () => import('./FranchiseUniversalPassTemplateListReworked.page'),
);
const FranchiseUniversalPassTemplateDetailPage = asyncComponent(
  () => import('./FranchiseUniversalPassTemplateDetail.page'),
);

const FranchiseUniversalPaymentPackTemplateListPageToUse: React.FC = React.memo(
  () => {
    if (Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production') {
      return <FranchiseUniversalPassTemplateListPageReworked />;
    }
    return <FranchiseUniversalPassTemplateListPage />;
  },
);

const FranchiseUniversalPassTemplateRouter = () => {
  const { t } = useTranslation('navigation');

  return (
    <>
      <Helmet>
        <title>{t('franchiseMenu.products.universalPassTemplates')}</title>
      </Helmet>
      <Switch>
        <Route
          component={FranchiseUniversalPassTemplateDetailPage}
          path="/f/universal-pass-template/:paymentPackTemplateId"
        />
        <Route
          component={FranchiseUniversalPaymentPackTemplateListPageToUse}
          path="/f/universal-pass-template"
        />
      </Switch>
    </>
  );
};

export default React.memo(FranchiseUniversalPassTemplateRouter);
