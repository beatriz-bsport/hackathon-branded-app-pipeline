import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { getFranchisor } from '#src/libs/franchise/selectors';
import type { RootState } from '#src/reducers';
import { Switch, Route } from 'react-router-dom';

import { Config } from '#src/config';
import { FRANCHISE_IDS_FOR_REWORKED_PAGES } from '#src/libs/franchise/constants';
// @ts-expect-error
import asyncComponent from '../../../AsyncComponent';

const FranchiseCouponTemplateListPage = asyncComponent(
  () => import('./FranchiseCouponTemplateList.page'),
);

const FranchiseCouponTemplateListPageReworked = asyncComponent(
  () => import('./FranchiseCouponTemplateListReworked.page'),
);
const FranchiseCouponTemplateDetailPage = asyncComponent(
  () => import('./FranchiseCouponTemplateDetail.page'),
);

const FranchiseCouponemplateListPageToUse: React.FC<{ franchiseId: number }> =
  React.memo(({ franchiseId }) => {
    if (
      Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
      FRANCHISE_IDS_FOR_REWORKED_PAGES.includes(franchiseId)
    ) {
      return <FranchiseCouponTemplateListPageReworked />;
    }
    return <FranchiseCouponTemplateListPage />;
  });

const FranchiseCouponTemplateRouter = ({
  franchise,
}: ConnectedProps<typeof connector>) => {
  return (
    <Switch>
      <Route
        component={FranchiseCouponTemplateDetailPage}
        path="/f/coupon-template/:couponTemplateId"
      />
      <Route
        path="/f/coupon-template"
        render={() => (
          <FranchiseCouponemplateListPageToUse franchiseId={franchise.id} />
        )}
      />
    </Switch>
  );
};

const connector = connect(
  (state: RootState) => ({
    franchise: getFranchisor(state),
  }),
  null,
);

export default connector(React.memo(FranchiseCouponTemplateRouter));
