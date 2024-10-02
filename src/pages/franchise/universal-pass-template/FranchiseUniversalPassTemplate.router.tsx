import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { getFranchisor } from '#src/libs/franchise/selectors';
import type { RootState } from '#src/reducers';
import { Switch, Route } from 'react-router-dom';

import { Config } from '#src/config';
import { FRANCHISE_IDS_FOR_REWORKED_PAGES } from '#src/libs/franchise/constants';

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

const FranchiseUniversalPaymentPackTemplateListPageToUse: React.FC<{
  franchiseId: number;
}> = React.memo(({ franchiseId }) => {
  if (
    Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
    FRANCHISE_IDS_FOR_REWORKED_PAGES.includes(franchiseId)
  ) {
    return <FranchiseUniversalPassTemplateListPageReworked />;
  }
  return <FranchiseUniversalPassTemplateListPage />;
});

const FranchiseUniversalPassTemplateRouter = ({
  franchise,
}: ConnectedProps<typeof connector>) => {
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
          path="/f/universal-pass-template"
          render={() => (
            <FranchiseUniversalPaymentPackTemplateListPageToUse
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
export default connector(React.memo(FranchiseUniversalPassTemplateRouter));
