import React from 'react';
import { Switch, Route } from 'react-router';

// @ts-expect-error
import asyncComponent from '#src/AsyncComponent';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';

const FranchiseEmailCreate = asyncComponent(
  () => import('./FranchiseEmailCreate.page'),
);
const FranchiseEmailEditor = asyncComponent(
  () => import('./FranchiseEmailEditor.page'),
);
const FranchiseEmailTemplateListPage = asyncComponent(
  () => import('./FranchiseEmailList.page'),
);

const FranchiseEmailTemplateRouter = () => {
  const { t } = useTranslation('franchise');
  return (
    <>
      <Helmet>
        <title>{t('emails.pageTitle')}</title>
      </Helmet>
      <Switch>
        <Route
          exact
          component={FranchiseEmailEditor}
          path="/f/email-template/:id/edit"
        />
        <Route
          exact
          component={FranchiseEmailCreate}
          path="/f/email-template/create"
        />
        <Route
          exact
          component={FranchiseEmailTemplateListPage}
          path="/f/email-template/:id"
        />
        <Route
          exact
          component={FranchiseEmailTemplateListPage}
          path="/f/email-template"
        />
      </Switch>
    </>
  );
};

export default React.memo(FranchiseEmailTemplateRouter);
