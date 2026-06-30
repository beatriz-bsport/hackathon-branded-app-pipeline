import { useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router";

import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { useSmartlistNavigation } from "#src/hooks/use-smartlist-navigation";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import { invariant } from "#src/utils/invariant";

import type { DetailsPageOutletContext } from "./details-page-outlet-context";

export const DetailsPage = () => {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={(props) => <DetailPageErrorFallback {...props} />}
    >
      <DetailsPageOutlet />
    </QueryBoundary>
  );
};

function DetailsPageOutlet() {
  const { id } = useParams<{ id: string }>();
  invariant(id, "Expected id param to be defined");

  const location = useLocation();
  const { navigateToSmartlistParameters } = useSmartlistNavigation();
  const { data: smartlist } = useSmartlistDetailSuspenseQuery(id);

  useEffect(() => {
    const isAtBasePath = location.pathname === SMARTLIST_APP_LINKS.details(id);

    if (isAtBasePath) {
      navigateToSmartlistParameters(id, { replace: true });
    }
  }, [id, location.pathname, navigateToSmartlistParameters]);

  const detailsOutletContext: DetailsPageOutletContext = {
    smartlistId: id,
    smartlist,
  };

  return <Outlet context={detailsOutletContext} />;
}
