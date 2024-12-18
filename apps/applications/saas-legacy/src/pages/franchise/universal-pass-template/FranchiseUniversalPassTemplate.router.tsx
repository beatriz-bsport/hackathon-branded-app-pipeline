import React from 'react';
import { Switch, Route } from 'react-router-dom';

// @ts-expect-error
import asyncComponent from '#src/AsyncComponent';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';

const FranchiseUniversalPassTemplateListPage = asyncComponent(
  () => import('./FranchiseUniversalPassTemplateList.page'),
);
const FranchiseUniversalPassTemplateDetailPage = asyncComponent(
  () => import('./FranchiseUniversalPassTemplateDetail.page'),
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
          component={FranchiseUniversalPassTemplateListPage}
          path="/f/universal-pass-template"
        />
      </Switch>
    </>
  );
};

export default React.memo(FranchiseUniversalPassTemplateRouter);
