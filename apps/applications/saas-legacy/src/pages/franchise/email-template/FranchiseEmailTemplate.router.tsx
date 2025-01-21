import React from 'react';
import { Switch, Route } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import { getFranchisor } from '#src/libs/franchise/selectors';
import type { RootState } from '#src/reducers';
import Config from '#src/config';
// @ts-expect-error
import asyncComponent from '../../../AsyncComponent';
import { useTranslation } from 'react-i18next';
import Helmet from 'react-helmet';
import { FRANCHISE_IDS_FOR_REWORKED_PAGES } from '#src/libs/franchise/constants';
const FranchiseEmailCreate = asyncComponent(
  () => import('./FranchiseEmailCreate.page'),
);
const FranchiseEmailEditor = asyncComponent(
  () => import('./FranchiseEmailEditor.page'),
);
const FranchiseEmailTemplateListPage = asyncComponent(
  () => import('./FranchiseEmailList.page'),
);

const FranchiseEmailTemplateListPageReworked = asyncComponent(
  () => import('./FranchiseEmailListReworked.page'),
);

const FranchiseEmailTemplateListPageToUse: React.FC<{
  franchiseId: number;
}> = React.memo(({ franchiseId }) => {
  if (
    Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
    FRANCHISE_IDS_FOR_REWORKED_PAGES.includes(franchiseId)
  ) {
    return <FranchiseEmailTemplateListPageReworked />;
  }
  return <FranchiseEmailTemplateListPage />;
});

const FranchiseEmailTemplateRouter = ({
  franchise,
}: ConnectedProps<typeof connector>) => {
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
          path="/f/email-template/:id"
          render={() => (
            <FranchiseEmailTemplateListPageToUse franchiseId={franchise.id} />
          )}
        />
        <Route
          exact
          path="/f/email-template"
          render={() => (
            <FranchiseEmailTemplateListPageToUse franchiseId={franchise.id} />
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

export default connector(React.memo(FranchiseEmailTemplateRouter));
