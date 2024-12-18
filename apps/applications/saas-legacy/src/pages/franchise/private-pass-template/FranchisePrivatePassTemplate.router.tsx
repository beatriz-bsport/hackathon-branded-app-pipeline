import React from 'react';
import { Switch, Route } from 'react-router-dom';

// @ts-expect-error
import asyncComponent from '../../../AsyncComponent';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';

const FranchisePrivatePassTemplateListPage = asyncComponent(
  () => import('./FranchisePrivatePassTemplateList.page'),
);
const FranchisePrivatePassTemplateDetailPage = asyncComponent(
  () => import('./FranchisePrivatePassTemplateDetail.page'),
);

const FranchisePrivatePassTemplateRouter = () => {
  const { t } = useTranslation('navigation');

  return (
    <>
      <Helmet>
        <title>{t('franchiseMenu.products.privatePassTemplates')}</title>
      </Helmet>
      <Switch>
        <Route
          component={FranchisePrivatePassTemplateDetailPage}
          path="/f/private-pass-template/:privatePassTemplateId"
        />
        <Route
          component={FranchisePrivatePassTemplateListPage}
          path="/f/private-pass-template"
        />
      </Switch>
    </>
  );
};

export default React.memo(FranchisePrivatePassTemplateRouter);
